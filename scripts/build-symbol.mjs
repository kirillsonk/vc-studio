// Regenerates the static monogram (public/brand/sborka-symbol*.svg) from the same
// geometry the 3D scene uses. Run after editing src/site/motion/monogram.json:
//   npm run build:symbol
import { readFileSync, writeFileSync } from "node:fs";
import { sampleStroke } from "../src/site/motion/strokes.mjs";

const spec = JSON.parse(readFileSync(new URL("../src/site/motion/monogram.json", import.meta.url), "utf8"));
const COUNT = 160;
const toSvg = ([x, y]) => [270 + 0.92 * x, 250 - 0.92 * y];

function offset(points, spread) {
  return points.map((p, i) => {
    const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
    return [p[0] - (ty / l) * spread, p[1] + (tx / l) * spread];
  });
}
const d = (points) => "M" + points.map(toSvg).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

// Layer 0 and 1 are polished metal, layer 2 is the copper strand, as in the scene
const layers = [[-1, "metal", 6.5], [0, "metal", 6], [1, "copper", 4]];
const paths = spec.letters.flatMap((l) =>
  l.strokes.flatMap((cmds) => {
    const pts = sampleStroke(cmds, l.x, l.y, COUNT);
    return layers.map(([k, kind, w]) => ({ d: d(offset(pts, k * spec.spread)), kind, w }));
  }),
);

const head = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 500" fill="none">\n';
const defs = '<defs><linearGradient id="metal" x1="50" y1="80" x2="470" y2="420" gradientUnits="userSpaceOnUse"><stop stop-color="#373f3b"/><stop offset=".24" stop-color="#a3aaa0"/><stop offset=".38" stop-color="#f3f2e9"/><stop offset=".49" stop-color="#626e64"/><stop offset=".71" stop-color="#d2d7ca"/><stop offset="1" stop-color="#39443c"/></linearGradient><linearGradient id="copper"><stop stop-color="#8e341c"/><stop offset=".44" stop-color="#f1b28a"/><stop offset=".62" stop-color="#c94320"/><stop offset="1" stop-color="#913619"/></linearGradient><filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="5" dy="12" stdDeviation="8" flood-color="#34382b" flood-opacity=".14"/></filter></defs>\n';
const g = (attrs, body) => `<g stroke-linecap="round" stroke-linejoin="round"${attrs}>\n${body}</g></svg>\n`;

writeFileSync(new URL("../public/brand/sborka-symbol.svg", import.meta.url),
  head + defs + g(' filter="url(#shadow)"', paths.map((p) => `<path d="${p.d}" stroke="url(#${p.kind})" stroke-width="${p.w}"/>\n`).join("")));
writeFileSync(new URL("../public/brand/sborka-symbol-mono.svg", import.meta.url),
  head + g("", paths.map((p) => `<path d="${p.d}" stroke="#111214" stroke-width="${p.w}"/>\n`).join("")));
console.log(`sborka-symbol.svg: ${paths.length} strands`);
