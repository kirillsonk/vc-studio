"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function VCMotion() {
  const anchor = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [paused, setPaused] = useState(false);
  const active = allowed && !paused;
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
    if (!active || !host || !surface) return;
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
  }, [active]);
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
      {allowed && (
        <button
          className="motion-toggle"
          type="button"
          aria-label={
            paused
              ? "Включить анимацию знака"
              : "Остановить анимацию логотипа"
          }
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
          title={paused ? "Включить движение" : "Остановить движение"}
        >
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            {paused ? (
              <path d="m6 4 9 6-9 6z" fill="currentColor" />
            ) : (
              <path
                d="M7 4v12M13 4v12"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            )}
          </svg>
        </button>
      )}
      {active &&
        createPortal(
          <canvas
            ref={canvas}
            className="vc-motion-canvas"
            aria-hidden="true"
          />,
          document.body,
        )}
    </div>
  );
}
