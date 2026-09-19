import React from 'react';
import { Trace } from '@/components';
import { Head, Section } from '../Chrome';

const STEPS: Array<[stage: string, headline: string, detail: string]> = [
  ['Задача', 'Можно прийти без ТЗ', 'Разбираем задачу, аудиторию, механику, ограничения и срок'],
  ['Scope', 'Собираем решение до начала разработки', 'Определяем сценарии, дизайн, интеграции и критерии готовности'],
  ['Production', 'AI генерирует. Инженер управляет', 'Работаем с coding agents, проверяем архитектуру, код и промежуточные сборки'],
  ['QA и запуск', 'В прод попадает не первый ответ модели', 'Тестируем адаптивность, сценарии, производительность, интеграции и ошибки'],
  ['Отчет', 'После запуска открываем экономику проекта', 'Показываем AI-расход, работу команды и итоговую стоимость'],
];

export function Process() {
  return (
    <Section id="process" pad={160} border>
      <div style={{ paddingTop: 48 }}>
        <Head index="05" title="AI внутри. Ответственность снаружи" lead="Для клиента процесс почти не отличается от работы с сильной студией. Отличается то, что происходит внутри production" />
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 120 }}>
            <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text)', maxWidth: 360 }}>В классической разработке программист пишет большую часть кода вручную. У нас инженер ставит задачу AI-агенту, задает контекст и ограничения, проверяет решение, тестирует и доводит его до production</p>
            <p style={{ margin: 0, font: 'var(--type-body-sm)', color: 'var(--text-2)', maxWidth: 360 }}>Тот же объем работы — значительно быстрее</p>
          </div>
          <Trace
            vertical
            active={4}
            steps={STEPS.map(([t, h, d]) => (
              <div key={t} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)', gap: 'var(--grid-gutter)', alignItems: 'baseline' }}>
                <span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>{t}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ font: 'var(--type-body)', color: 'var(--text)' }}>{h}</span>
                  <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>{d}</span>
                </span>
              </div>
            ))}
          />
        </div>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)', paddingTop: 96, borderTop: '1px solid var(--line)', marginTop: 32 }}>
          <h3 style={{ margin: 0, font: 'var(--type-h3)', letterSpacing: 'var(--track-h3)' }}>Не продаем человеко-часы кода</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
            <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text)' }}>Цена нашей работы — это управление проектом и инженерная ответственность. Мы превращаем задачу в работающий продукт: определяем решение, управляем AI, проверяем код, собираем интеграции, тестируем, деплоим и доводим до запуска</p>
            <p style={{ margin: 0, font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>AI сокращает объем ручной работы. Ответственность за результат остается у нас</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
