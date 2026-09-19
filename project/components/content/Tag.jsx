import React from 'react';

/** Small text tag for type / stack / year. Plain, radius 4. */
export function Tag({ children, tone = 'default', style }) {
  const t = { default: { color: 'var(--text-2)', border: 'var(--line-strong)' }, brand: { color: 'var(--brand)', border: 'var(--brand)' }, ink: { color: 'var(--surface)', border: 'var(--ink)', background: 'var(--ink)' } }[tone];
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: 24, padding: '0 8px', borderRadius: 'var(--radius-sm)', border: `1px solid ${t.border}`, background: t.background || 'transparent', color: t.color, font: 'var(--type-caption)', whiteSpace: 'nowrap', ...style }}>{children}</span>;
}
