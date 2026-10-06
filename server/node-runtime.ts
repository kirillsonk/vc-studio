import { isIP } from "node:net";
import { handle, type Env } from "./worker";
import { runtimeState } from "./node/memory-state";
import type { IntakeState } from "./intake-state";

type RuntimeValues = Record<string, string | undefined>;
const routes = new Map([
  ["/api/intake/config", "/api/intake/config"],
  ["/api/intake/next", "/api/intake/next"],
  ["/api/intake/submit", "/api/intake/submit"],
  ["/api/analytics/config", "/api/analytics/config"],
  ["/api/brief", "/api/intake/next"],
  ["/api/lead", "/api/intake/submit"],
]);
const unavailable = () => Response.json({ error: "temporarily_unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });

export function publicOrigin(value: string | undefined) {
  if (!value) throw new Error("missing_public_origin");
  const parsed = new URL(value);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
  if ((parsed.protocol !== "https:" && !(local && parsed.protocol === "http:")) || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== "/") throw new Error("invalid_public_origin");
  return parsed.origin;
}

// Enable only after verifying the ingress overwrites this header and the app
// cannot be reached around that ingress. Unconfigured installs share a limit.
export function trustedProxyIp(headers: Headers, mode: string | undefined) {
  if (!mode || mode === "false") return undefined;
  if (mode === "x-real-ip") {
    const ip = headers.get("x-real-ip")?.trim();
    return ip && isIP(ip) ? ip : undefined;
  }
  const matched = /^xff:([1-9][0-9]?)$/.exec(mode);
  if (!matched) throw new Error("invalid_trust_proxy");
  const parts = headers.get("x-forwarded-for")?.split(",").map(item => item.trim()) ?? [];
  const ip = parts[parts.length - Number(matched[1])];
  return ip && isIP(ip) ? ip : undefined;
}

export function adaptRequest(request: Request, values: RuntimeValues) {
  const path = routes.get(new URL(request.url).pathname.replace(/\/$/, ""));
  if (!path) return undefined;
  const origin = publicOrigin(values.PUBLIC_ORIGIN);
  const headers = new Headers(request.headers);
  const ip = trustedProxyIp(headers, values.TRUST_PROXY);
  for (const name of ["cf-connecting-ip", "x-real-ip", "x-forwarded-for", "x-forwarded-host", "x-forwarded-proto", "forwarded", "host"]) headers.delete(name);
  if (ip) headers.set("CF-Connecting-IP", ip);
  return new Request(`${origin}${path}`, {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
    ...(request.body && !["GET", "HEAD"].includes(request.method) ? { duplex: "half" } : {}),
    signal: request.signal,
  });
}

export function runtimeEnv(values: RuntimeValues, state = runtimeState()): Env {
  const env: Env = { STATE: state };
  const names = ["CHATGPT_PLATFORM_API_KEY", "OPENAI_API_KEY", "OPENAI_MODEL", "RELAY_URL", "RELAY_SECRET", "RELAY_CLIENT", "YANDEX_METRIKA_ID", "TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"] as const;
  for (const name of names) if (values[name]) Object.assign(env, { [name]: values[name] });
  return env;
}

export async function routeRequest(request: Request, values: RuntimeValues = process.env, fetcher: typeof fetch = fetch, state?: IntakeState) {
  try {
    const adapted = adaptRequest(request, values);
    if (!adapted) return Response.json({ error: "not_found" }, { status: 404 });
    const env = runtimeEnv(values, state);
    return await handle(adapted, env, fetcher);
  } catch {
    console.warn(JSON.stringify({ event: "intake", code: "node_runtime_unavailable" }));
    return unavailable();
  }
}
