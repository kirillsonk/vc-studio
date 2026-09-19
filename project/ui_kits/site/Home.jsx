const { Button, Counter, Stat, Ledger, Compare, CaseCard, DemoBlock, Trace, Tag } = window.VCStudioDesignSystem_40ecfd;

const Media = ({ c, t, fg = 'rgba(255,255,255,.55)' }) => <div style={{ width: '100%', height: '100%', background: c, display: 'grid', placeItems: 'center' }}><span style={{ font: '500 clamp(28px,4vw,56px)/1 var(--font-sans)', letterSpacing: '-.04em', color: fg }}>{t}</span></div>;

function LiveTokens() {
  const [n, setN] = React.useState(0);
  React.useEffect(() => { const t = setInterval(() => setN(x => x + Math.round(Math.random() * 900)), 600); return () => clearInterval(t); }, []);
  return <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}><div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}><Counter value={n} size="xl" tone="inverse" /><span style={{ font: 'var(--type-body-sm)', color: 'var(--contrast-ink-2)' }}>токенов сгенерировано за эту сессию</span></div></div>;
}

function Demos() {
  return (
    <Section id="demos" pad={160}>
      <Head index="01" title="Не рассказываем, что умеем. Показываем." lead="Веб-игры, 3D, интерактивные механики и анимация работают прямо здесь. Это тот же технологический уровень, который мы собираем для клиентских проектов." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        <DemoBlock dark title="3D-конфигуратор упаковки" meta="WebGL · 60 FPS" ratio="21/9" cta="Запустить демо" poster={<div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--contrast-ink-2)', font: 'var(--type-body-sm)' }} />}>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}><div style={{ width: 'min(36vw,320px)', aspectRatio: '1', border: '1.5px solid var(--brand)', borderRadius: 'var(--radius-lg)', animation: 'vc-turn 6s var(--ease-in-out) infinite alternate', display: 'grid', placeItems: 'center' }}><span style={{ color: 'var(--contrast-ink-2)', font: 'var(--type-caption)' }}>здесь монтируется сцена</span></div><style>{`@keyframes vc-turn{from{transform:perspective(900px) rotateY(-24deg) rotateX(8deg)}to{transform:perspective(900px) rotateY(24deg) rotateX(-8deg)}}`}</style></div>
        </DemoBlock>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
          <DemoBlock title="Браузерная мини-игра" meta="Canvas · лидерборд" ratio="16/10" cta="Запустить игру"><div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--text-3)', font: 'var(--type-body-sm)' }}>здесь монтируется игра</div></DemoBlock>
          <DemoBlock title="Live-счётчик генерации" meta="Live" ratio="4/5" autoload dark><LiveTokens /></DemoBlock>
        </div>
      </div>
    </Section>
  );
}

function Cases({ go }) {
  return (
    <Section id="cases" pad={160}>
      <Head index="02" title="Кейсы с открытой экономикой" lead="Показываем не только результат, но и срок, итоговый бюджет и фактический AI-расход." />
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: '64px var(--grid-gutter)', alignItems: 'start' }}>
        <CaseCard size="lg" ratio="16/10" onClick={() => go('case')} kind="Веб-игра" year="2026" client="Сеть кофеен" title="Промо-игра с лидербордом и промокодами" days={9} budget={184000} media={<Media c="var(--vermilion)" t="Coffee Run" />} />
        <CaseCard onClick={() => go('case')} kind="3D / WebGL" year="2026" client="Застройщик" title="Квартал в браузере" days={14} budget={412000} media={<Media c="var(--ink)" t="Quarter" />} />
        <CaseCard onClick={() => go('case')} kind="Промо-сайт" year="2026" client="Банк" title="Запуск карты со scroll-механикой" days={6} budget={126500} media={<Media c="var(--surface-2)" t="Launch" fg="var(--text-3)" />} />
        <CaseCard ratio="16/10" size="lg" onClick={() => go('case')} kind="Спецпроект" year="2026" client="FMCG" title="Интерактивный storytelling к сезонной кампании" days={12} budget={238000} media={<Media c="var(--brand-soft)" t="Season" fg="var(--brand)" />} />
      </div>
    </Section>
  );
}

