import type { NextRequest, NextResponse, SubmitRequest, SubmitResponse } from "./contract";
import { mockNext } from "./mock";

/** Backend base URL, for example https://api.example.ru/intake. Empty means the local mock */
export const INTAKE_API = (process.env.NEXT_PUBLIC_INTAKE_API_URL || "").replace(/\/$/, "");
export const INTAKE_MOCK = !INTAKE_API;
export const PRIVACY_URL = process.env.NEXT_PUBLIC_PRIVACY_URL || "";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function post<T>(path: string, body: unknown, timeout: number): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(`${INTAKE_API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

function valid(r: unknown): r is NextResponse {
  if (!r || typeof r !== "object") return false;
  const v = r as Record<string, unknown>;
  if (v.type === "question") return typeof v.question === "string" && Array.isArray(v.options);
  if (v.type === "summary") {
    const s = v.summary as Record<string, unknown> | undefined;
    return !!s && typeof s.title === "string" && Array.isArray(s.items);
  }
  return false;
}

/**
 * Next step of the dialog. If the backend fails or answers with an unexpected shape,
 * the local scenario continues so the client never loses the request
 */
export async function nextStep(req: NextRequest): Promise<NextResponse> {
  if (!INTAKE_MOCK) {
    try {
      const res = await post<unknown>("/next", req, 20000);
      if (valid(res)) return { ...res, ...(res.type === "question" ? { options: res.options.slice(0, 4) } : {}) };
    } catch {
      /* fall back to the local scenario */
    }
  }
  await wait(900 + Math.random() * 800);
  return mockNext(req);
}

export async function submitBrief(req: SubmitRequest): Promise<SubmitResponse> {
  if (INTAKE_MOCK) {
    await wait(1100);
    try {
      localStorage.setItem("sborka-intake-last", JSON.stringify(req));
    } catch {}
    return { ok: true, id: `demo-${req.sessionId.slice(0, 6)}` };
  }
  try {
    return await post<SubmitResponse>("/submit", req, 15000);
  } catch {
    return { ok: false, error: "network" };
  }
}
