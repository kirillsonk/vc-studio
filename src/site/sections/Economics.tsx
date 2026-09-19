import React from 'react';
import { Compare } from '@/components';
import { Head, Section } from '../Chrome';
import { COMPARE_NOTE, MARKET_REFERENCE } from '../data';

/** Three parts of the price, one per row: what it is, how it is charged, what it covers */
const PARTS: Array<[title: string, rule: string, detail: string]> = [
  ['AI-инфраструктура', 'По фактическому расходу', 'Модели, генерация, агентские сессии и другие AI-расходы проекта'],
  ['Production-команда', 'Фиксируем до старта', 'Архитектура, управление, инженерный контроль, QA, интеграции, деплой и выпуск'],
  ['Поддержка', '3 месяца включены', 'Исправляем ошибки и сопровождаем запущенный проект. Дальше от 5 000 ₽ в месяц'],
];

export function Economics() {
  return (
    <Section id="economics" pad={160}>
      <Head index="04" title="Разработка без черного ящика" lead="Стоимость складывается из двух частей: фактического расхода AI-инструментов и работы production-команды. До старта фиксируем scope и стоимость нашей работы. После запуска показываем реальный расход моделей" />
      <div style={{ borderTop: '1px solid var(--text)' }}>
        {PARTS.map(([title, rule, detail]) => (
          <div key={title} className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,3fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', padding: '24px 0', borderBottom: '1px solid var(--line)', alignItems: 'baseline' }}>
            <span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>{title}</span>
            <span style={{ font: 'var(--type-body)', color: 'var(--text)' }}>{rule}</span>
            <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>{detail}</span>
          </div>
        ))}
      </div>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)', gap: 'var(--grid-gutter)', alignItems: 'start', paddingTop: 96 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ margin: 0, font: 'var(--type-h3)', letterSpacing: 'var(--track-h3)' }}>Один и тот же scope. Разный объем ручной разработки</h3>
          <p style={{ margin: 0, font: 'var(--type-body-sm)', color: 'var(--text-2)', maxWidth: 400 }}>AI сократил стоимость механической разработки. Мы перестроили под это production и ценообразование</p>
        </div>
        <Compare ours={180000} theirs={MARKET_REFERENCE} ourLabel="AI-native production" theirLabel="Классическая production-модель" note={COMPARE_NOTE} />
      </div>
    </Section>
  );
}
