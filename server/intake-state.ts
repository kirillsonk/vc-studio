export interface Statement {
  bind(...values: (string | number)[]): Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}
export interface D1Database { prepare(sql: string): Statement }
export interface Receipt { number: number | string; created: number }
export type Claim =
  | { status: "claimed"; cursor: number; receipt: Receipt }
  | { status: "sent"; receipt: Receipt }
  | { status: "conflict" }
  | { status: "uncertain" }
  | { status: "in_progress" };
export interface IntakeState {
  consumeLimit(key: string, max: number, seconds: number, now: number): Promise<{ allowed: boolean; retry: number }>;
  cleanup(now: number): Promise<void>;
  claim(id: string, hash: string, number: string, now: number): Promise<Claim>;
  progress(id: string, cursor: number, now: number): Promise<void>;
  finish(id: string, status: "sent" | "uncertain" | "failed", now: number): Promise<void>;
}

// Sites keeps its existing D1 storage. The Timeweb runtime supplies memory state
// through the same explicit interface, without emulating SQL or storing a brief.
export function d1State(db: D1Database): IntakeState {
  return {
    async consumeLimit(key, max, seconds, now) {
      const row = await db.prepare(`INSERT INTO intake_limits (key, count, expires) VALUES (?, 1, ?)
        ON CONFLICT(key) DO UPDATE SET
        count = CASE WHEN expires <= ? THEN 1 ELSE count + 1 END,
        expires = CASE WHEN expires <= ? THEN excluded.expires ELSE expires END
        RETURNING count, expires`).bind(key, now + seconds, now, now).first<{ count: number; expires: number }>();
      if (!row) throw new Error("state_unavailable");
      return { allowed: row.count <= max, retry: Math.max(1, row.expires - now) };
    },
    async cleanup(now) {
      await db.prepare("DELETE FROM intake_limits WHERE key IN (SELECT key FROM intake_limits WHERE expires < ? LIMIT 100)").bind(now).run();
    },
    async claim(id, hash, _number, now) {
      await db.prepare("DELETE FROM intake_leads WHERE expires < ?").bind(now).run();
      await db.prepare("INSERT INTO intake_leads (id, hash, payload, status, cursor, updated, expires) VALUES (?, ?, ?, 'pending', 0, ?, ?) ON CONFLICT(id) DO NOTHING").bind(id, hash, "", now, now + 30 * 86400).run();
      const row = await db.prepare("SELECT hash, status, cursor, updated FROM intake_leads WHERE id = ?").bind(id).first<{ hash: string; status: string; cursor: number; updated: number }>();
      if (!row || row.hash !== hash) return { status: "conflict" };
      await db.prepare("INSERT INTO intake_receipts (lead_id, created) SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM intake_receipts WHERE lead_id = ?) ON CONFLICT(lead_id) DO NOTHING").bind(id, now, id).run();
      const receipt = await db.prepare("SELECT number, created FROM intake_receipts WHERE lead_id = ?").bind(id).first<Receipt>();
      if (!receipt) throw new Error("state_unavailable");
      if (row.status === "sent") return { status: "sent", receipt };
      if (row.status === "uncertain" || (row.status === "sending" && row.updated < now - 60)) return { status: "uncertain" };
      const locked = await db.prepare("UPDATE intake_leads SET status = 'sending', updated = ? WHERE id = ? AND status IN ('pending', 'failed') RETURNING cursor").bind(now, id).first<{ cursor: number }>();
      return locked ? { status: "claimed", cursor: locked.cursor, receipt } : { status: "in_progress" };
    },
    async progress(id, cursor, now) {
      await db.prepare("UPDATE intake_leads SET cursor = ?, updated = ? WHERE id = ?").bind(cursor, now, id).run();
    },
    async finish(id, status, now) {
      await db.prepare("UPDATE intake_leads SET status = ?, updated = ? WHERE id = ?").bind(status, now, id).run();
    },
  };
}

export function intakeState(env: { STATE?: IntakeState; DB?: D1Database }) {
  return env.STATE ?? (env.DB ? d1State(env.DB) : undefined);
}
