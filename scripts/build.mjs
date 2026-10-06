import { execFileSync } from "node:child_process";

// Only public configuration is passed to Next.js. Runtime secrets stay at the host
const env = { ...process.env, NEXT_PUBLIC_INTAKE_DELIVERY_ENABLED: process.env.NEXT_PUBLIC_INTAKE_DELIVERY_ENABLED ?? "true", NEXT_PUBLIC_INTAKE_API_URL: process.env.NEXT_PUBLIC_INTAKE_API_URL ?? "/api/intake" };
for (const key of ["CHATGPT_PLATFORM_API_KEY", "OPENAI_API_KEY", "TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID", "INTAKE_ADMIN_SECRET", "RELAY_SECRET", "RELAY_URL", "RELAY_CLIENT", "DATABASE_URL", "PGPASSWORD", "PUBLIC_ORIGIN", "TRUST_PROXY"]) delete env[key];
execFileSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], { env, stdio: "inherit" });
if (process.env.NEXT_STANDALONE !== "1") {
  execFileSync(process.execPath, ["scripts/build-worker.mjs"], { env, stdio: "inherit" });
}
