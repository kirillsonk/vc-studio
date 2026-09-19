'use client';

import React from 'react';

export interface CaseCardProps {
  title: string;
  kind?: string;
  year?: string | number;
  client?: string;
  days?: number;
  budget?: number;
  media?: React.ReactNode;
  ratio?: string;
  href?: string;
  onClick?: () => void;
  size?: 'md' | 'lg';
  style?: React.CSSProperties;
}

/** Editorial project preview: the visual IS the card; text sits plainly beneath on the canvas. Hover starts motion in the visual. */
export function CaseCard({ title, kind, year, client, days, budget, media, ratio = '4/3', href, onClick, size = 'md', style }: CaseCardProps) {
  const [hover, setHover] = React.useState(false);
  const Wrap = (href ? 'a' : 'div') as 'a';
  const fact = (v: React.ReactNode, l: string) => (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span data-num style={{ font: 'var(--type-body)', fontFeatureSettings: 'var(--num-features)', color: 'var(--text)' }}>{v}</span>
      <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>{l}</span>
    </span>
  );
  return (
    <Wrap href={href} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', flexDirection: 'column', gap: 20, color: 'var(--text)', textDecoration: 'none', cursor: 'pointer', minWidth: 0, ...style }}>
      <div style={{ position: 'relative', aspectRatio: ratio, background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--line)' }}>
        <div style={{ position: 'absolute', inset: 0, transform: hover ? 'scale(1.02)' : 'none', transition: 'transform var(--dur-reveal) var(--ease)', display: 'grid', placeItems: 'center' }}>{media || <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>превью проекта</span>}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>{[kind, year, client].filter(Boolean).join(' / ')}</span>
        <span style={{ font: size === 'lg' ? 'var(--type-h3)' : 'var(--type-h4)', letterSpacing: 'var(--track-h4)', color: hover ? 'var(--brand)' : 'var(--text)', transition: 'color var(--dur-micro)' }}>{title}</span>
        {(days || budget) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
            {days && fact(days + ' дней', 'до запуска')}
            {budget && fact(budget.toLocaleString('ru-RU') + ' ₽', 'бюджет проекта')}
          </div>
        )}
      </div>
    </Wrap>
  );
}
