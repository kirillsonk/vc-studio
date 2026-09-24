import { execFileSync } from "node:child_process";

// Only public configuration is passed to Next.js. Runtime secrets stay at the host
const env = { ...process.env, NEXT_PUBLIC_INTAKE_DELIVERY_ENABLED: process.env.NEXT_PUBLIC_INTAKE_DELIVERY_ENABLED ?? "true", NEXT_PUBLIC_INTAKE_API_URL: process.env.NEXT_PUBLIC_INTAKE_API_URL ?? "/api/intake" };
delete env.CHATGPT_PLATFORM_API_KEY;
delete env.OPENAI_API_KEY;
delete env.TELEGRAM_BOT_TOKEN;
delete env.INTAKE_ADMIN_SECRET;
execFileSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], { env, stdio: "inherit" });
execFileSync(process.execPath, ["scripts/build-worker.mjs"], { env, stdio: "inherit" });