function WhatWeDo() {
  const items = [['Промо-сайты', 'Кампании, запуски, продуктовые страницы с интерактивом и анимацией.'], ['Веб-игры', 'Короткие браузерные механики с лидербордами, промокодами и аналитикой.'], ['3D / WebGL', 'Конфигураторы, сцены и визуализации, которые работают без установки.'], ['Спецпроекты', 'Нестандартная механика под конкретную рекламную идею.'], ['Production для агентств', 'Frontend, backend, интеграции и запуск по готовому дизайну.']];
  return (
    <Section id="what" pad={160} border>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)', gap: 'var(--grid-gutter)', paddingTop: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}><span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)' }}>03</span><h2 style={{ margin: 0, font: 'var(--type-h2)', letterSpacing: 'var(--track-h2)' }}>Что делаем</h2><p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-2)', maxWidth: 400 }}>Бюджеты от 100 000 ₽. Верхней границы нет: тот же production собирает проекты, за которые классическая студия берёт несколько миллионов.</p></div>
        <div>{items.map(([t, d], i) => <div key={t} style={{ display: 'grid', gridTemplateColumns: '48px minmax(0,1fr) minmax(0,1.4fr)', gap: 'var(--grid-gutter)', padding: '24px 0', borderBottom: '1px solid var(--line)', alignItems: 'baseline' }}><span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)' }}>{String(i + 1).padStart(2, '0')}</span><span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>{t}</span><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>{d}</span></div>)}</div>
      </div>
    </Section>
  );
}

function Economics() {
  return (
    <Section id="economics" pad={160}>
      <Head index="04" title="Разработка без чёрного ящика" lead="Стоимость проекта состоит из двух частей: фактического расхода AI-инструментов и работы production-команды. До старта фиксируем scope и стоимость нашей работы. После запуска показываем реальный расход моделей." />
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
        <div className="grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 'var(--grid-gutter)' }}>
          {[['AI-инфраструктура', 'По фактическому расходу', 'Модели, генерация, агентские сессии и другие AI-расходы проекта.'], ['Production-команда', 'Фиксируем до старта', 'Архитектура, управление, инженерный контроль, QA, интеграции, деплой и выпуск.'], ['Поддержка', '3 месяца включены', 'Исправляем ошибки и сопровождаем запущенный проект. Дальше — от 5 000 ₽ / мес.']].map(([h, v, d]) => (
            <div key={h} style={{ borderTop: '1px solid var(--text)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}><span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>{h}</span><span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>{v}</span><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>{d}</span></div>))}
        </div>
        <Ledger title="Project estimate · demo" rows={[{ label: 'AI-инфраструктура', sub: 'по фактическому расходу', value: 12840 }, { label: 'Production-команда', sub: 'зафиксировано до старта', value: 94000 }, { label: 'Поддержка 3 месяца', value: 'включено', tone: 'positive' }]} total={106840} totalLabel="Итоговый бюджет" note="Демонстрационный расчёт. Финальная стоимость зависит от задачи и состава команды." />
      </div>
      <div style={{ paddingTop: 96 }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}><h3 style={{ margin: 0, font: 'var(--type-h3)', letterSpacing: 'var(--track-h3)' }}>Один и тот же scope. Разный объём ручной разработки.</h3><p style={{ margin: 0, font: 'var(--type-body-sm)', color: 'var(--text-2)', maxWidth: 400 }}>AI сократил стоимость механической разработки. Мы перестроили под это production и ценообразование.</p></div>
          <Compare ours={180000} theirs={[450000, 650000]} ourLabel="AI-native production" theirLabel="Классическая production-модель" note="Ориентир для сопоставимого объёма работ. Финальная стоимость зависит от задачи и состава команды." />
        </div>
      </div>
    </Section>
  );
}

function Process() {
  const steps = [['Задача', 'Можно прийти без ТЗ.', 'Разбираем задачу, аудиторию, механику, ограничения и срок.'], ['Scope', 'Собираем решение до начала разработки.', 'Определяем сценарии, дизайн, интеграции и критерии готовности.'], ['Production', 'AI генерирует. Инженер управляет.', 'Работаем с coding agents, проверяем архитектуру, код и промежуточные сборки.'], ['QA и запуск', 'В прод попадает не первый ответ модели.', 'Тестируем адаптивность, сценарии, производительность, интеграции и ошибки.'], ['Отчёт', 'После запуска открываем экономику проекта.', 'Показываем AI-расход, работу команды и итоговую стоимость.']];
  return (
    <Section id="process" pad={160} border>
      <div style={{ paddingTop: 48 }}>
        <Head index="05" title="AI внутри. Ответственность снаружи." lead="Для клиента процесс почти не отличается от работы с сильной студией. Отличается то, что происходит внутри production." />
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 120 }}>
            <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text)', maxWidth: 360 }}>В классической разработке программист пишет большую часть кода вручную. У нас инженер ставит задачу AI-агенту, задаёт контекст и ограничения, проверяет решение, тестирует и доводит его до production.</p>
            <p style={{ margin: 0, font: 'var(--type-body-sm)', color: 'var(--text-2)', maxWidth: 360 }}>Тот же объём работы — значительно быстрее.</p>
          </div>
          <Trace vertical active={4} steps={steps.map(([t, h, d], i) => <div key={t} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)', gap: 'var(--grid-gutter)', alignItems: 'baseline' }}><span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>{t}</span><span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ font: 'var(--type-body)', color: 'var(--text)' }}>{h}</span><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>{d}</span></span></div>)} />
        </div>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)', paddingTop: 96, borderTop: '1px solid var(--line)', marginTop: 32 }}>
          <h3 style={{ margin: 0, font: 'var(--type-h3)', letterSpacing: 'var(--track-h3)' }}>Не продаём человеко-часы кода</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}><p style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text)' }}>Цена нашей работы — это управление проектом и инженерная ответственность. Мы превращаем задачу в работающий продукт: определяем решение, управляем AI, проверяем код, собираем интеграции, тестируем, деплоим и доводим до запуска.</p><p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-2)' }}>AI сокращает объём ручной работы. Ответственность за результат остаётся у нас.</p></div>
        </div>
      </div>
    </Section>
  );
}

