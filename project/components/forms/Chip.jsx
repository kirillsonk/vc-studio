import React from 'react';

/** Compact chip — secondary multi-select only (filters, tags). Radius 4, never a pill. */
export function Chip({ selected, disabled, onClick, children, style }) {
  return (
    <button type="button" disabled={disabled} aria-pressed={!!selected} onClick={onClick} style={{ height: 32, padding: '0 12px', borderRadius: 'var(--radius-sm)', font: 'var(--type-label-sm)', fontFamily: 'var(--font-sans)', cursor: disabled ? 'not-allowed' : 'pointer', border: `1px solid ${selected ? 'var(--brand)' : 'var(--line-strong)'}`, background: selected ? 'var(--brand-soft)' : 'transparent', color: disabled ? 'var(--disabled-text)' : selected ? 'var(--brand)' : 'var(--text-2)', transition: 'all var(--dur-micro) var(--ease)', whiteSpace: 'nowrap', ...style }}>{children}</button>
  );
}
