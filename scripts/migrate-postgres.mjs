import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import pg from "pg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 5000, statement_timeout: 30000 });
let client;
try {
  client = await pool.connect();
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(73924006)");
  await client.query("CREATE TABLE IF NOT EXISTS sborka_migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())");
  const directory = new URL("../postgres/migrations/", import.meta.url);
  for (const name of (await readdir(directory)).filter(name => name.endsWith(".sql")).sort()) {
    const sql = await readFile(new URL(name, directory), "utf8");
    const checksum = createHash("sha256").update(sql).digest("hex");
    const previous = await client.query("SELECT checksum FROM sborka_migrations WHERE name = $1", [name]);
    if (previous.rows[0]) {
      if (previous.rows[0].checksum !== checksum) throw new Error("migration_checksum_changed");
      continue;
    }
    await client.query(sql);
    await client.query("INSERT INTO sborka_migrations (name, checksum) VALUES ($1, $2)", [name, checksum]);
    console.log(`Applied ${name}`);
  }
  await client.query("COMMIT");
  console.log("PostgreSQL migrations complete");
} catch {
  if (client) await client.query("ROLLBACK").catch(() => {});
  console.error("PostgreSQL migration failed; check runtime connection and database permissions");
  process.exitCode = 1;
} finally {
  client?.release();
  await pool.end();
}
