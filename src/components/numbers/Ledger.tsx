import React from 'react';

export interface LedgerRow {
  label: React.ReactNode;
  sub?: React.ReactNode;
  value: number | string;
  tone?: 'ink' | 'positive' | 'muted' | 'brand';
}

export interface LedgerProps {
  title?: string;
  rows: LedgerRow[];
  total?: number | string;
  totalLabel?: string;
  note?: React.ReactNode;
  dense?: boolean;
  style?: React.CSSProperties;
}

/** Estimate / invoice rows: label left, value right, 1px dividers, total row emphasised. The brand's pricing surface — never SaaS tiers. */
export function Ledger({ title, rows = [], total, totalLabel = 'Итого', note, dense, style }: LedgerProps) {
  const cell: React.CSSProperties = { padding: dense ? '12px 0' : '18px 0', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24 };
  const val = (v: number | string, tone?: LedgerRow['tone']) => (
    <span data-num style={{ font: dense ? 'var(--type-body)' : 'var(--type-body-lg)', fontFeatureSettings: 'var(--num-features)', color: tone === 'positive' ? 'var(--positive)' : tone === 'muted' ? 'var(--text-3)' : tone === 'brand' ? 'var(--brand)' : 'var(--text)', whiteSpace: 'nowrap' }}>{typeof v === 'number' ? v.toLocaleString('ru-RU') + ' ₽' : v}</span>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {title && <div style={{ font: 'var(--type-index)', color: 'var(--text-3)', paddingBottom: 12, borderBottom: '1px solid var(--text)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{title}</div>}
      {rows.map((r, i) => (
        <div key={i} style={cell}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
            <span style={{ font: dense ? 'var(--type-body-sm)' : 'var(--type-body)', color: 'var(--text)' }}>{r.label}</span>
            {r.sub && <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>{r.sub}</span>}
          </span>
          {val(r.value, r.tone)}
        </div>
      ))}
      {total !== undefined && (
        <div style={{ ...cell, borderBottom: 'none', paddingTop: 24, alignItems: 'flex-end' }}>
          <span style={{ font: 'var(--type-body)', color: 'var(--text-2)' }}>{totalLabel}</span>
          <span data-num style={{ font: 'var(--type-num-md)', letterSpacing: 'var(--track-num)', fontFeatureSettings: 'var(--num-features)', color: 'var(--text)', whiteSpace: 'nowrap' }}>{typeof total === 'number' ? total.toLocaleString('ru-RU') + ' ₽' : total}</span>
        </div>
      )}
      {note && <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)', paddingTop: 12 }}>{note}</span>}
    </div>
  );
}