function Agencies({ go }) {
  return (
    <Section id="agencies" pad={160}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: 'clamp(28px,4vw,56px)' }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,6fr) minmax(0,6fr)', gap: 'var(--grid-gutter)', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}><span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)' }}>06</span><h2 style={{ margin: 0, font: 'var(--type-h2)', letterSpacing: 'var(--track-h2)' }}>Production-партнёр для агентств</h2></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}><p style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text-2)' }}>Подключаемся к кампании на этапе идеи, дизайна или готового макета. Берём на себя frontend, backend, WebGL, игровые механики, интеграции, QA и запуск.</p><p style={{ margin: 0, font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>Подходит для проектов, где дедлайн уже есть, а production-команды ещё нет.</p><div><Button onClick={() => go('home', 'intake')}>Передать проект в production</Button></div></div>
        </div>
      </div>
    </Section>
  );
}

function FAQ() {
  const qa = [['Это обычный сайт, сгенерированный нейросетью?', 'Нет. AI участвует в production так же, как IDE, библиотеки и облачная инфраструктура. Архитектуру, сценарии, дизайн, интеграции, проверку и запуск контролирует команда. В production не попадает код только потому, что его сгенерировала модель.'], ['Почему тогда дешевле?', 'Потому что AI сокращает количество ручной работы. Задачи, которые раньше занимали у разработчика часы или дни, coding agent может выполнить значительно быстрее. Мы не закладываем эти человеко-часы в смету только потому, что так исторически устроен рынок.'], ['Кто отвечает, если AI ошибётся?', 'Мы. Клиент работает со студией, а не с моделью. Проверка кода, тестирование, интеграции и запуск находятся на нашей стороне.'], ['Код останется у нас?', 'Да. После запуска проект, исходный код и необходимая документация передаются клиенту согласно договору.'], ['Можно передать вам дизайн от другого агентства?', 'Да. Можем подключиться только как production-партнёр: взять готовый дизайн и собрать frontend, backend, интерактив или 3D.']];
  const [open, setOpen] = React.useState(0);
  return (
    <Section id="faq" pad={160}>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}><span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)' }}>07</span><h2 style={{ margin: 0, font: 'var(--type-h2)', letterSpacing: 'var(--track-h2)' }}>Вопросы</h2></div>
        <div style={{ borderTop: '1px solid var(--text)' }}>{qa.map(([q, a], i) => { const on = open === i; return (
          <div key={q} style={{ borderBottom: '1px solid var(--line)' }}>
            <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)} style={{ width: '100%', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 24px', gap: 24, alignItems: 'center', padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)', color: on ? 'var(--brand)' : 'var(--text)', fontFamily: 'var(--font-sans)', transition: 'color var(--dur-micro)' }}>{q}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: on ? 'rotate(45deg)' : 'none', transition: 'transform var(--dur-ui) var(--ease)' }}><path d="M12 5v14M5 12h14" /></svg></button>
            <div style={{ display: 'grid', gridTemplateRows: on ? '1fr' : '0fr', transition: 'grid-template-rows var(--dur-ui) var(--ease)' }}><div style={{ overflow: 'hidden' }}><p style={{ margin: 0, padding: '0 48px 28px 0', font: 'var(--type-body)', color: 'var(--text-2)', maxWidth: 680 }}>{a}</p></div></div>
          </div>); })}</div>
      </div>
    </Section>
  );
}

Object.assign(window, { Demos, Cases, WhatWeDo, Economics, Process, Agencies, FAQ, Media });
