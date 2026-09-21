'use client';

import React from 'react';
import {
  BriefComposer, BriefMessage, Button, CaseCard, Checkbox, Chip, Compare, Counter,
  DemoBlock, EstimatePanel, Field, Ledger, OptionBlock, Select, Stat, Tag, Textarea, TextInput, Trace,
} from '@/components';
import { Container } from '../Chrome';
import { Media } from '../Media';

function Group({ index, title, subtitle, children }: { index: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section style={{ paddingTop: 96 }}>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)', alignItems: 'start', paddingBottom: 32, borderTop: '1px solid var(--text)', paddingTop: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)' }}>{index}</span>
          <h2 style={{ margin: 0, font: 'var(--type-h3)', letterSpacing: 'var(--track-h3)' }}>{title}</h2>
        </div>
        <p style={{ margin: 0, font: 'var(--type-body-sm)', color: 'var(--text-2)', maxWidth: 480 }}>{subtitle}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>{children}</div>
    </section>
  );
}

function Row({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>{label}</span>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', ...style }}>{children}</div>
    </div>
  );
}

function FormsGroup() {
  const [choice, setChoice] = React.useState('Веб-игра');
  const [filters, setFilters] = React.useState<string[]>(['WebGL']);
  const toggle = (o: string) => setFilters(f => f.includes(o) ? f.filter(x => x !== o) : [...f, o]);
  return (
    <>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px var(--grid-gutter)' }}>
        <Field label="Email или Telegram" hint="Сюда отправим расчет"><TextInput placeholder="@username" /></Field>
        <Field label="Email" error="Проверьте адрес почты"><TextInput error defaultValue="name@company" /></Field>
        <Field label="Формат"><Select placeholder="Выберите" options={['Промо-сайт', 'Веб-игра', '3D / WebGL', 'Интерактивный спецпроект']} /></Field>
        <Field label="Недоступно"><TextInput disabled defaultValue="Только после подтверждения scope" /></Field>
        <Field label="Задача" style={{ gridColumn: '1 / -1' }}><Textarea rows={2} placeholder="Опишите проект своими словами. Можно без ТЗ" /></Field>
      </div>
      <Row label="OptionBlock — одиночный выбор" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 8 }}>
        {['Промо-сайт', 'Веб-игра', '3D / WebGL', 'Другое'].map(o => <OptionBlock key={o} selected={choice === o} onClick={() => setChoice(o)}>{o}</OptionBlock>)}
      </Row>
      <Row label="Chip — вторичный множественный выбор · Checkbox">
        {['WebGL', 'Игра', 'Анимация', 'Интеграции'].map(o => <Chip key={o} selected={filters.includes(o)} onClick={() => toggle(o)}>{o}</Chip>)}
        <span style={{ width: 16 }} />
        <Checkbox defaultChecked label="Нужна поддержка после запуска" />
        <Checkbox disabled label="Недоступно" />
      </Row>
    </>
  );
}

function NumbersGroup() {
  const [v, setV] = React.useState(1284310);
  return (
    <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 40px', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <Counter value={v} from={0} size="xl" style={{ fontSize: 64 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 16 }}>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>токенов · AI-расход сборки</span>
            <Button variant="tertiary" size="sm" onClick={() => setV(x => x + Math.round(Math.random() * 40000))}>Обновить</Button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Stat value={184000} suffix=" ₽" label="бюджет проекта" size="md" />
          <Stat value={9} suffix=" дней" label="до запуска" size="md" />
          <Stat value={128000} prefix="−" suffix=" ₽" label="разница" tone="positive" size="md" />
        </div>
        <Compare ours={180000} theirs={[450000, 650000]} note="Ориентир для сопоставимого объема работ" />
      </div>
      <Ledger
        title="Project estimate"
        rows={[
          { label: 'AI-инфраструктура', sub: 'по фактическому расходу', value: 12840 },
          { label: 'Production-команда', sub: 'фиксируем до старта', value: 94000 },
          { label: 'Поддержка 3 месяца', value: 'включено', tone: 'positive' },
        ]}
        total={106840}
        totalLabel="Итоговый бюджет"
        note="Финальная стоимость зависит от задачи и состава команды"
      />
    </div>
  );
}

