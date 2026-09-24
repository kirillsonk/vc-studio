import { build } from "esbuild";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import assert from "node:assert/strict";

const temp = await mkdtemp(join(tmpdir(), "sborka-test-"));
await build({ entryPoints: ["server/intake.ts", "server/worker.ts"], outdir: temp, bundle: true, format: "esm", platform: "node" });
const { nextRequestSchema, generateNext, cleanCopy } = await import(pathToFileURL(join(temp, "intake.js")));
const { handle, consumeLimit } = await import(pathToFileURL(join(temp, "worker.js")));
const req = { schemaVersion: 1, sessionId: "test-session-123456", service: null, task: "Нужен сайт", answers: [], forceSummary: false };
const question = { type: "question", message: "Уточню детали", question: "Для кого делаем проект?", options: ["Для компании", "Для агентства"], summary: { title: "", items: [] }, internal: { clientType: "unknown", complexity: "unknown", notes: "private note" } };
const summary = { ...question, type: "summary", question: "", options: [], summary: { title: "Сайт", items: [{ label: "Задача", value: "Нужен сайт" }] } };
const upstream = value => async () => {
  const turn = value.type === "question" ? {type:value.type,message:value.message,question:value.question,options:value.options} : {type:value.type,message:value.message,summary:value.summary};
  return Response.json({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({turn,internal:value.internal}) }] }] });
};
function database() {
  const db = new DatabaseSync(":memory:");
  return readFile("drizzle/0000_productive_toxin.sql", "utf8").then(sql => {
    db.exec(sql);
    return { db, env: { CHATGPT_PLATFORM_API_KEY: "unit-test-only", DB: { prepare(sql) { return { bind(...args) { return { first: async () => db.prepare(sql).get(...args) ?? null, run: async () => db.prepare(sql).run(...args) }; } }; } } } };
  });
}
const request = (body = req, overrides = {}) => new Request("https://site.example/api/intake/next", {
  method: "POST", headers: { Origin: "https://site.example", "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1" }, body: JSON.stringify(body), ...overrides,
});

await test("input rejects oversized data, unknown fields, contacts and unsupported schema", () => {
  for (const body of [ { ...req, task: "x".repeat(4001) }, { ...req, contacts: { email: "a@example.com" } }, { ...req, schemaVersion: 2 }, { ...req, sessionId: "../bad" }, { ...req, answers: Array(6).fill({ question: "?", answer: "" }) }, { ...req, answers: [{ question: "?", answer: "x".repeat(601) }] } ]) assert.equal(nextRequestSchema.safeParse(body).success, false);
  assert.equal(nextRequestSchema.safeParse({ ...req, task: "x".repeat(4000) }).success, true);
});
await test("model request excludes session and recognizable free-text contacts; no storage", async () => {
  let sent;
  const result = await generateNext({ ...req, task: "Пишите a@example.com, @somebody или +7 (999) 123-45-67, https://x.example/?email=a@example.com" }, "test-key", async (url, options) => {
    assert.equal(url, "https://api.openai.com/v1/responses");
    sent = JSON.parse(options.body);
    return upstream(question)();
  });
  const input = JSON.stringify(sent.input);
  for (const secret of ["a@example.com", "@somebody", "999", req.sessionId, "test-key"]) assert.equal(input.includes(secret), false);
  assert.equal(sent.store, false);
  assert.equal(sent.text.format.strict, true);
  assert.equal(JSON.stringify(sent.text.format.schema).includes('"oneOf"'), false);
  assert.equal(sent.text.format.schema.properties.turn.anyOf.length, 2);
  assert.equal("internal" in result, false);
});
await test("forced or five-answer flow cannot receive another question", async () => {
  for (const input of [{ ...req, forceSummary: true }, { ...req, answers: Array(5).fill({ question: "Вопрос?", answer: "" }) }]) {
    await assert.rejects(() => generateNext(input, "test", upstream(question)));
    assert.equal((await generateNext(input, "test", upstream(summary))).type, "summary");
  }
});
await test("invalid JSON, refusals, incomplete and excess options fail closed", async () => {
  const replies = [Response.json({status:"incomplete"}), Response.json({status:"completed",output:[{type:"message",content:[{type:"refusal"}]}]}), Response.json({status:"completed",output:[{type:"message",content:[{type:"output_text",text:"not-json"}]}]})];
  for (const reply of replies) await assert.rejects(() => generateNext(req, "test", async () => reply));
  await assert.rejects(() => generateNext(req, "test", upstream({ ...question, options: Array(5).fill("Option") })));
  await assert.rejects(() => generateNext({ ...req, answers: [{ question: question.question, answer: "" }] }, "test", upstream(question)));
});
await test("TOV normalization removes forbidden characters and trailing dots", () => {
  assert.equal(cleanCopy("Вс\u0451 \u2014 готово."), "Все, готово");
  assert.equal(cleanCopy("ИИ отвечает"), "AI отвечает");
});
await test("real SQL counter is atomic across parallel requests and expires", async () => {
  const { env, db } = await database();
  const calls = await Promise.all(Array.from({ length: 40 }, () => consumeLimit(env, "test", 30, 600, 1000)));
  assert.equal(calls.filter(r => r.allowed).length, 30);
  assert.equal((await consumeLimit(env, "test", 30, 600, 1600)).allowed, true);
  db.close();
});
await test("HTTP gateway validates origin and content, hides failures, disables submit", async () => {
  const { env, db } = await database();
  let calls = 0;
  const fetcher = async () => { calls++; return upstream(question)(); };
  assert.equal((await handle(request(req, { headers: { Origin: "https://evil.example", "Content-Type": "application/json" } }), env, fetcher)).status, 403);
  assert.equal((await handle(request(req, { headers: { Origin: "https://site.example", "Content-Type": "text/plain" } }), env, fetcher)).status, 415);
  assert.equal((await handle(request({ ...req, task: "x".repeat(25000) }), env, fetcher)).status, 400);
  assert.equal(calls, 0);
  assert.equal((await handle(request(), env, fetcher)).status, 200);
  assert.equal(calls, 1);
  const failure = await handle(request(), env, async () => Response.json({ secret: "should-not-leak" }, { status: 401 }));
  assert.equal(failure.status, 502);
  assert.equal((await failure.text()).includes("should-not-leak"), false);
  assert.equal((await handle(request(), { CHATGPT_PLATFORM_API_KEY: "test" }, fetcher)).status, 503);
  const submit = new Request("https://site.example/api/intake/submit", { method: "POST", headers: { Origin: "https://site.example", "Content-Type": "application/json" }, body: "{}" });
  assert.deepEqual(await (await handle(submit, env, fetcher)).json(), { ok: false, error: "delivery_not_configured" });
  db.close();
});
await test("HTTP limits requests before OpenAI and stores no raw IP or task", async () => {
  const { env, db } = await database();
  for (let i = 0; i < 30; i++) assert.equal((await handle(request(), env, upstream(question))).status, 200);
  const response = await handle(request(), env, () => { throw new Error("must not call"); });
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("Retry-After")) > 0);
  const rows = JSON.stringify(db.prepare("SELECT * FROM intake_limits").all());
  assert.equal(rows.includes("192.0.2.1"), false);
  assert.equal(rows.includes(req.task), false);
  db.close();
});
await rm(temp, { recursive: true, force: true });
