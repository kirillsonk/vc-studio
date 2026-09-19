import React from 'react';
import { Section } from '../Chrome';

const ITEMS: Array<[title: string, detail: string]> = [
  ['Промо-сайты', 'Кампании, запуски, продуктовые страницы с интерактивом и анимацией'],
  ['Веб-игры', 'Короткие браузерные механики с лидербордами, промокодами и аналитикой'],
  ['3D / WebGL', 'Конфигураторы, сцены и визуализации, которые работают без установки'],
  ['Спецпроекты', 'Нестандартная механика под конкретную рекламную идею'],
  ['Production для агентств', 'Frontend, backend, интеграции и запуск по готовому дизайну'],
];

export function WhatWeDo() {
  return (
    <Section id="what" pad={160} border>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)', gap: 'var(--grid-gutter)', paddingTop: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)' }}>03</span>
          <h2 style={{ margin: 0, font: 'var(--type-h2)', letterSpacing: 'var(--track-h2)' }}>Что делаем</h2>
          <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-2)', maxWidth: 400 }}>Бюджеты от 100 000 ₽. Верхней границы нет: тот же production собирает проекты, за которые классическая студия берет несколько миллионов</p>
        </div>
        <div>
          {ITEMS.map(([t, d], i) => (
            <div key={t} style={{ display: 'grid', gridTemplateColumns: '48px minmax(0,1fr) minmax(0,1.4fr)', gap: 'var(--grid-gutter)', padding: '24px 0', borderBottom: '1px solid var(--line)', alignItems: 'baseline' }}>
              <span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>{t}</span>
              <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
