'use client';

import React from 'react';
import { Button } from '@/components';
import { Section } from '../Chrome';
import { ROUTES } from '../constants';
import { useGo } from '../navigation';

export function Agencies() {
  const go = useGo();
  return (
    <Section id="agencies" pad={160}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: 'clamp(28px,4vw,56px)' }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,6fr) minmax(0,6fr)', gap: 'var(--grid-gutter)', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)' }}>06</span>
            <h2 style={{ margin: 0, font: 'var(--type-h2)', letterSpacing: 'var(--track-h2)' }}>Production-партнер для агентств</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <p style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text-2)' }}>Подключаемся к кампании на этапе идеи, дизайна или готового макета. Берем на себя frontend, backend, WebGL, игровые механики, интеграции, QA и запуск</p>
            <p style={{ margin: 0, font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>Подходит для проектов, где дедлайн уже есть, а production-команды еще нет</p>
            <div><Button onClick={() => go(ROUTES.intake)}>Передать проект в production</Button></div>
          </div>
        </div>
      </div>
    </Section>
  );
}
