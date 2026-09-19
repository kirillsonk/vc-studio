'use client';

import React from 'react';
import { Section } from '../Chrome';

const QA: Array<[question: string, answer: string]> = [
  ['Это обычный сайт, сгенерированный нейросетью?', 'Нет. AI участвует в production так же, как IDE, библиотеки и облачная инфраструктура. Архитектуру, сценарии, дизайн, интеграции, проверку и запуск контролирует команда. В production не попадает код только потому, что его сгенерировала модель'],
  ['Почему тогда дешевле?', 'Потому что AI сокращает количество ручной работы. Задачи, которые раньше занимали у разработчика часы или дни, coding agent может выполнить значительно быстрее. Мы не закладываем эти человеко-часы в смету только потому, что так исторически устроен рынок'],
  ['Кто отвечает, если AI ошибется?', 'Мы. Клиент работает со студией, а не с моделью. Проверка кода, тестирование, интеграции и запуск находятся на нашей стороне'],
  ['Код останется у нас?', 'Да. После запуска проект, исходный код и необходимая документация передаются клиенту согласно договору'],
  ['Можно передать вам дизайн от другого агентства?', 'Да. Можем подключиться только как production-партнер: взять готовый дизайн и собрать frontend, backend, интерактив или 3D'],
];

export function FAQ() {
  const [open, setOpen] = React.useState(0);
  return (
    <Section id="faq" pad={160}>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)' }}>07</span>
          <h2 style={{ margin: 0, font: 'var(--type-h2)', letterSpacing: 'var(--track-h2)' }}>Вопросы</h2>
        </div>
        <div style={{ borderTop: '1px solid var(--text)' }}>
          {QA.map(([q, a], i) => {
            const on = open === i;
            return (
              <div key={q} style={{ borderBottom: '1px solid var(--line)' }}>
                <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)} style={{ width: '100%', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 24px', gap: 24, alignItems: 'center', padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)', color: on ? 'var(--brand)' : 'var(--text)', fontFamily: 'var(--font-sans)', transition: 'color var(--dur-micro)' }}>
                  {q}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: on ? 'rotate(45deg)' : 'none', transition: 'transform var(--dur-ui) var(--ease)' }}><path d="M12 5v14M5 12h14" /></svg>
                </button>
                <div style={{ display: 'grid', gridTemplateRows: on ? '1fr' : '0fr', transition: 'grid-template-rows var(--dur-ui) var(--ease)' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ margin: 0, padding: '0 48px 28px 0', font: 'var(--type-body)', color: 'var(--text-2)', maxWidth: 680 }}>{a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
