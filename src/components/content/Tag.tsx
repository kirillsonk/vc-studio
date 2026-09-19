import React from 'react';

export interface TagProps {
  children: React.ReactNode;
  tone?: 'default' | 'brand' | 'ink';
  style?: React.CSSProperties;
}

/** Small text tag for type / stack / year. Plain, radius 4. */
export function Tag({ children, tone = 'default', style }: TagProps) {
  const t = {
    default: { color: 'var(--text-2)', border: 'var(--line-strong)', background: undefined as string | undefined },
    brand: { color: 'var(--brand)', border: 'var(--brand)', background: undefined as string | undefined },
    ink: { color: 'var(--surface)', border: 'var(--ink)', background: 'var(--ink)' as string | undefined },
  }[tone];
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: 24, padding: '0 8px', borderRadius: 'var(--radius-sm)', border: `1px solid ${t.border}`, background: t.background || 'transparent', color: t.color, font: 'var(--type-caption)', whiteSpace: 'nowrap', ...style }}>{children}</span>;
}
