'use client';

import React from 'react';

export interface CompareProps {
  ours: number | [number, number];
  theirs: number | [number, number];
  ourLabel?: string;
  theirLabel?: string;
  unit?: string;
  savingLabel?: string;
  note?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Two production models as horizontal bars - ours in brand vermilion, market reference in graphite. Quiet; no strike-through, no badges. */
export function Compare({ ours, theirs, ourLabel = 'AI-native production', theirLabel = 'Классическая production-модель', unit = ' ₽', savingLabel = 'разница', note, style }: CompareProps) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setOn(true), 60); return () => clearTimeout(t); }, []);
  const fmt = (v: number | [number, number]) => Array.isArray(v) ? v[0].toLocaleString('ru-RU') + '-' + v[1].toLocaleString('ru-RU') + unit : v.toLocaleString('ru-RU') + unit;
  const max = Array.isArray(theirs) ? theirs[1] : theirs;
  const oursN = Array.isArray(ours) ? ours[1] : ours;
  const theirsN = Array.isArray(theirs) ? theirs[0] : theirs;
  const bar = (v: number, color: string) => <div style={{ height: 40, background: color, width: on ? (v / max * 100) + '%' : '0%', transition: 'width var(--dur-reveal) var(--ease)', borderRadius: 2 }} />;
  const row = (label: string, v: number | [number, number], vN: number, color: string) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 24, alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>{label}</span>{bar(vN, color)}</div>
      <span data-num style={{ font: 'var(--type-num-md)', letterSpacing: 'var(--track-num)', fontFeatureSettings: 'var(--num-features)', color: color === 'var(--brand)' ? 'var(--text)' : 'var(--text-2)', whiteSpace: 'nowrap' }}>{fmt(v)}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {row(ourLabel, ours, oursN, 'var(--brand)')}
      {row(theirLabel, theirs, theirsN, 'var(--line-strong)')}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, padding: '16px 0 0', alignItems: 'baseline' }}>
        <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)', maxWidth: 520 }}>{note}</span>
        <span data-num style={{ font: 'var(--type-body)', color: 'var(--positive)', fontFeatureSettings: 'var(--num-features)', whiteSpace: 'nowrap' }}>{savingLabel} −{(theirsN - oursN).toLocaleString('ru-RU')}{unit}</span>
      </div>
    </div>
  );
}
