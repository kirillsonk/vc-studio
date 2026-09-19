'use client';

import React from 'react';
import { Counter, numFont, type NumberSize } from './Counter';

export interface StatProps {
  value: number | string;
  label?: React.ReactNode;
  note?: React.ReactNode;
  tone?: 'ink' | 'positive' | 'brand' | 'inverse';
  size?: NumberSize;
  animate?: boolean;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  style?: React.CSSProperties;
}

/** Big number + short label, optional caption. Numbers animate on mount. */
export function Stat({ value, label, note, tone = 'ink', size = 'lg', animate = true, prefix, suffix, decimals, style }: StatProps) {
  const numeric = typeof value === 'number';
  const color = { ink: 'var(--text)', positive: 'var(--positive)', brand: 'var(--brand)', inverse: 'var(--contrast-ink)' }[tone];
  const font = numFont[size];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0, ...style }}>
      {numeric && animate
        ? <Counter value={value as number} from={0} size={size} prefix={prefix} suffix={suffix} decimals={decimals} tone={tone} />
        : <span data-num style={{ font, letterSpacing: 'var(--track-num)', fontFeatureSettings: 'var(--num-features)', color }}>{prefix}{value}{suffix}</span>}
      {label && <span style={{ font: 'var(--type-body-sm)', color: tone === 'inverse' ? 'var(--contrast-ink-2)' : 'var(--text-2)' }}>{label}</span>}
      {note && <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>{note}</span>}
    </div>
  );
}
