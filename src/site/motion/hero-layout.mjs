// Hero composition shared by the 3D scene and the fallback-SVG script:
// which objects exist, their sampled strokes, and where each one is at time t.
import { sampleStroke } from "./strokes.mjs";

const rad = (d) => (d * Math.PI) / 180;

function rotate2d([x, y, z], deg) {
  const a = rad(deg), c = Math.cos(a), s = Math.sin(a);
  return [x * c - y * s, x * s + y * c, z];
}

/**
 * Objects: six orbiting letters and three atom rings. The nucleus is a sphere,
 * drawn separately by the scene and the SVG script.
 * Each stroke of each object later becomes 1 or 3 parallel ribbons (strands).
 */
export function buildHero(spec, count) {
  const objects = [];
  spec.orbit.letters.forEach((letter, i) => {
    objects.push({
      kind: "letter",
      index: i,
      base: letter,
      strands: 3,
      spread: spec.orbit.spread,
      thick: spec.orbit.thick,
      strokes: spec.glyphs[letter.char].map((cmds, si) => ({
        points: sampleStroke(cmds, 0, 0, count),
        // С and Б carry on into the two background waves on scroll
        primary: i < 2 && si === 0,
        wave: i % 2,
      })),
    });
  });
  spec.atom.rings.forEach((ring, i) => {
    const cmds = [["A", 0, 0, ring.rx, ring.ry, 2, 358, 0]];
    objects.push({
      kind: "ring",
      index: i,
      strands: 1,
      spread: 0,
      thick: spec.atom.thick,
      copper: Boolean(ring.copper),
      strokes: [{ points: sampleStroke(cmds, 0, 0, count).map((p) => rotate2d(p, ring.rot)), primary: false, wave: i % 2 }],
    });
  });
  return objects;
}

/** Position, rotation (radians, applied X then Y then Z) and scale of an object at time t (seconds) */
export function placeAt(obj, spec, t) {
  if (obj.kind === "letter") {
    const o = spec.orbit, i = obj.index;
    const a = rad(obj.base.angle) + t * o.speed;
    const z = -o.rz * Math.sin(a) + obj.base.z;
    return {
      x: o.rx * Math.cos(a),
      y: o.ry * Math.sin(a) + Math.sin(t * 0.8 + i * 1.7) * o.bob,
      z,
      // Letters turn gently but stay upright enough to read
      rx: 0,
      ry: Math.sin(t * 0.5 + i * 1.3) * 0.35,
      rz: Math.sin(t * 0.4 + i) * 0.06,
      scale: o.scale * (1 + z / 600),
    };
  }
  const at = spec.atom;
  return { x: 0, y: 0, z: 0, rx: at.tilt, ry: Math.sin(t * 0.3) * 0.45, rz: t * at.spin, scale: 1 };
}

/** Local point -> composed space, same order in the scene and in the SVG script */
export function applyPlacement([x, y, z], p) {
  x *= p.scale; y *= p.scale; z *= p.scale;
  let c = Math.cos(p.rx), s = Math.sin(p.rx);
  [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(p.ry); s = Math.sin(p.ry);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(p.rz); s = Math.sin(p.rz);
  [x, y] = [x * c - y * s, x * s + y * c];
  return [x + p.x, y + p.y, z + p.z];
}

/** Offset a sampled stroke sideways in its own plane, for the parallel strands */
export function offsetStroke(points, amount) {
  return points.map((p, i) => {
    const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
    return [p[0] - (ty / l) * amount, p[1] + (tx / l) * amount, p[2]];
  });
}
