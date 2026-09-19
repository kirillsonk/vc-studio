'use client';

import React from 'react';

export type NumberSize = 'xl' | 'lg' | 'md' | 'sm';

export interface CounterProps {
  value: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  size?: NumberSize;
  /** ink default; positive = live/saved; brand = highlighted; inverse on dark */
  tone?: 'ink' | 'positive' | 'brand' | 'muted' | 'inverse';
  style?: React.CSSProperties;
}

export const numFont: Record<NumberSize, string> = {
  xl: 'var(--type-num-xl)',
  lg: 'var(--type-num-lg)',
  md: 'var(--type-num-md)',
  sm: 'var(--type-num-sm)',
};

/** Animated tabular number. Ink by default; tone="positive" for savings/live, tone="brand" for the highlighted figure. */
export function Counter({ value = 0, from, duration = 900, decimals = 0, prefix = '', suffix = '', size = 'lg', tone = 'ink', style }: CounterProps) {
  const [shown, setShown] = React.useState(from ?? value);
  const prev = React.useRef(from ?? value);
  React.useEffect(() => {
    const start = prev.current, end = value, t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration), e = 1 - Math.pow(1 - p, 3);
      setShown(start + (end - start) * e);
      if (p < 1) raf = requestAnimationFrame(tick); else prev.current = end;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  const font = numFont[size] || numFont.lg;
  const color = { ink: 'var(--text)', positive: 'var(--positive)', brand: 'var(--brand)', muted: 'var(--text-2)', inverse: 'var(--contrast-ink)' }[tone] || 'var(--text)';
  return <span data-num style={{ font, letterSpacing: 'var(--track-num)', fontFeatureSettings: 'var(--num-features)', fontVariantNumeric: 'tabular-nums lining-nums', color, whiteSpace: 'nowrap', ...style }}>{prefix}{shown.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}
