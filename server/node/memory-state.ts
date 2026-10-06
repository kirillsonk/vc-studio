import type { Claim, IntakeState, Receipt } from "../intake-state";

type Delivery = { hash: string; status: "sending" | "sent" | "uncertain" | "failed"; cursor: number; updated: number; expires: number; receipt: Receipt };
const LEAD_TTL = 30 * 86400;

// Single-process protection only: a restart clears this state. Never run multiple
// replicas with this adapter. No request text, contact details or raw IPs are kept.
export function memoryState({ maxLimits = 5000, maxDeliveries = 5000 } = {}): IntakeState {
  const limits = new Map<string, { count: number; expires: number }>();
  const deliveries = new Map<string, Delivery>();
  const cleanup = (now: number) => {
    for (const [key, row] of limits) if (row.expires <= now) limits.delete(key);
    for (const [id, row] of deliveries) {
      if (row.status === "sending" && row.updated < now - 60) row.status = "uncertain";
      if (row.expires <= now && row.status !== "sending") deliveries.delete(id);
    }
  };
  const delivery = (id: string) => {
    const row = deliveries.get(id);
    if (!row) throw new Error("state_unavailable");
    return row;
  };
  return {
    async consumeLimit(key, max, seconds, now) {
      cleanup(now);
      let row = limits.get(key);
      if (!row) {
        if (limits.size >= maxLimits) throw new Error("state_capacity");
        row = { count: 0, expires: now + seconds };
        limits.set(key, row);
      }
      // No await between reading and updating: parallel requests cannot overspend.
      row.count = Math.min(row.count + 1, max + 1);
      return { allowed: row.count <= max, retry: Math.max(1, row.expires - now) };
    },
    async cleanup(now) { cleanup(now); },
    async claim(id, hash, number, now): Promise<Claim> {
      cleanup(now);
      let row = deliveries.get(id);
      if (row) {
        if (row.hash !== hash) return { status: "conflict" };
        if (row.status === "sent") return { status: "sent", receipt: { ...row.receipt } };
        if (row.status === "uncertain") return { status: "uncertain" };
        if (row.status === "sending") {
          if (row.updated < now - 60) { row.status = "uncertain"; return { status: "uncertain" }; }
          return { status: "in_progress" };
        }
      } else {
        // Never evict an unexpired receipt just to admit another submission.
        if (deliveries.size >= maxDeliveries) throw new Error("state_capacity");
        row = { hash, status: "sending", cursor: 0, updated: now, expires: now + LEAD_TTL, receipt: { number, created: now } };
        deliveries.set(id, row);
      }
      row.status = "sending";
      row.updated = now;
      return { status: "claimed", cursor: row.cursor, receipt: { ...row.receipt } };
    },
    async progress(id, cursor, now) {
      const row = delivery(id);
      row.cursor = cursor;
      row.updated = now;
    },
    async finish(id, status, now) {
      const row = delivery(id);
      row.status = status;
      row.updated = now;
    },
  };
}

const runtime = globalThis as typeof globalThis & { sborkaIntakeState?: IntakeState };
export function runtimeState() {
  return runtime.sborkaIntakeState ??= memoryState();
}