function IntakeGroup() {
  const [a, setA] = React.useState<string | null>(null);
  return (
    <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 32, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <BriefMessage index={1}>Что нужно сделать?</BriefMessage>
        <BriefMessage role="user">Промо-сайт с игровой механикой для кампании</BriefMessage>
        <BriefMessage index={2}>Когда проект должен быть в проде?</BriefMessage>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingLeft: 56 }}>
          {['До 7 дней', '1–2 недели', '3–4 недели', 'Срок гибкий'].map(o => <OptionBlock key={o} selected={a === o} onClick={() => setA(o)}>{o}</OptionBlock>)}
        </div>
        <BriefComposer style={{ marginLeft: 56 }} />
      </div>
      <EstimatePanel
        scope={a ? ['Промо-сайт', 'Мини-игра', 'Адаптив'] : ['Промо-сайт', 'Мини-игра']}
        term={a ? '8–12 рабочих дней' : undefined}
        status="building"
      />
    </div>
  );
}

function DemoLiveTokens() {
  const [n, setN] = React.useState(0);
  React.useEffect(() => { const t = setInterval(() => setN(x => x + Math.round(Math.random() * 900)), 700); return () => clearInterval(t); }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Counter value={n} size="lg" />
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-3)', marginTop: 10 }}>токенов за сессию</div>
      </div>
    </div>
  );
}

export function KitPage() {
  return (
    <main id="main">
      <Container style={{ paddingTop: 64, paddingBottom: 96 }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)', letterSpacing: '.04em' }}>DESIGN SYSTEM · 19 КОМПОНЕНТОВ</span>
            <h1 style={{ margin: 0, font: 'var(--type-h1)', letterSpacing: 'var(--track-h1)' }}>Библиотека компонентов</h1>
          </div>
          <p className="pretty" style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text-2)' }}>Шесть групп примитивов, из которых собраны все экраны сайта. Правила использования — в BRAND.md</p>
        </div>

        <Group index="01" title="Кнопки" subtitle="Primary — заливка вермильоном. Secondary — 1 px граница. Tertiary — текст с базовой линией, которая рисуется на hover">
          <Row label="primary · secondary · tertiary">
            <Button>Запустить проект</Button>
            <Button variant="secondary">Смотреть кейсы</Button>
            <Button variant="tertiary">Открыть отчет</Button>
          </Row>
          <Row label="размеры · loading">
            <Button size="sm">Открыть кейс</Button>
            <Button size="lg">Рассчитать проект</Button>
            <Button loading>Отправляем</Button>
          </Row>
          <Row label="disabled">
            <Button disabled>Недоступно</Button>
            <Button variant="secondary" disabled>Недоступно</Button>
            <Button variant="tertiary" disabled>Недоступно</Button>
          </Row>
        </Group>

        <Group index="02" title="Формы" subtitle="Поля 56 px, белые, 1 px линия. Фокус — вермильоновая граница и мягкое кольцо. Выбор — прямоугольные блоки, не таблетки">
          <FormsGroup />
        </Group>

        <Group index="03" title="Числа" subtitle="Табличные цифры во всех состояниях. Ledger — язык сметы, а не SaaS-тарифов. Compare — две полосы вместо перечеркнутых цен">
          <NumbersGroup />
        </Group>

        <Group index="04" title="Контент" subtitle="Визуал кейса сам является карточкой, текст лежит на canvas. Trace — фирменный мотив прохождения проекта через production">
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--grid-gutter)' }}>
            <CaseCard kind="Веб-игра" year="2026" client="Сеть кофеен" title="Промо-игра с лидербордом и промокодами" days={9} budget={184000} media={<Media c="var(--vermilion)" t="Coffee Run" />} />
            <CaseCard kind="3D / WebGL" year="2026" client="Застройщик" title="Квартал в браузере" days={14} budget={412000} media={<Media c="var(--ink)" t="Quarter" />} />
          </div>
          <Row label="Tag"><Tag>WebGL</Tag><Tag tone="brand">Веб-игра</Tag><Tag tone="ink">Демо</Tag></Row>
          <Row label="Trace" style={{ display: 'block' }}><Trace active={2} /></Row>
        </Group>

        <Group index="05" title="Демо" subtitle="Poster → loading → live. Темная поверхность допустима не более чем для одного демо на страницу">
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--grid-gutter)' }}>
            <DemoBlock title="Живой счетчик" meta="Live"><DemoLiveTokens /></DemoBlock>
            <DemoBlock dark title="3D-конфигуратор" meta="WebGL · 60 FPS" autoload>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--contrast-ink-2)', font: 'var(--type-body-sm)' }}>здесь монтируется canvas</div>
            </DemoBlock>
          </div>
        </Group>

        <Group index="06" title="Заявка" subtitle="Не чат-бот: у AI обычный абзац с индексом, у пользователя — текст с левой линейкой. Справа оценка достраивается по мере ответов">
          <IntakeGroup />
        </Group>
      </Container>
    </main>
  );
}
