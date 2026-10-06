import { build } from "esbuild";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { createValidFileMatcher } from "next/dist/server/lib/find-page-file.js";
import { removePagePathTail } from "next/dist/shared/lib/page-path/remove-page-path-tail.js";

const temp = await mkdtemp(join(tmpdir(), "sborka-node-test-"));
try {
  await build({ entryPoints: ["server/node-runtime.ts", "server/node/memory-state.ts", "server/worker.ts", "server/telegram.ts"], outdir: temp, entryNames: "[name]", outExtension: { ".js": ".cjs" }, bundle: true, format: "cjs", platform: "node", target: "node22" });
  const { adaptRequest, publicOrigin, trustedProxyIp, routeRequest, runtimeEnv } = (await import(pathToFileURL(join(temp, "node-runtime.cjs")))).default;
  const { memoryState } = (await import(pathToFileURL(join(temp, "memory-state.cjs")))).default;
  const { deliverLead } = (await import(pathToFileURL(join(temp, "telegram.cjs")))).default;
  const { consumeLimit } = (await import(pathToFileURL(join(temp, "worker.cjs")))).default;
  const origin = "https://sborkadigital.ru";
  const values = { PUBLIC_ORIGIN: origin };
  const request = (path, body = {}, headers = {}) => new Request(`http://untrusted.internal${path}`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });

  await test("public origin is explicit and rejects paths, credentials and insecure public URLs", () => {
    assert.equal(publicOrigin(origin), origin);
    assert.equal(publicOrigin("http://127.0.0.1:3000"), "http://127.0.0.1:3000");
    for (const value of [undefined, "http://sborkadigital.ru", "https://user:secret@site.example", "https://site.example/private", "https://site.example?x=1", "https://site.example#test"]) assert.throws(() => publicOrigin(value));
  });
  await test("adapter ignores forged IP and forwarding headers unless ingress is configured", async () => {
    const req = request("/api/brief", { task: "Example" }, { "CF-Connecting-IP": "192.0.2.99", "X-Real-IP": "192.0.2.2", "X-Forwarded-For": "192.0.2.3, 192.0.2.4", "X-Forwarded-Host": "evil.example" });
    const adapted = adaptRequest(req, values);
    assert.equal(adapted.url, `${origin}/api/intake/next`);
    assert.equal(adapted.headers.get("CF-Connecting-IP"), null);
    assert.equal(adapted.headers.get("X-Real-IP"), null);
    assert.equal(adapted.headers.get("X-Forwarded-For"), null);
    assert.equal(adapted.headers.get("X-Forwarded-Host"), null);
    assert.deepEqual(await adapted.json(), { task: "Example" });
    assert.equal(trustedProxyIp(req.headers, "x-real-ip"), "192.0.2.2");
    assert.equal(trustedProxyIp(req.headers, "xff:1"), "192.0.2.4");
    assert.equal(trustedProxyIp(req.headers, "xff:2"), "192.0.2.3");
    assert.equal(trustedProxyIp(new Headers({ "X-Real-IP": "bad:ip", "X-Forwarded-For": "bad, value" }), "x-real-ip"), undefined);
    assert.equal(trustedProxyIp(req.headers, "xff:9"), undefined);
    assert.throws(() => trustedProxyIp(req.headers, "true"));
  });
  await test("aliases keep original schemas and canonical same-origin checks", async () => {
    const forwarded = adaptRequest(request("/api/lead/", {}, { "X-Real-IP": "2001:db8::1" }), { ...values, TRUST_PROXY: "x-real-ip" });
    assert.equal(forwarded.url, `${origin}/api/intake/submit`);
    assert.equal(forwarded.headers.get("CF-Connecting-IP"), "2001:db8::1");
    let fetched = false;
    const noNetwork = async () => { fetched = true; throw Error("unexpected_fetch"); };
    for (const path of ["/api/brief", "/api/lead", "/api/intake/next", "/api/intake/submit"]) {
      const response = await routeRequest(request(path, {}, { Origin: "https://evil.example" }), values, noNetwork);
      assert.equal(response.status, 403);
    }
    assert.equal(fetched, false);
    assert.equal((await routeRequest(request("/api/admin/telegram"), values, noNetwork)).status, 404);
  });
  const lead = { schemaVersion: 1, sessionId: "node-lead-session-123", service: null, task: "Нужен сайт", answers: [], summary: { title: "Сайт", items: [{ label: "Задача", value: "Нужен сайт" }] }, contacts: { email: "test@example.com" }, contactConfirmed: true, consent: true, page: origin, utm: {} };
  const telegramEnv = { ...values, TELEGRAM_BOT_TOKEN: "test-token", TELEGRAM_CHAT_ID: "-123" };
  const sent = () => Response.json({ ok: true, result: { message_id: 1 } });
  await test("Node handles brief and delivery without a database or filesystem storage", async () => {
    const state = memoryState();
    const config = await routeRequest(new Request("http://internal/api/intake/config"), telegramEnv, sent, state);
    assert.deepEqual(await config.json(), { delivery: true });
    const disabled = await routeRequest(new Request("http://internal/api/intake/config"), values, sent, state);
    assert.deepEqual(await disabled.json(), { delivery: false });
    const requestBody = { schemaVersion: 1, sessionId: "node-test-session-123", service: null, task: "Нужен сайт", answers: [], forceSummary: false };
    const model = { turn: { type: "question", message: "Уточню детали", question: "Для кого делаем проект?", options: ["Для компании", "Для агентства"] }, internal: { knownFacts: { scope: "Нужен сайт", users: "", materials: "", systems: "", deadline: "", budget: "" }, nextMissing: "Пользователи", clientType: "unknown", complexity: "unknown", notes: "" } };
    const response = await routeRequest(request("/api/brief", requestBody), { ...values, OPENAI_API_KEY: "unit-test-only" }, async (_url, options) => {
      assert.equal(JSON.parse(options.body).model, "gpt-6-luna");
      return Response.json({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(model) }] }] });
    }, state);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).type, "question");
    let sends = 0;
    const fetcher = async (_url, options) => { sends++; assert.equal(JSON.parse(options.body).chat_id, "-123"); return sent(); };
    const submission = await routeRequest(request("/api/lead", lead), telegramEnv, fetcher, state);
    assert.equal(submission.status, 200);
    const receipt = await submission.json();
    assert.equal(receipt.ok, true);
    assert.match(receipt.number, /^[0-9A-F]{5}-[0-9A-F]{5}$/);
    assert.equal((await (await routeRequest(request("/api/lead", lead), telegramEnv, fetcher, state)).json()).number, receipt.number);
    assert.equal(sends, 1);
    const analytics = await routeRequest(new Request("http://internal/api/analytics/config"), { ...values, YANDEX_METRIKA_ID: "113480948" });
    assert.deepEqual(await analytics.json(), { counterId: 113480948 });
  });
  await test("untrusted visitors share 30 hourly submissions and an atomic daily ceiling", async () => {
    const state = memoryState();
    const realNow = Date.now;
    let now = Date.parse("2026-10-06T06:00:00Z");
    let sends = 0;
    let attempts = 0;
    Date.now = () => now;
    const submit = async () => routeRequest(request("/api/lead", { ...lead, sessionId: `anonymous-test-session-${++attempts}` }), telegramEnv, async () => { sends++; return sent(); }, state);
    try {
      for (let i = 0; i < 30; i++) assert.equal((await submit()).status, 200);
      assert.equal(sends, 30); // The sixth visitor is not blocked by a shared per-IP limit.
      const limited = await submit();
      assert.equal(limited.status, 429);
      assert.equal(Number(limited.headers.get("Retry-After")), 3600);
      for (let hour = 0; hour < 2; hour++) {
        now += 3600000;
        for (let i = 0; i < 30; i++) assert.equal((await submit()).status, 200);
      }
      now += 3600000;
      const last = await Promise.all(Array.from({ length: 20 }, submit));
      assert.equal(last.filter(response => response.status === 200).length, 10);
      assert.equal(last.filter(response => response.status === 429).length, 10);
      assert.equal(sends, 100);
      now += 86400000;
      assert.equal((await submit()).status, 200);
    } finally { Date.now = realNow; }
  });
  await test("a verified ingress address keeps its individual five-per-hour submission limit", async () => {
    const state = memoryState();
    const ingress = { ...telegramEnv, TRUST_PROXY: "x-real-ip" };
    for (let i = 0; i < 5; i++) {
      const response = await routeRequest(request("/api/lead", { ...lead, sessionId: `trusted-ip-session-${i}` }, { "X-Real-IP": "192.0.2.8" }), ingress, sent, state);
      assert.equal(response.status, 200);
    }
    assert.equal((await routeRequest(request("/api/lead", lead, { "X-Real-IP": "192.0.2.8" }), ingress, sent, state)).status, 429);
    assert.equal((await routeRequest(request("/api/lead", lead, { "X-Real-IP": "192.0.2.9" }), ingress, sent, state)).status, 200);
  });
  await test("runtime env shares one process state and forwards only integration values", () => {
    const state = memoryState();
    const env = runtimeEnv({ ...values, OPENAI_API_KEY: "private", RELAY_SECRET: "relay-private", UNRELATED_SECRET: "omit", INTAKE_ADMIN_SECRET: "omit" }, state);
    assert.equal(env.STATE, state);
    assert.equal(env.OPENAI_API_KEY, "private");
    assert.equal(env.RELAY_SECRET, "relay-private");
    assert.equal("DB" in env, false);
    assert.equal("UNRELATED_SECRET" in env, false);
    assert.equal("INTAKE_ADMIN_SECRET" in env, false);
    assert.equal(runtimeEnv(values).STATE, runtimeEnv(values).STATE);
  });
  await test("memory limits are atomic, expire, and reject new keys at capacity", async () => {
    const state = memoryState({ maxLimits: 2 });
    const calls = await Promise.all(Array.from({ length: 40 }, () => consumeLimit({ STATE: state }, "test", 30, 600, 1000)));
    assert.equal(calls.filter(result => result.allowed).length, 30);
    await state.consumeLimit("other", 1, 600, 1000);
    await assert.rejects(state.consumeLimit("overflow", 1, 600, 1000), /state_capacity/);
    assert.deepEqual(await state.consumeLimit("test", 30, 600, 1600), { allowed: true, retry: 600 });
    assert.equal((await state.consumeLimit("overflow", 1, 600, 1600)).allowed, true);
  });
  await test("concurrent Node submissions claim one send and keep the same compact receipt", async () => {
    const env = runtimeEnv(telegramEnv, memoryState());
    let sends = 0;
    const fetcher = async () => { sends++; await new Promise(resolve => setTimeout(resolve, 10)); return sent(); };
    const results = await Promise.all(Array.from({ length: 8 }, () => deliverLead(lead, env, fetcher)));
    assert.equal(results.filter(result => result.ok).length, 1);
    assert.ok(results.filter(result => !result.ok).every(result => result.error === "delivery_in_progress"));
    const receipt = await deliverLead(lead, env, fetcher);
    assert.equal(receipt.ok, true);
    assert.equal(sends, 1);
    assert.equal((await deliverLead({ ...lead, task: "Другая задача" }, env, fetcher)).error, "submission_conflict");
    // A restart forgets deduplication, but the Telegram reference remains stable.
    const afterRestart = await deliverLead(lead, runtimeEnv(telegramEnv, memoryState()), async () => sent());
    assert.equal(afterRestart.number, receipt.number);
  });
  await test("known failed chunks resume and ambiguous sends remain locked in memory", async () => {
    const env = runtimeEnv(telegramEnv, memoryState());
    let sends = 0;
    const long = { ...lead, task: "x".repeat(4000) };
    const fetcher = async () => { sends++; return sends === 2 ? Response.json({ ok: false }, { status: 403 }) : sent(); };
    assert.equal((await deliverLead(long, env, fetcher)).error, "delivery_failed");
    assert.equal((await deliverLead(long, env, fetcher)).ok, true);
    assert.equal(sends, 3);
    const uncertain = { ...lead, sessionId: "node-uncertain-123" };
    assert.equal((await deliverLead(uncertain, env, async () => { throw Error("network"); })).error, "delivery_uncertain");
    assert.equal((await deliverLead(uncertain, env, () => { throw Error("must_not_send"); })).error, "delivery_uncertain");
  });
  await test("delivery state is bounded and retains locks and uncertain receipts until TTL", async () => {
    const state = memoryState({ maxDeliveries: 2 });
    const ttl = 30 * 86400;
    assert.equal((await state.claim("a", "hash-a", "A", 1000)).status, "claimed");
    assert.equal((await state.claim("a", "hash-a", "A", 1001)).status, "in_progress");
    assert.equal((await state.claim("a", "hash-a", "A", 1061)).status, "uncertain");
    await state.claim("b", "hash-b", "B", 1061);
    await state.finish("b", "sent", 1061);
    await assert.rejects(state.claim("c", "hash-c", "C", 1100), /state_capacity/);
    assert.equal((await state.claim("a", "hash-a", "A", 1000 + ttl - 1)).status, "uncertain");
    assert.equal((await state.claim("c", "hash-c", "C", 1000 + ttl)).status, "claimed");
    assert.equal((await state.claim("b", "hash-b", "B", 1000 + ttl)).status, "sent");
  });
  await test("Next discovers node API routes only in standalone mode", async () => {
    const route = "src/app/api/[...sborkaApi]/route.node.ts";
    const staticExtensions = ["tsx", "ts"];
    const nodeExtensions = ["node.ts", "tsx", "ts"];
    assert.equal(createValidFileMatcher(staticExtensions, "src/app").isAppRouterPage(route), false);
    assert.equal(createValidFileMatcher(nodeExtensions, "src/app").isAppRouterPage(route), true);
    assert.equal(removePagePathTail("/api/[...sborkaApi]/route.node.ts", { extensions: nodeExtensions }), "/api/[...sborkaApi]/route");
    assert.ok((await readFile(route, "utf8")).includes('export const dynamic = "force-dynamic"'));
  });
} finally { await rm(temp, { recursive: true, force: true }); }
