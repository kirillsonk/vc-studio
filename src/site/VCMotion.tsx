"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const STRANDS = 22;
const SAMPLES = 49;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

// Both letters share a sampled topology so every line can become a continuous strand.
const lines = Array.from({ length: STRANDS * 2 }, (_, index) => {
  const row = index % STRANDS;
  return Array.from({ length: SAMPLES }, (_, point) => {
    const t = point / (SAMPLES - 1);
    if (index < STRANDS) {
      const left = 36 + row * 2.5;
      const right = 252 - row * 2.5;
      const bottom = 399 - row * 3.7;
      return t < 0.5
        ? [left + (144 - left) * t * 2, 145 + (bottom - 145) * t * 2]
        : [
            144 + (right - 144) * (t - 0.5) * 2,
            bottom + (145 - bottom) * (t - 0.5) * 2,
          ];
    }
    const angle = ((-48 - t * 264) * Math.PI) / 180;
    return [
      386 + (113 - row * 2.35) * Math.cos(angle),
      272 + (131 - row * 2.5) * Math.sin(angle),
    ];
  });
});
const pathData = (points: number[][]) =>
  points
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

function Metal({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop stopColor="#282c29" />
      <stop offset=".28" stopColor="#92958a" />
      <stop offset=".43" stopColor="#d1d0c3" />
      <stop offset=".55" stopColor="#777d73" />
      <stop offset="1" stopColor="#323831" />
    </linearGradient>
  );
}

export function VCMotion() {
  const anchor = useRef<HTMLDivElement>(null);
  const overlay = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setActive(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const svg = overlay.current;
    const host = anchor.current;
    if (!active || !svg || !host) return;
    const paths = Array.from(
      svg.querySelectorAll<SVGPathElement>(".vc-strand"),
    );
    let frame = 0;
    const draw = () => {
      frame = 0;
      const rect = host.getBoundingClientRect();
      const width = document.documentElement.clientWidth;
      const height = window.innerHeight;
      const top = rect.top + window.scrollY;
      const start = Math.max(40, top + rect.height * 0.5 - height * 0.65);
      const progress = smooth(
        clamp((window.scrollY - start) / Math.max(420, height * 0.6)),
      );
      const scale = Math.min(rect.width / 540, rect.height / 560);
      const originX = rect.left + (rect.width - 540 * scale) / 2;
      const originY = rect.top + (rect.height - 560 * scale) / 2;
      const pageProgress = clamp(
        window.scrollY /
          Math.max(1, document.documentElement.scrollHeight - height),
      );
      const mobile = width < 651;
      const railWidth = mobile ? 12 : Math.min(36, width * 0.028);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      paths.forEach((path, index) => {
        const side = index < STRANDS ? -1 : 1;
        const row = index % STRANDS;
        const stagger = smooth(clamp(progress * 1.2 - (row / STRANDS) * 0.2));
        const points = lines[index].map(([x, y], point) => {
          const t = point / (SAMPLES - 1);
          const wave = Math.sin(
            t * Math.PI * 2 + pageProgress * Math.PI * 4 + row * 0.045,
          );
          const inset =
            2 +
            (row / STRANDS) * railWidth * 0.65 +
            (wave + 1) * railWidth * 0.13;
          const targetX = side < 0 ? inset : width - inset;
          const targetY = -70 + t * (height + 140);
          return [
            originX + x * scale + (targetX - originX - x * scale) * stagger,
            originY + y * scale + (targetY - originY - y * scale) * stagger,
          ];
        });
        path.setAttribute("d", pathData(points));
        path.style.strokeWidth = `${2.2 * scale * (1 - stagger) + (mobile ? 0.65 : 0.85) * stagger}`;
        path.style.opacity = `${1 - Math.sin(progress * Math.PI) * 0.42 - progress * (mobile ? 0.78 : 0.55)}`;
      });
      host.dataset.motion = "active";
      svg.style.visibility = "visible";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(host);
    resize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      delete host.dataset.motion;
    };
  }, [active]);

  return (
    <div ref={anchor} className="production-art vc-art" aria-hidden="true">
      <div className="vc-halo" />
      <svg className="vc-static" viewBox="0 0 540 560" fill="none">
        <defs>
          <Metal id="vc-static-metal" />
        </defs>
        {lines.map((points, index) => (
          <path
            key={index}
            d={pathData(points)}
            stroke={index % STRANDS > 18 ? "#C94320" : "url(#vc-static-metal)"}
            strokeWidth="2.2"
          />
        ))}
      </svg>
      {active &&
        createPortal(
          <svg
            ref={overlay}
            className="vc-motion-overlay"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <Metal id="vc-motion-metal" />
            </defs>
            {lines.map((_, index) => (
              <path
                key={index}
                className="vc-strand"
                pathLength="1"
                style={{ animationDelay: `${(index % STRANDS) * 9}ms` }}
                stroke={
                  index % STRANDS > 18 ? "#C94320" : "url(#vc-motion-metal)"
                }
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>,
          document.body,
        )}
    </div>
  );
}
