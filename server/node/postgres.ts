import { Pool } from "pg";
import type { Env } from "../worker";

export interface QueryClient {
  query(sql: string, values: (string | number)[]): Promise<{ rows: Record<string, unknown>[]; rowCount?: number | null }>;
}

// The existing queries use SQLite/D1 placeholders. Ignore quoted strings,
// identifiers and comments so user values and SQL literals stay untouched.
export function postgresParameters(sql: string) {
  let position = 0;
  let index = 0;
  let output = "";
  while (index < sql.length) {
    const char = sql[index];
    if (char === "'" || char === '"') {
      const quote = char;
      output += char;
      index++;
      while (index < sql.length) {
        output += sql[index];
        if (sql[index++] === quote) {
          if (sql[index] === quote) { output += sql[index++]; continue; }
          break;
        }
      }
    } else if (sql.startsWith("--", index)) {
      const end = sql.indexOf("\n", index);
      const length = end < 0 ? sql.length : end;
      output += sql.slice(index, length);
      index = length;
    } else if (sql.startsWith("/*", index)) {
      const end = sql.indexOf("*/", index + 2);
      const length = end < 0 ? sql.length : end + 2;
      output += sql.slice(index, length);
      index = length;
    } else if (char === "$") {
      const match = sql.slice(index).match(/^\$(?:[A-Za-z_][A-Za-z0-9_]*)?\$/);
      if (match) {
        const end = sql.indexOf(match[0], index + match[0].length);
        if (end < 0) throw new Error("invalid_sql");
        const length = end + match[0].length;
        output += sql.slice(index, length);
        index = length;
      } else { output += char; index++; }
    } else {
      output += char === "?" ? `$${++position}` : char;
      index++;
    }
  }
  // PostgreSQL requires explicit target references beside EXCLUDED in upserts.
  if (/^\s*INSERT\s+INTO\s+intake_limits\b/i.test(output)) {
    output = output.replace(/WHEN expires/g, "WHEN intake_limits.expires")
      .replace(/ELSE count \+/g, "ELSE intake_limits.count +")
      .replace(/ELSE expires END/g, "ELSE intake_limits.expires END");
  }
  return { sql: output, parameters: position };
}

export function postgresDatabase(client: QueryClient): NonNullable<Env["DB"]> {
  return {
    prepare(sql) {
      const statement = postgresParameters(sql);
      const bound = (values: (string | number)[]) => {
        const execute = async () => {
          if (values.length !== statement.parameters) throw new Error("sql_parameter_count");
          return client.query(statement.sql, values);
        };
        return {
          bind: (...args: (string | number)[]) => bound(args),
          first: async <T>() => (await execute()).rows[0] as T ?? null,
          run: async () => { const result = await execute(); return { changes: result.rowCount ?? 0 }; },
        };
      };
      return bound([]);
    },
  };
}

const pools = globalThis as typeof globalThis & { sborkaDatabasePool?: Pool; sborkaDatabaseUrl?: string };
export function runtimeDatabase(connectionString: string | undefined) {
  if (!connectionString?.trim()) return undefined;
  const uri = new URL(connectionString);
  if (!['postgres:', 'postgresql:'].includes(uri.protocol)) throw new Error("invalid_database_url");
  if (pools.sborkaDatabasePool && pools.sborkaDatabaseUrl !== connectionString) throw new Error("database_configuration_changed");
  if (!pools.sborkaDatabasePool) {
    pools.sborkaDatabasePool = new Pool({
      connectionString,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      statement_timeout: 10000,
      application_name: "sborka-intake",
    });
    // Never log database errors because server messages may contain connection data.
    pools.sborkaDatabasePool.on("error", () => console.warn(JSON.stringify({ event: "intake", code: "database_connection_error" })));
    pools.sborkaDatabaseUrl = connectionString;
  }
  return postgresDatabase(pools.sborkaDatabasePool);
}
