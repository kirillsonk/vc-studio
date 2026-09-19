import React from 'react';
import { Compare, Ledger } from '@/components';
import { Head, Section } from '../Chrome';
import { COMPARE_NOTE, MARKET_REFERENCE } from '../data';

const PARTS: Array<[head: string, value: string, detail: string]> = [
  ['AI-инфраструктура', 'По фактическому расходу', 'Модели, генерация, агентские сессии и другие AI-расходы проекта.'],
  ['Production-команда', 'Фиксируем до старта', 'Архитектура, управление, инженерный контроль, QA, интеграции, деплой и выпуск.'],
  ['Поддержка', '3 месяца включены', 'Исправляем ошибки и сопровождаем запущенный проект. Дальше — от 5 000 ₽ / мес.'],
];

export function Economics() {
  return (
    <Section id="economics" pad={160}>
      <Head index="04" title="Разработка без чёрного ящика" lead="Стоимость проекта состоит из двух частей: фактического расхода AI-инструментов и работы production-команды. До старта фиксируем scope и стоимость нашей работы. После запуска показываем реальный расход моделей." />
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
        <div className="grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 'var(--grid-gutter)' }}>
          {PARTS.map(([h, v, d]) => (
            <div key={h} style={{ borderTop: '1px solid var(--text)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>{h}</span>
              <span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>{v}</span>
              <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>{d}</span>
            </div>
          ))}
        </div>
        <Ledger
          title="Project estimate · demo"
          rows={[
            { label: 'AI-инфраструктура', sub: 'по фактическому расходу', value: 12840 },
            { label: 'Production-команда', sub: 'зафиксировано до старта', value: 94000 },
            { label: 'Поддержка 3 месяца', value: 'включено', tone: 'positive' },
          ]}
          total={106840}
          totalLabel="Итоговый бюджет"
          note="Демонстрационный расчёт. Финальная стоимость зависит от задачи и состава команды."
        />
      </div>
      <div style={{ paddingTop: 96 }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ margin: 0, font: 'var(--type-h3)', letterSpacing: 'var(--track-h3)' }}>Один и тот же scope. Разный объём ручной разработки.</h3>
            <p style={{ margin: 0, font: 'var(--type-body-sm)', color: 'var(--text-2)', maxWidth: 400 }}>AI сократил стоимость механической разработки. Мы перестроили под это production и ценообразование.</p>
          </div>
          <Compare ours={180000} theirs={MARKET_REFERENCE} ourLabel="AI-native production" theirLabel="Классическая production-модель" note={COMPARE_NOTE} />
        </div>
      </div>
    </Section>
  );
}
