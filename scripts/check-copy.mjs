import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
const violations = [];
async function scan(file) {
  const source = await readFile(file, "utf8");
  source.split("\n").forEach((line, index) => {
    if (/[\u0451\u0401\u2013\u2014]/u.test(line))
      violations.push(`${file}:${index + 1}: forbidden TOV character`);
  });
}
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(tsx?|css|json)$/.test(file)) await scan(file);
  }
}
await walk("src");
for (const file of [
  "BRAND.md",
  "README.md",
  "AGENTS.md",
  "docs/intake-flow.md",
])
  await scan(file);
if (violations.length) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else console.log("TOV check passed.");
