'use client';

import React from 'react';
import { BriefComposer, BriefMessage, Button, EstimatePanel, Field, OptionBlock, TextInput } from '@/components';
import { Head, Section } from '../Chrome';

interface Step {
  q: string;
  opts: string[];
  scope?: (a: string) => string[];
  term?: (a: string) => string;
  budget?: (a: string) => string;
}

const SCRIPT: Step[] = [
  {
    q: 'Что нужно сделать?',
    opts: ['Промо-сайт', 'Веб-игра', '3D / WebGL', 'Интерактивный спецпроект', 'Другое'],
    scope: a => a === 'Другое' ? ['Спецпроект'] : [a],
  },
  {
    q: 'Что проект должен сделать для бизнеса?',
    opts: ['Поддержать рекламную кампанию', 'Вовлечь аудиторию', 'Собрать лиды', 'Запустить продукт', 'Пока формулируем'],
    scope: a => a === 'Собрать лиды' ? ['Форма и CRM'] : a === 'Вовлечь аудиторию' ? ['Игровая механика', 'Лидерборд'] : ['Аналитика'],
  },
  {
    q: 'Когда проект должен быть в проде?',
    opts: ['До 7 дней', '1–2 недели', '3–4 недели', 'Срок гибкий'],
    term: a => ({ 'До 7 дней': '5–7 рабочих дней', '1–2 недели': '8–12 рабочих дней', '3–4 недели': '15–20 рабочих дней', 'Срок гибкий': '10–15 рабочих дней' } as Record<string, string>)[a] || '8–12 рабочих дней',
    scope: () => ['Адаптив', 'Деплой'],
  },
  {
    q: 'Есть ориентир по бюджету?',
    opts: ['100–200 тыс.', '200–350 тыс.', '350–500 тыс.', 'Нужна оценка'],
    budget: a => ({ '100–200 тыс.': '120 000–190 000 ₽', '200–350 тыс.': '210 000–330 000 ₽', '350–500 тыс.': '360 000–480 000 ₽' } as Record<string, string>)[a] || '160 000–210 000 ₽',
  },
];

interface Line { r: 'ai' | 'user'; t: string; i?: number; intro?: boolean }

interface Estimate { scope: string[]; term?: string; budget?: string; status: 'empty' | 'thinking' | 'building' | 'ready' }

export function Intake() {
  const [log, setLog] = React.useState<Line[]>([
    { r: 'ai', t: 'Расскажите, что хотите запустить. Можно без ТЗ. Я уточню несколько вещей и соберу предварительный scope, срок и вилку бюджета.', intro: true },
    { r: 'ai', t: SCRIPT[0].q, i: 1 },
  ]);
  const [step, setStep] = React.useState(0);
  const [pending, setPending] = React.useState(false);
  const [est, setEst] = React.useState<Estimate>({ scope: [], term: undefined, budget: undefined, status: 'empty' });
  const [contact, setContact] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [err, setErr] = React.useState('');
  const contactRef = React.useRef<HTMLInputElement>(null);
  const done = step >= SCRIPT.length;

  const answer = (a: string) => {
    if (pending || done) return;
    const s = SCRIPT[step];
    setLog(l => [...l, { r: 'user', t: a }]);
    setPending(true);
    setEst(e => ({ ...e, status: 'thinking' }));
    setTimeout(() => {
      setEst(e => ({
        scope: [...new Set([...e.scope, ...(s.scope ? s.scope(a) : [])])],
        term: s.term ? s.term(a) : e.term,
        budget: s.budget ? s.budget(a) : e.budget,
        status: step + 1 >= SCRIPT.length ? 'ready' : 'building',
      }));
      const n = step + 1;
      setStep(n);
      setPending(false);
      setLog(l => [...l, n < SCRIPT.length ? { r: 'ai', t: SCRIPT[n].q, i: n + 1 } : { r: 'ai', t: 'Куда отправить расчёт и продолжить обсуждение?', i: n + 1 }]);
    }, 800);
  };

  const send = () => {
    const ok = /^@?[\w]{4,}$/.test(contact) || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact);
    if (!ok) { setErr(contact.startsWith('@') ? 'Нужен username в формате @username' : 'Проверьте адрес почты'); return; }
    setErr('');
    setSent(true);
  };

  return (
    <Section id="intake" pad={160} border>
      <div style={{ paddingTop: 48 }}>
        <Head index="08" title="Есть задача — посчитаем production" lead="Опишите проект своими словами. Без технического брифа. За несколько вопросов соберём предварительный scope, срок и бюджет." />
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, borderTop: '1px solid var(--text)', paddingTop: 24 }}>
            <span style={{ font: 'var(--type-index)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Project brief</span>
            {log.map((m, k) => <BriefMessage key={k} role={m.r} index={m.i} style={m.intro ? { paddingBottom: 8 } : undefined}>{m.t}</BriefMessage>)}
            {pending && <BriefMessage pending />}
            {!pending && !done && (
              <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingLeft: 56 }}>
                {SCRIPT[step].opts.map(o => <OptionBlock key={o} onClick={() => answer(o)}>{o}</OptionBlock>)}
              </div>
            )}
            {!done ? (
              <BriefComposer placeholder="Или напишите своими словами" onSend={answer} disabled={pending} style={{ marginLeft: 56 }} />
            ) : !sent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 56 }}>
                <Field error={err}>
                  <TextInput ref={contactRef} placeholder="Email или Telegram" value={contact} onChange={e => setContact(e.target.value)} error={!!err} onKeyDown={e => e.key === 'Enter' && send()} />
                </Field>
                <div><Button onClick={send}>Получить точную оценку</Button></div>
              </div>
            ) : (
              <BriefMessage index={6}>Расчёт отправлен на {contact}. Инженер проверит scope и подтвердит стоимость перед стартом.</BriefMessage>
            )}
          </div>
          <EstimatePanel scope={est.scope} term={est.term} budget={est.budget} status={est.status} onConfirm={() => contactRef.current?.focus()} style={{ position: 'sticky', top: 104 }} />
        </div>
      </div>
    </Section>
  );
}
