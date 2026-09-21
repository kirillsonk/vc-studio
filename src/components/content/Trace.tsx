'use client';

import React from 'react';

export interface TraceProps {
  /** stage names or nodes */
  steps?: React.ReactNode[];
  /** index of the current stage; >= steps.length-1 marks production reached (green) */
  active?: number;
  labels?: boolean;
  vertical?: boolean;
  style?: React.CSSProperties;
}

/** Production Trace - the brand motif. A thin vermilion line through named nodes; `active` index is the current stage, earlier ones are done, the last is production (green when reached). Draws on mount. */
export function Trace({ steps = ['Brief', 'Scope', 'Build', 'QA', 'Production'], active = 2, labels = true, vertical = false, style }: TraceProps) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setOn(true), 60); return () => clearTimeout(t); }, []);
  const n = steps.length, done = Math.min(active, n - 1);
  const pct = n > 1 ? (done / (n - 1)) * 100 : 0;
  if (vertical) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', ...style }}>
      {steps.map((s, i) => {
        const d = i < active, cur = i === active, last = i === n - 1;
        const c = last && active >= n - 1 ? 'var(--positive)' : d || cur ? 'var(--brand)' : 'var(--line-strong)';
        return (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: 16, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: cur ? 'var(--surface)' : c, border: `1.5px solid ${c}`, boxSizing: 'border-box', marginTop: 6, flex: 'none' }} />
              {i < n - 1 && <span style={{ flex: 1, width: 1.5, minHeight: 32, background: d ? 'var(--brand)' : 'var(--line)', transformOrigin: 'top', transform: on ? 'scaleY(1)' : 'scaleY(0)', transition: `transform var(--dur-reveal) var(--ease) ${i * 120}ms` }} />}
            </div>
            <div style={{ paddingBottom: 28, minWidth: 0 }}>{typeof s === 'string' ? <span style={{ font: 'var(--type-body)', color: d || cur ? 'var(--text)' : 'var(--text-3)' }}>{s}</span> : s}</div>
          </div>
        );
      })}
    </div>
  );
  return (
    <div style={{ position: 'relative', ...style }}>
      <div style={{ position: 'relative', height: 12, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 5, right: 5, height: 1.5, background: 'var(--line)' }} />
        <div style={{ position: 'absolute', left: 5, height: 1.5, background: 'var(--brand)', width: on ? `calc(${pct}% - ${pct / 100 * 10}px)` : 0, transition: 'width var(--dur-reveal) var(--ease)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'space-between' }}>
          {steps.map((s, i) => {
            const d = i < active, cur = i === active, last = i === n - 1;
            const c = last && active >= n - 1 ? 'var(--positive)' : d || cur ? 'var(--brand)' : 'var(--line-strong)';
            return <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: cur ? 'var(--surface)' : c, border: `1.5px solid ${c}`, boxSizing: 'border-box', opacity: on || i === 0 ? 1 : 0, transition: `opacity var(--dur-ui) var(--ease) ${i * 120}ms` }} />;
          })}
        </div>
      </div>
      {labels && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          {steps.map((s, i) => (
            <span key={i} style={{ font: 'var(--type-caption)', color: i === n - 1 && active >= n - 1 ? 'var(--positive)' : i <= active ? 'var(--text)' : 'var(--text-3)', textAlign: i === 0 ? 'left' : i === n - 1 ? 'right' : 'center', width: `${100 / n}%`, marginLeft: i === 0 ? 0 : undefined, transform: i === 0 ? 'translateX(-5px)' : i === n - 1 ? 'translateX(5px)' : 'none' }}>{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}
