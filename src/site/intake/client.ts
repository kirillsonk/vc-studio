import type { NextRequest, NextResponse, SubmitRequest, SubmitResponse } from "./contract";
import { mockNext } from "./mock";

/** Backend base URL, for example https://api.example.ru/intake. Empty means the local mock */
export const INTAKE_API = (process.env.NEXT_PUBLIC_INTAKE_API_URL || "").replace(/\/$/, "");
export const INTAKE_MOCK = !INTAKE_API;
export const PRIVACY_URL = process.env.NEXT_PUBLIC_PRIVACY_URL || "";
// Separate AI briefing from lead delivery. Enable only after delivery and policy are ready
export const DELIVERY_ENABLED = process.env.NEXT_PUBLIC_INTAKE_DELIVERY_ENABLED === "true" && !INTAKE_MOCK;

export async function deliveryAvailable() {
  if (!DELIVERY_ENABLED) return false;
  try {
    const r = await fetch(`${INTAKE_API}/config`, { signal: AbortSignal.timeout(5000), cache: "no-store" });
    return r.ok && (await r.json()).delivery === true;
  } catch { return false; }
}

const aborted = (signal?: AbortSignal) => {
  if (signal?.aborted) throw signal.reason || new DOMException("Aborted", "AbortError");
};

const wait = (ms: number, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
  aborted(signal);
  const finish = () => { signal?.removeEventListener("abort", cancel); resolve(); };
  const timer = setTimeout(finish, ms);
  const cancel = () => { clearTimeout(timer); signal?.removeEventListener("abort", cancel); reject(signal?.reason || new DOMException("Aborted", "AbortError")); };
  signal?.addEventListener("abort", cancel, { once: true });
});

async function post<T>(path: string, body: unknown, timeout: number, signal?: AbortSignal): Promise<T> {
  aborted(signal);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  const cancel = () => ctrl.abort(signal?.reason);
  signal?.addEventListener("abort", cancel, { once: true });
  try {
    const res = await fetch(`${INTAKE_API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok && path !== "/submit") throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", cancel);
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
export async function nextStep(req: NextRequest, signal?: AbortSignal): Promise<NextResponse> {
  aborted(signal);
  if (!INTAKE_MOCK) {
    try {
      const res = await post<unknown>("/next", req, 22000, signal);
      if (valid(res)) return { ...res, ...(res.type === "question" ? { options: res.options.slice(0, 4) } : {}) };
    } catch {
      aborted(signal);
      /* fall back to the local scenario */
    }
  }
  await wait(900 + Math.random() * 800, signal);
  return mockNext(req);
}

/** The complete request is the key: a reply never survives a changed answer or service. */
export const nextRequestKey = (req: NextRequest) => JSON.stringify({
  schemaVersion: req.schemaVersion,
  sessionId: req.sessionId,
  service: req.service,
  task: req.task,
  answers: req.answers.map(({ question, answer }) => ({ question, answer })),
  forceSummary: req.forceSummary,
});

/** Speculation is bounded and never writes the visible brief. Only explicit submit consumes it. */
export function createNextPrefetch(request = nextStep) {
  type Pending = { key: string; controller: AbortController; promoted: boolean; result?: NextResponse; promise: Promise<NextResponse | undefined> };
  let current: Pending | undefined;
  let attempts = 0;
  const stages = new Map<string, number>();
  const seen = new Set<string>();
  return {
    cancelStale(key?: string) {
      if (current && current.key !== key && !current.promoted) {
        current.controller.abort();
        current = undefined;
      }
    },
    start(req: NextRequest, stage: string) {
      const key = nextRequestKey(req);
      this.cancelStale(key);
      if (current?.key === key || seen.has(key) || attempts >= 12 || (stages.get(stage) || 0) >= 3) return;
      attempts += 1;
      stages.set(stage, (stages.get(stage) || 0) + 1);
      seen.add(key);
      const controller = new AbortController();
      const entry: Pending = { key, controller, promoted: false, promise: Promise.resolve(undefined) };
      entry.promise = request(req, controller.signal).then(result => {
        if (controller.signal.aborted) return undefined;
        entry.result = result;
        return result;
      }).catch(() => undefined);
      current = entry;
    },
    take(req: NextRequest) {
      if (!current || current.key !== nextRequestKey(req) || current.controller.signal.aborted) return;
      current.promoted = true;
      return current;
    },
    cancel() {
      current?.controller.abort();
      current = undefined;
    },
    reset() {
      this.cancel();
      attempts = 0;
      stages.clear();
      seen.clear();
    },
  };
}

export async function submitBrief(req: SubmitRequest): Promise<SubmitResponse> {
  if (!DELIVERY_ENABLED) return { ok: false, error: "delivery_not_configured" };
  try {
    return await post<SubmitResponse>("/submit", req, 45000);
  } catch {
    return { ok: false, error: "network" };
  }
}
