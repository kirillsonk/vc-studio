import React from 'react';
import { Counter } from './Counter.jsx';

/** Big number + short label, optional caption. Numbers animate on mount. */
export function Stat({ value, label, note, tone = 'ink', size = 'lg', animate = true, prefix, suffix, decimals, style }) {
  const numeric = typeof value === 'number';
  const color = { ink: 'var(--text)', positive: 'var(--positive)', brand: 'var(--brand)', inverse: 'var(--contrast-ink)' }[tone];
  const font = { xl: 'var(--type-num-xl)', lg: 'var(--type-num-lg)', md: 'var(--type-num-md)', sm: 'var(--type-num-sm)' }[size];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0, ...style }}>
      {numeric && animate ? <Counter value={value} from={0} size={size} prefix={prefix} suffix={suffix} decimals={decimals} tone={tone} /> : <span data-num style={{ font, letterSpacing: 'var(--track-num)', fontFeatureSettings: 'var(--num-features)', color }}>{prefix}{value}{suffix}</span>}
      {label && <span style={{ font: 'var(--type-body-sm)', color: tone === 'inverse' ? 'var(--contrast-ink-2)' : 'var(--text-2)' }}>{label}</span>}
      {note && <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>{note}</span>}
    </div>
  );
}
