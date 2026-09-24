// Regenerates the static hero art (public/brand/sborka-symbol*.svg) from the same
// composition the 3D scene uses, frozen at t = 0. Run after editing
// src/site/motion/hero.json:   npm run build:symbol
import { readFileSync, writeFileSync } from "node:fs";
import { applyPlacement, buildHero, offsetStroke, placeAt } from "../src/site/motion/hero-layout.mjs";

const spec = JSON.parse(readFileSync(new URL("../src/site/motion/hero.json", import.meta.url), "utf8"));
const COUNT = 160;
const toSvg = ([x, y]) => [270 + 0.92 * x, 250 - 0.92 * y];

const strands = [];
for (const obj of buildHero(spec, COUNT)) {
  const pl = placeAt(obj, spec, 0);
  for (const stroke of obj.strokes) {
    for (let k = 0; k < obj.strands; k++) {
      const layer = obj.strands === 3 ? k : 1;
      const copper = obj.strands === 3 ? layer === 2 : Boolean(obj.copper);
      const pts = offsetStroke(stroke.points, (layer - 1) * obj.spread).map((p) => applyPlacement(p, pl));
      const depth = pts.reduce((sum, p) => sum + p[2], 0) / pts.length;
      const width = (copper ? 4 : 6.2) * obj.thick * Math.max(0.6, pl.scale / 0.8);
      strands.push({ pts, depth, copper, width });
    }
  }
}
// Painter's order: far strands first
strands.sort((a, b) => a.depth - b.depth);
const d = (pts) => "M" + pts.map(toSvg).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

const head = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 500" fill="none">\n';
const defs = '<defs><linearGradient id="metal" x1="50" y1="80" x2="470" y2="420" gradientUnits="userSpaceOnUse"><stop stop-color="#373f3b"/><stop offset=".24" stop-color="#a3aaa0"/><stop offset=".38" stop-color="#f3f2e9"/><stop offset=".49" stop-color="#626e64"/><stop offset=".71" stop-color="#d2d7ca"/><stop offset="1" stop-color="#39443c"/></linearGradient><linearGradient id="copper"><stop stop-color="#8e341c"/><stop offset=".44" stop-color="#f1b28a"/><stop offset=".62" stop-color="#c94320"/><stop offset="1" stop-color="#913619"/></linearGradient><filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="5" dy="12" stdDeviation="8" flood-color="#34382b" flood-opacity=".14"/></filter></defs>\n';
const g = (attrs, body) => `<g stroke-linecap="round" stroke-linejoin="round"${attrs}>\n${body}</g></svg>\n`;
const w = (x) => x.toFixed(1);

writeFileSync(new URL("../public/brand/sborka-symbol.svg", import.meta.url),
  head + defs + g(' filter="url(#shadow)"', strands.map((s) => `<path d="${d(s.pts)}" stroke="url(#${s.copper ? "copper" : "metal"})" stroke-width="${w(s.width)}"/>\n`).join("")));
writeFileSync(new URL("../public/brand/sborka-symbol-mono.svg", import.meta.url),
  head + g("", strands.map((s) => `<path d="${d(s.pts)}" stroke="#111214" stroke-width="${w(s.width)}"/>\n`).join("")));
console.log(`sborka-symbol.svg: ${strands.length} strands`);
