import React from 'react';

/** Flat colour plate standing in for a real project still. Replace with imagery when it lands. */
export function Media({ c, t, fg = 'rgba(255,255,255,.55)' }: { c: string; t: string; fg?: string }) {
  return (
    <div style={{ width: '100%', height: '100%', background: c, display: 'grid', placeItems: 'center' }}>
      <span style={{ font: '500 clamp(28px,4vw,56px)/1 var(--font-sans)', letterSpacing: '-.04em', color: fg }}>{t}</span>
    </div>
  );
}
