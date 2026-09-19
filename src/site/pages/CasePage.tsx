'use client';

import React from 'react';
import { Button, Compare, DemoBlock, Stat, Tag, Trace } from '@/components';
import { Container } from '../Chrome';
import { COMPARE_NOTE, MARKET_REFERENCE } from '../data';
import { ROUTES } from '../constants';
import { useGo } from '../navigation';

function Para({ h, children }: { h: string; children: React.ReactNode }) {
  return (
    <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)', padding: '40px 0', borderTop: '1px solid var(--line)' }}>
      <h3 style={{ margin: 0, font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>{h}</h3>
      <p className="pretty" style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text-2)', maxWidth: 720 }}>{children}</p>
    </div>
  );
}

export function CasePage() {
  const go = useGo();
  return (
    <main>
      <Container style={{ paddingTop: 64, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <Button variant="tertiary" size="sm" onClick={() => go('/#cases')} style={{ alignSelf: 'flex-start' }}>Все кейсы</Button>
        <div style={{ display: 'flex', gap: 8 }}><Tag tone="ink">Веб-игра</Tag><Tag>2026</Tag><Tag>Сеть кофеен</Tag></div>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,8fr) minmax(0,4fr)', gap: 'var(--grid-gutter)', alignItems: 'end' }}>
          <h1 style={{ margin: 0, font: 'var(--type-h1)', letterSpacing: 'var(--track-h1)' }}>Промо-игра для сети кофеен</h1>
          <p style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text-2)' }}>30-секундная браузерная механика с лидербордом и промокодами. От первого scope до production — 9 дней.</p>
        </div>
        <div className="grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 'var(--grid-gutter)', paddingTop: 24, borderTop: '1px solid var(--text)' }}>
          <Stat value={184000} suffix=" ₽" label="бюджет проекта" note="включая AI-инфраструктуру 18 320 ₽" size="lg" />
          <Stat value={9} suffix=" дней" label="до запуска" size="lg" />
          <Stat value={41200} label="игроков за первую неделю" size="lg" />
        </div>
      </Container>
      <Container style={{ paddingTop: 64 }}>
        <DemoBlock dark title="Играть прямо здесь" meta="Live · лидерборд" ratio="21/9" cta="Запустить игру">
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--contrast-ink-2)', font: 'var(--type-body-sm)' }}>здесь монтируется игра</div>
        </DemoBlock>
      </Container>
      <Container style={{ paddingTop: 96 }}>
        <Para h="Задача">Маркетинговой команде нужна была игровая механика для рекламной кампании: короткая сессия, лидерборд и промокод после прохождения. Дедлайн был привязан к старту медийного размещения.</Para>
        <Para h="Решение">Собрали игровую механику, интерфейс, серверную часть лидерборда и выдачу промокодов. Основную часть frontend-кода производили с AI coding agents, после чего команда проводила review, тестирование и оптимизацию.</Para>
        <Para h="Срок">Первая рабочая сборка появилась на третий день. В production проект вышел через девять дней после старта.</Para>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)', padding: '40px 0', borderTop: '1px solid var(--line)' }}>
          <h3 style={{ margin: 0, font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>Timeline</h3>
          <Trace active={4} steps={['Задача', 'Scope · день 1', 'Сборка · день 3', 'QA · день 8', 'Production · день 9']} />
        </div>
      </Container>
      <Container style={{ paddingTop: 96 }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)' }}>
          <h3 style={{ margin: 0, font: 'var(--type-h3)', letterSpacing: 'var(--track-h3)' }}>Сопоставимый объём работ</h3>
          <Compare ours={184000} theirs={MARKET_REFERENCE} note={COMPARE_NOTE} />
        </div>
      </Container>
      <Container style={{ paddingTop: 96, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button size="lg" onClick={() => go(ROUTES.report)}>Открыть отчёт по проекту</Button>
        <Button size="lg" variant="secondary" onClick={() => go(ROUTES.intake)}>Запустить похожий проект</Button>
      </Container>
    </main>
  );
}
