'use client';

import React from 'react';
import { Button, Stat } from '@/components';
import { Head, Section } from '../Chrome';
import { Media } from '../Media';
import { DEMO_CASE } from '../data';
import { ROUTES } from '../constants';
import { useGo } from '../navigation';

/**
 * One demonstration project, full width. The visual is the card; facts sit in a single
 * aligned row beneath it so nothing on the left has to line up with a differently sized card on the right
 */
export function Cases() {
  const go = useGo();
  const c = DEMO_CASE;
  const [hover, setHover] = React.useState(false);
  return (
    <Section id="cases" pad={160}>
      <Head index="02" title="Проект с открытой экономикой" lead="Клиентских кейсов здесь пока нет, и мы их не придумываем. Вместо них один проект, собранный для этого сайта: с реальным сроком, бюджетом и расходом AI" />
      <div
        role="link"
        tabIndex={0}
        onClick={() => go(ROUTES.case)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(ROUTES.case); } }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ display: 'flex', flexDirection: 'column', gap: 32, cursor: 'pointer', outlineOffset: 8 }}
      >
        <div style={{ position: 'relative', aspectRatio: '21/9', background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--line)' }}>
          <div style={{ position: 'absolute', inset: 0, transform: hover ? 'scale(1.02)' : 'none', transition: 'transform var(--dur-reveal) var(--ease)' }}>
            <Media {...c.media} />
          </div>
        </div>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>{c.index} / {c.kind}</span>
            <h3 style={{ margin: 0, font: 'var(--type-h3)', letterSpacing: 'var(--track-h3)', color: hover ? 'var(--brand)' : 'var(--text)', transition: 'color var(--dur-micro)' }}>{c.title}</h3>
            <p className="pretty" style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-2)', maxWidth: 560 }}>{c.lead}</p>
          </div>
          <div className="grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 'var(--grid-gutter)', paddingTop: 20, borderTop: '1px solid var(--text)' }}>
            <Stat value={c.days} suffix=" дней" label="до запуска" size="md" />
            <Stat value={c.budget} suffix=" ₽" label="бюджет проекта" size="md" />
            <Stat value={c.aiCost} suffix=" ₽" label="из них AI-расход" size="md" />
          </div>
        </div>
      </div>
      <div style={{ paddingTop: 32 }}>
        <Button variant="secondary" onClick={() => go(ROUTES.case)}>Открыть проект</Button>
      </div>
    </Section>
  );
}
