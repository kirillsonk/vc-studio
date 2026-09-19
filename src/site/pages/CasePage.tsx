'use client';

import React from 'react';
import { Button, Compare, DemoBlock, Stat, Tag, Trace } from '@/components';
import { Container } from '../Chrome';
import { COMPARE_NOTE, MARKET_REFERENCE } from '../data';
import { DeployRun } from '../game/DeployRun';
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
        <div style={{ display: 'flex', gap: 8 }}><Tag tone="ink">Демо-проект 01</Tag><Tag>Canvas</Tag><Tag>2026</Tag></div>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,8fr) minmax(0,4fr)', gap: 'var(--grid-gutter)', alignItems: 'end' }}>
          <h1 style={{ margin: 0, font: 'var(--type-h1)', letterSpacing: 'var(--track-h1)' }}>Deploy Run</h1>
          <p style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text-2)' }}>Не клиентский кейс, а рабочий пример production-процесса: тридцать секунд, canvas, лидерборд и промокод. От первого scope до production 9 дней</p>
        </div>
        <div className="grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 'var(--grid-gutter)', paddingTop: 24, borderTop: '1px solid var(--text)' }}>
          <Stat value={184000} suffix=" ₽" label="бюджет проекта" note="включая AI-инфраструктуру 18 320 ₽" size="lg" />
          <Stat value={9} suffix=" дней" label="до запуска" size="lg" />
          <Stat value={8421388} label="токенов потребовалось моделям" size="lg" />
        </div>
      </Container>
      <Container style={{ paddingTop: 64 }}>
        <DemoBlock dark title="Играть прямо здесь" meta="Canvas · лидерборд" ratio="21/9" cta="Запустить игру" loadingText="Готовим поле">
          <DeployRun />
        </DemoBlock>
      </Container>
      <Container style={{ paddingTop: 96 }}>
        <Para h="Задача">Показать production-процесс на собственном примере, а не на словах. Нужна была механика, в которую играют один раз и запоминают: короткая сессия, растущая сложность, промокод в конце. Срок задали себе сами, как в типичной рекламной кампании</Para>
        <Para h="Решение">Собрали механику на canvas, HUD на дизайн-системе сайта, лидерборд и выдачу промокодов. Основную часть кода производили с AI coding agents, после чего команда проводила review, тестирование и оптимизацию кадра</Para>
        <Para h="Срок">Первая рабочая сборка появилась на третий день. В production проект вышел через девять дней после старта</Para>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)', padding: '40px 0', borderTop: '1px solid var(--line)' }}>
          <h3 style={{ margin: 0, font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>Timeline</h3>
          <Trace active={4} steps={['Задача', 'Scope · день 1', 'Сборка · день 3', 'QA · день 8', 'Production · день 9']} />
        </div>
      </Container>
      <Container style={{ paddingTop: 96 }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)' }}>
          <h3 style={{ margin: 0, font: 'var(--type-h3)', letterSpacing: 'var(--track-h3)' }}>Сопоставимый объем работ</h3>
          <Compare ours={184000} theirs={MARKET_REFERENCE} note={COMPARE_NOTE} />
        </div>
      </Container>
      <Container style={{ paddingTop: 96, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button size="lg" onClick={() => go(ROUTES.report)}>Открыть отчет по проекту</Button>
        <Button size="lg" variant="secondary" onClick={() => go(ROUTES.intake)}>Запустить похожий проект</Button>
      </Container>
    </main>
  );
}
