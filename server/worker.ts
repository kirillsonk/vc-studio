import { METRIKA_COUNTER_ID, validCounter } from "../src/site/analytics/metrika";
import { hasAi, hasTelegram, rateSecret, type UpstreamEnv } from "./upstream";
import { generateNext, ModelError, nextRequestSchema } from "./intake";
import { deliverLead, discoverTelegram, submitSchema } from "./telegram";
import { intakeState, type D1Database, type IntakeState } from "./intake-state";

export interface Env extends UpstreamEnv {
  CHATGPT_PLATFORM_API_KEY?: string;
  YANDEX_METRIKA_ID?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  INTAKE_ADMIN_SECRET?: string;
  DB?: D1Database;
  STATE?: IntakeState;
  ASSETS?: { fetch(request: Request): Promise<Response> };
}
const json = (body: unknown, status = 200, extra: Record<string, string> = {}) => Response.json(body, {
  status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...extra },
});

export async function consumeLimit(env: Env, key: string, max: number, seconds: number, now = Math.floor(Date.now() / 1000)) {
  const state = intakeState(env);
  if (!state) throw new Error("state_unavailable");
  return state.consumeLimit(key, max, seconds, now);
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
    if (size > 192000) { await reader.cancel(); throw new Error("body_too_large"); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function handle(request: Request, env: Env, fetcher: typeof fetch = fetch): Promise<Response> {
  const url = new URL(request.url);
  if(url.pathname === "/api/analytics/config") {
    if(request.method!=="GET")return json({error:"method_not_allowed"},405);
    return json({counterId:validCounter(env.YANDEX_METRIKA_ID ?? METRIKA_COUNTER_ID)});
  }
  if (url.pathname === "/api/admin/telegram") {
    if (!env.INTAKE_ADMIN_SECRET || request.headers.get("Authorization") !== `Bearer ${env.INTAKE_ADMIN_SECRET}`) return json({error:"not_found"},404);
    if (request.method !== "POST") return json({error:"method_not_allowed"},405);
    try { return json(await discoverTelegram(env,fetcher)); } catch { return json({error:"telegram_setup_failed"},502); }
  }
  if (!url.pathname.startsWith("/api/intake/")) {
    return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Not found", { status: 404 });
  }
  if (url.pathname === "/api/intake/config" && request.method === "GET") return json({delivery:!!(hasTelegram(env) && intakeState(env))});
  if (url.pathname !== "/api/intake/next" && url.pathname !== "/api/intake/submit") return json({ error: "not_found" }, 404);
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
  // JSON + same-origin checks block drive-by cross-site forms. They supplement rate limits
  const origin = request.headers.get("Origin");
  if (!origin || origin !== url.origin || request.headers.get("Sec-Fetch-Site") === "cross-site") return json({ error: "origin" }, 403);
  if (request.headers.get("Content-Type")?.split(";")[0].trim() !== "application/json") return json({ error: "content_type" }, 415);
  if (url.pathname.endsWith("/submit")) {
    if (!hasTelegram(env)) return json({ok:false,error:"delivery_not_configured"},503);
    let lead;
    try { lead = submitSchema.parse(await readBody(request)); } catch { return json({ok:false,error:"invalid_request"},400); }
    try {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const id = await fingerprint(ip, rateSecret(env));
      const rate = await consumeLimit(env,`submit:${id}`,ip === "unknown" ? 30 : 5,3600);
      if (!rate.allowed) return json({ok:false,error:"rate_limit"},429,{"Retry-After":String(rate.retry)});
      const daily = await consumeLimit(env,"submit:global",100,86400);
      if (!daily.allowed) return json({ok:false,error:"rate_limit"},429,{"Retry-After":String(daily.retry)});
      const result = await deliverLead(lead,env,fetcher,request.signal);
      return json(result,result.ok?200:503);
    } catch { return json({ok:false,error:"temporarily_unavailable"},503); }
  }
  let input;
  try { input = nextRequestSchema.parse(await readBody(request)); }
  catch { return json({ error: "invalid_request" }, 400); }
  const key = rateSecret(env);
  if (!hasAi(env)) return json({ error: "model_unavailable" }, 502);
  try {
    // Trust only Cloudflare's edge-supplied address, never an arbitrary X-Forwarded-For
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const id = await fingerprint(ip, key);
    const rate = await consumeLimit(env, `ip:${id}`, ip === "unknown" ? 90 : 24, 60);
    if (!rate.allowed) return json({ error: "rate_limit" }, 429, { "Retry-After": String(rate.retry) });
    const daily = await consumeLimit(env, "global", 1000, 86400);
    if (!daily.allowed) return json({ error: "rate_limit" }, 429, { "Retry-After": String(daily.retry) });
    await intakeState(env)!.cleanup(Math.floor(Date.now() / 1000));
  } catch {
    console.warn(JSON.stringify({ event: "intake", code: "storage_unavailable" }));
    return json({ error: "temporarily_unavailable" }, 503);
  }
  try { return json(await generateNext(input, env, fetcher, request.signal)); }
  catch (error) {
    console.warn(JSON.stringify({ event: "intake", code: error instanceof ModelError ? error.code : "model_failure", status: error instanceof ModelError ? error.upstreamStatus : undefined }));
    return json({ error: "model_unavailable" }, 502);
  }
}
export default { fetch: (request: Request, env: Env) => handle(request, env) };
