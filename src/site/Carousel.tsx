"use client";
import React from "react";

/**
 * Horizontal gallery ("листалка"): native scroll with snap, so touch, trackpad and
 * keyboard all work without a library. Buttons page by one card; the thin
 * progress line mirrors the brand trace. Bleeds to the right edge of the viewport.
 */
export function Carousel({ label, children }: { label: string; children: React.ReactNode }) {
  const track = React.useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState({ start: true, end: false, progress: 0, visible: 1 });

  const measure = React.useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft >= max - 2,
      progress: max > 0 ? el.scrollLeft / max : 0,
      visible: el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1,
    });
  }, []);

  React.useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(":scope > *");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? el.clientWidth) + gap), behavior: "smooth" });
  };

  const thumb = Math.max(0.12, Math.min(1, state.visible));
  return (
    <div className="carousel" role="region" aria-roledescription="карусель" aria-label={label}>
      <div className="carousel-track" ref={track} tabIndex={0}>
        {children}
      </div>
      <div className="carousel-bar">
        <div className="carousel-progress" aria-hidden="true">
          <span style={{ width: `${thumb * 100}%`, transform: `translateX(${(state.progress * (1 - thumb) / thumb) * 100}%)` }} />
        </div>
        <div className="carousel-buttons">
          <button type="button" onClick={() => page(-1)} disabled={state.start} aria-label="Назад">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M15 5 8 12l7 7" /></svg>
          </button>
          <button type="button" onClick={() => page(1)} disabled={state.end} aria-label="Дальше">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
