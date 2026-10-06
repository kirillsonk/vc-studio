"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function VCMotion() {
  const anchor = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = matchMedia("(max-width: 900px)");
    const update = () => setCompact(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowed(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const host = anchor.current,
      surface = canvas.current;
    if (!allowed || !host || !surface) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    import("./motion/scene")
      .then(({ createVCScene }) => {
        if (cancelled) return;
        try {
          cleanup = createVCScene(host, surface);
        } catch {
          delete host.dataset.motion;
          surface.style.opacity = "0";
        }
      })
      .catch(() => {
        /* The SVG remains visible if WebGL or the lazy chunk is unavailable. */
      });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [allowed, compact]);
  return (
    <div ref={anchor} className="production-art vc-art">
      <div className="vc-halo" aria-hidden="true" />
      <picture>
        <source media="(max-width: 900px)" srcSet="/brand/sborka-wordmark.svg" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="vc-static"
        src="/brand/sborka-symbol.svg"
        alt=""
        width="540"
        height="500"
        aria-hidden="true"
      />
      </picture>
      {allowed &&
        createPortal(
          <canvas
            ref={canvas}
            className="vc-motion-canvas"
            aria-hidden="true"
          />,
          compact && anchor.current ? anchor.current : document.body,
        )}
    </div>
  );
}
