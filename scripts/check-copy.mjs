import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
const violations = [];
async function scan(file) {
  const source = await readFile(file, "utf8");
  if (/\.tsx?$/.test(file)) {
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    const visit = (node) => {
      const literal =
        ts.isStringLiteral(node) &&
        /[А-Яа-я]/u.test(node.text) &&
        node.text.endsWith(".");
      const jsx =
        ts.isJsxText(node) &&
        /\.\s*$/u.test(node.text) &&
        /^(p|figcaption|small|label|li)$/u.test(
          node.parent.openingElement?.tagName.getText(ast) ?? "",
        );
      if (literal || jsx) {
        const { line } = ast.getLineAndCharacterOfPosition(node.getStart(ast));
        violations.push(
          `${file}:${line + 1}: trailing period in secondary copy`,
        );
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
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
await walk("server");
for (const file of [
  "BRAND.md",
  "README.md",
  "AGENTS.md",
  "docs/intake-flow.md",
  "docs/intake-api.md",
  "docs/astra-intake-prompt.md",
  "docs/intake-status.md",
])
  await scan(file);
if (violations.length) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else console.log("TOV check passed.");
