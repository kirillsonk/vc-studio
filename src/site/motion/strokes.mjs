// Turns the monogram's path commands into evenly spaced points. Plain JS so the
// 3D scene and the fallback-SVG script sample the exact same geometry.
const rad = (d) => (d * Math.PI) / 180;

export function sampleStroke(cmds, ox, oy, count) {
  const dense = [];
  let x = 0, y = 0;
  for (const [op, ...n] of cmds) {
    if (op === "M") {
      x = n[0]; y = n[1];
      dense.push([x, y, 0]);
    } else if (op === "L") {
      for (let k = 1; k <= 24; k++) dense.push([x + ((n[0] - x) * k) / 24, y + ((n[1] - y) * k) / 24, 0]);
      x = n[0]; y = n[1];
    } else if (op === "C") {
      for (let k = 1; k <= 32; k++) {
        const t = k / 32, u = 1 - t;
        dense.push([
          u * u * u * x + 3 * u * u * t * n[0] + 3 * u * t * t * n[2] + t * t * t * n[4],
          u * u * u * y + 3 * u * u * t * n[1] + 3 * u * t * t * n[3] + t * t * t * n[5],
          0,
        ]);
      }
      x = n[4]; y = n[5];
    } else if (op === "A") {
      const [cx, cy, rx, ry, a0, a1, z] = n;
      for (let k = 0; k <= 96; k++) {
        const a = rad(a0 + ((a1 - a0) * k) / 96);
        dense.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a), Math.sin(a) * z]);
      }
      x = dense[dense.length - 1][0]; y = dense[dense.length - 1][1];
    }
  }
  // Resample by arc length so ribbons stay smooth on long straights and tight curves alike
  const dist = [0];
  for (let i = 1; i < dense.length; i++) {
    const [ax, ay] = dense[i - 1], [bx, by] = dense[i];
    dist.push(dist[i - 1] + Math.hypot(bx - ax, by - ay));
  }
  const total = dist[dist.length - 1];
  const out = [];
  let j = 0;
  for (let k = 0; k <= count; k++) {
    const s = (total * k) / count;
    while (j < dense.length - 2 && dist[j + 1] < s) j++;
    const t = (s - dist[j]) / Math.max(1e-9, dist[j + 1] - dist[j]);
    const a = dense[j], b = dense[j + 1];
    out.push([a[0] + (b[0] - a[0]) * t + ox, a[1] + (b[1] - a[1]) * t + oy, a[2] + (b[2] - a[2]) * t]);
  }
  return out;
}
