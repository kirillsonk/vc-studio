import React from 'react';

export function Container({ children, style, id, className }: { children: React.ReactNode; style?: React.CSSProperties; id?: string; className?: string }) {
  return <div id={id} className={className} style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-pad)', boxSizing: 'border-box', ...style }}>{children}</div>;
}

export function Section({ children, style, id, pad = 140, border }: { children: React.ReactNode; style?: React.CSSProperties; id?: string; pad?: number; border?: boolean }) {
  return <section id={id} style={{ paddingTop: pad, borderTop: border ? '1px solid var(--line)' : 'none' }}><Container style={style}>{children}</Container></section>;
}

/** Editorial 7/5 head: index + title left, lead right. */
export function Head({ index, title, lead, children }: { index?: React.ReactNode; title: React.ReactNode; lead?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'end', paddingBottom: 48 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {index && <span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)' }}>{index}</span>}
        <h2 style={{ margin: 0, font: 'var(--type-h2)', letterSpacing: 'var(--track-h2)', maxWidth: 760 }}>{title}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {lead && <p className="pretty" style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text-2)', maxWidth: 480 }}>{lead}</p>}
        {children}
      </div>
    </div>
  );
}
