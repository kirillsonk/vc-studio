import React from 'react';

export interface BriefMessageProps {
  role?: 'ai' | 'user';
  /** question number, shown as 01 02 … */
  index?: number;
  pending?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** One line of the project brief dialogue. Not a chat bubble: AI is a plain paragraph with a vermilion index; the user's answer is set in ink with a left rule. */
export function BriefMessage({ role = 'ai', index, children, pending, style }: BriefMessageProps) {
  const ai = role === 'ai';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '40px minmax(0,1fr)', gap: 16, alignItems: 'start', ...style }}>
      <span data-num style={{ font: 'var(--type-index)', color: ai ? 'var(--brand)' : 'var(--text-3)', paddingTop: 5 }}>{ai ? (index !== undefined ? String(index).padStart(2, '0') : '—') : ''}</span>
      {pending
        ? <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center', height: 26 }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--brand)', animation: `vc-dot 1.2s ${i * .15}s var(--ease-in-out) infinite` }} />)}</span>
        : <div style={{ font: ai ? 'var(--type-body-lg)' : 'var(--type-body)', color: ai ? 'var(--text)' : 'var(--text-2)', borderLeft: ai ? 'none' : '1.5px solid var(--line-strong)', paddingLeft: ai ? 0 : 14, lineHeight: 1.45 }}>{children}</div>}
    </div>
  );
}
