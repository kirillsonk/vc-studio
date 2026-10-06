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
  await build({ entryPoints: ["server/node-runtime.ts", "server/node/postgres.ts", "server/worker.ts"], outdir: temp, entryNames: "[name]", outExtension: { ".js": ".cjs" }, bundle: true, format: "cjs", platform: "node", target: "node22" });
  const { adaptRequest, publicOrigin, trustedProxyIp, routeRequest, runtimeEnv } = (await import(pathToFileURL(join(temp, "node-runtime.cjs")))).default;
  const { postgresParameters, postgresDatabase } = (await import(pathToFileURL(join(temp, "postgres.cjs")))).default;
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
  await test("missing runtime storage never creates an in-memory production fallback", async () => {
    const config = await routeRequest(new Request("http://internal/api/intake/config"), values);
    assert.deepEqual(await config.json(), { delivery: false });
    const requestBody = { schemaVersion: 1, sessionId: "node-test-session-123", service: null, task: "Нужен сайт", answers: [], forceSummary: false };
    const response = await routeRequest(request("/api/brief", requestBody), { ...values, OPENAI_API_KEY: "unit-test-only" }, () => { throw Error("must_not_fetch"); });
    assert.equal(response.status, 503);
    const invalid = await routeRequest(request("/api/brief"), { ...values, DATABASE_URL: "file:secret-database" });
    assert.equal(invalid.status, 503);
    assert.equal((await invalid.text()).includes("secret"), false);
    const analytics = await routeRequest(new Request("http://internal/api/analytics/config"), { ...values, YANDEX_METRIKA_ID: "113480948" });
    assert.deepEqual(await analytics.json(), { counterId: 113480948 });
  });
  await test("runtime env forwards only server integration values", () => {
    const db = { prepare: () => { throw Error("not_queried"); } };
    const env = runtimeEnv({ ...values, OPENAI_API_KEY: "private", RELAY_SECRET: "relay-private", DATABASE_URL: "postgres://private", UNRELATED_SECRET: "omit", INTAKE_ADMIN_SECRET: "omit" }, db);
    assert.equal(env.DB, db);
    assert.equal(env.OPENAI_API_KEY, "private");
    assert.equal(env.RELAY_SECRET, "relay-private");
    assert.equal("DATABASE_URL" in env, false);
    assert.equal("UNRELATED_SECRET" in env, false);
    assert.equal("INTAKE_ADMIN_SECRET" in env, false);
  });
  await test("SQL placeholders preserve strings and comments and bind values separately", async () => {
    const converted = postgresParameters(`SELECT '?', "?", $$?$$, $tag$?$tag$, ? -- ?\n/* ? */ WHERE value = ?`);
    assert.equal(converted.parameters, 2);
    assert.equal(converted.sql, `SELECT '?', "?", $$?$$, $tag$?$tag$, $1 -- ?\n/* ? */ WHERE value = $2`);
    const calls = [];
    const db = postgresDatabase({ query: async (sql, args) => { calls.push({ sql, args }); return { rows: sql.startsWith("SELECT") ? [{ result: 7 }] : [], rowCount: 1 }; } });
    assert.deepEqual(await db.prepare("SELECT result WHERE value = ?").bind("' DROP TABLE").first(), { result: 7 });
    assert.deepEqual(calls[0], { sql: "SELECT result WHERE value = $1", args: ["' DROP TABLE"] });
    assert.equal(await db.prepare("UPDATE row SET value = ?").bind(5).first(), null);
    assert.deepEqual(await db.prepare("UPDATE row SET value = ?").bind(5).run(), { changes: 1 });
    await assert.rejects(db.prepare("SELECT ?").first(), /sql_parameter_count/);
  });
  await test("rate limit upsert stays a single atomic PostgreSQL query", async () => {
    let call;
    const db = postgresDatabase({ query: async (sql, args) => { call = { sql, args }; return { rows: [{ count: 31, expires: 1600 }] }; } });
    assert.deepEqual(await consumeLimit({ DB: db }, "test", 30, 600, 1000), { allowed: false, retry: 600 });
    assert.deepEqual(call.args, ["test", 1600, 1000, 1000]);
    assert.ok(call.sql.includes("WHEN intake_limits.expires <= $3"));
    assert.ok(call.sql.includes("ELSE intake_limits.count + 1"));
    assert.ok(call.sql.includes("ELSE intake_limits.expires END"));
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
