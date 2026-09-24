import { generateNext, ModelError, nextRequestSchema } from "./intake";
import { deliverLead, discoverTelegram, submitSchema } from "./telegram";

interface Statement {
  bind(...values: (string | number)[]): Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}
export interface Env {
  CHATGPT_PLATFORM_API_KEY?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  INTAKE_ADMIN_SECRET?: string;
  DB?: { prepare(sql: string): Statement };
  ASSETS?: { fetch(request: Request): Promise<Response> };
}
const json = (body: unknown, status = 200, extra: Record<string, string> = {}) => Response.json(body, {
  status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...extra },
});

export async function consumeLimit(env: Env, key: string, max: number, seconds: number, now = Math.floor(Date.now() / 1000)) {
  if (!env.DB) throw new Error("storage_unavailable");
  const row = await env.DB.prepare(`INSERT INTO intake_limits (key, count, expires) VALUES (?, 1, ?)
    ON CONFLICT(key) DO UPDATE SET
    count = CASE WHEN expires <= ? THEN 1 ELSE count + 1 END,
    expires = CASE WHEN expires <= ? THEN excluded.expires ELSE expires END
    RETURNING count, expires`).bind(key, now + seconds, now, now).first<{ count: number; expires: number }>();
  if (!row) throw new Error("storage_unavailable");
  return { allowed: row.count <= max, retry: Math.max(1, row.expires - now) };
}
async function fingerprint(ip: string, secret: string) {
  const day = Math.floor(Date.now() / 86400000);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${day}:${ip}`));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}
async function readBody(request: Request) {
  if (!request.body) throw new Error("empty_body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 48000) { await reader.cancel(); throw new Error("body_too_large"); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function handle(request: Request, env: Env, fetcher: typeof fetch = fetch): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === "/api/admin/telegram") {
    if (!env.INTAKE_ADMIN_SECRET || request.headers.get("Authorization") !== `Bearer ${env.INTAKE_ADMIN_SECRET}`) return json({error:"not_found"},404);
    if (request.method !== "POST") return json({error:"method_not_allowed"},405);
    try { return json(await discoverTelegram(env,fetcher)); } catch { return json({error:"telegram_setup_failed"},502); }
  }
  if (!url.pathname.startsWith("/api/intake/")) {
    return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Not found", { status: 404 });
  }
  if (url.pathname === "/api/intake/config" && request.method === "GET") return json({delivery:!!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID && env.DB)});
  if (url.pathname !== "/api/intake/next" && url.pathname !== "/api/intake/submit") return json({ error: "not_found" }, 404);
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
  // JSON + same-origin checks block drive-by cross-site forms. They supplement rate limits
  const origin = request.headers.get("Origin");
  if (!origin || origin !== url.origin || request.headers.get("Sec-Fetch-Site") === "cross-site") return json({ error: "origin" }, 403);
  if (request.headers.get("Content-Type")?.split(";")[0].trim() !== "application/json") return json({ error: "content_type" }, 415);
  if (url.pathname.endsWith("/submit")) {
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return json({ok:false,error:"delivery_not_configured"},503);
    let lead;
    try { lead = submitSchema.parse(await readBody(request)); } catch { return json({ok:false,error:"invalid_request"},400); }
    try {
      const id = await fingerprint(request.headers.get("CF-Connecting-IP") || "unknown", env.TELEGRAM_BOT_TOKEN);
      const rate = await consumeLimit(env,`submit:${id}`,5,3600);
      if (!rate.allowed) return json({ok:false,error:"rate_limit"},429,{"Retry-After":String(rate.retry)});
      const result = await deliverLead(lead,env,fetcher);
      return json(result,result.ok?200:503);
    } catch { return json({ok:false,error:"temporarily_unavailable"},503); }
  }
  let input;
  try { input = nextRequestSchema.parse(await readBody(request)); }
  catch { return json({ error: "invalid_request" }, 400); }
  const key = env.CHATGPT_PLATFORM_API_KEY;
  if (!key) return json({ error: "model_unavailable" }, 502);
  try {
    // Trust only Cloudflare's edge-supplied address, never an arbitrary X-Forwarded-For
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const id = await fingerprint(ip, key);
    const rate = await consumeLimit(env, `ip:${id}`, 30, 600);
    if (!rate.allowed) return json({ error: "rate_limit" }, 429, { "Retry-After": String(rate.retry) });
    const daily = await consumeLimit(env, "global", 1000, 86400);
    if (!daily.allowed) return json({ error: "rate_limit" }, 429, { "Retry-After": String(daily.retry) });
    await env.DB!.prepare("DELETE FROM intake_limits WHERE key IN (SELECT key FROM intake_limits WHERE expires < ? LIMIT 100)").bind(Math.floor(Date.now() / 1000)).run();
  } catch {
    console.warn(JSON.stringify({ event: "intake", code: "storage_unavailable" }));
    return json({ error: "temporarily_unavailable" }, 503);
  }
  try { return json(await generateNext(input, key, fetcher)); }
  catch (error) {
    console.warn(JSON.stringify({ event: "intake", code: error instanceof ModelError ? error.code : "model_failure", status: error instanceof ModelError ? error.upstreamStatus : undefined }));
    return json({ error: "model_unavailable" }, 502);
  }
}
export default { fetch: (request: Request, env: Env) => handle(request, env) };
