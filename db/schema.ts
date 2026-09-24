import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

// Abuse counters only. No briefs, contact details, raw IPs or model conversations
export const intakeLimits = sqliteTable("intake_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  expires: integer("expires").notNull(),
}, t => [index("intake_limits_expiry").on(t.expires)]);
