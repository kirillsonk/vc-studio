import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

// Abuse counters only. No briefs, contact details, raw IPs or model conversations
export const intakeLimits = sqliteTable("intake_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  expires: integer("expires").notNull(),
}, t => [index("intake_limits_expiry").on(t.expires)]);

// Confirmed submissions only; original text is retained for 30 days for delivery recovery
export const intakeLeads = sqliteTable('intake_leads', {
  id: text('id').primaryKey(),
  hash: text('hash').notNull(),
  payload: text('payload').notNull(),
  status: text('status').notNull(),
  cursor: integer('cursor').notNull().default(0),
  updated: integer('updated').notNull(),
  expires: integer('expires').notNull(),
}, t => [index('intake_leads_expiry').on(t.expires)]);

// Non-PII receipt sequence stays stable across retries and retention cleanup
export const intakeReceipts = sqliteTable('intake_receipts', {
  number: integer('number').primaryKey({autoIncrement: true}),
  leadId: text('lead_id').notNull().unique(),
  created: integer('created').notNull(),
});
