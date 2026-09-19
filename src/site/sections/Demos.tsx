'use client';

import React from 'react';
import { Counter, DemoBlock } from '@/components';
import { Head, Section } from '../Chrome';

function LiveTokens() {
  const [n, setN] = React.useState(0);
  React.useEffect(() => { const t = setInterval(() => setN(x => x + Math.round(Math.random() * 900)), 600); return () => clearInterval(t); }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Counter value={n} size="xl" tone="inverse" />
        <span style={{ font: 'var(--type-body-sm)', color: 'var(--contrast-ink-2)' }}>токенов сгенерировано за эту сессию</span>
      </div>
    </div>
  );
}

export function Demos() {
  return (
    <Section id="demos" pad={160}>
      <Head index="01" title="Не рассказываем, что умеем. Показываем" lead="Веб-игры, 3D, интерактивные механики и анимация работают прямо здесь. Это тот же технологический уровень, который мы собираем для клиентских проектов" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        <DemoBlock dark title="3D-конфигуратор упаковки" meta="WebGL · 60 FPS" ratio="21/9" cta="Запустить демо" poster={<div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--contrast-ink-2)', font: 'var(--type-body-sm)' }} />}>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <div style={{ width: 'min(36vw,320px)', aspectRatio: '1', border: '1.5px solid var(--brand)', borderRadius: 'var(--radius-lg)', animation: 'vc-turn 6s var(--ease-in-out) infinite alternate', display: 'grid', placeItems: 'center' }}>
              <span style={{ color: 'var(--contrast-ink-2)', font: 'var(--type-caption)' }}>здесь монтируется сцена</span>
            </div>
          </div>
        </DemoBlock>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
          <DemoBlock title="Браузерная мини-игра" meta="Canvas · лидерборд" ratio="16/10" cta="Запустить игру">
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--text-3)', font: 'var(--type-body-sm)' }}>здесь монтируется игра</div>
          </DemoBlock>
          <DemoBlock title="Live-счетчик генерации" meta="Live" ratio="4/5" autoload dark><LiveTokens /></DemoBlock>
        </div>
      </div>
    </Section>
  );
}
