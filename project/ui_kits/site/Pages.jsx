const { Button, Counter, Stat, Ledger, Compare, DemoBlock, Trace, Tag } = window.VCStudioDesignSystem_40ecfd;

function CasePage({ go }) {
  const Para = ({ h, children }) => <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)', padding: '40px 0', borderTop: '1px solid var(--line)' }}><h3 style={{ margin: 0, font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>{h}</h3><p style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text-2)', maxWidth: 720, textWrap: 'pretty' }}>{children}</p></div>;
  return (
    <main>
      <Container style={{ paddingTop: 64, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <Button variant="tertiary" size="sm" onClick={() => go('home', 'cases')} style={{ alignSelf: 'flex-start' }}>Все кейсы</Button>
        <div style={{ display: 'flex', gap: 8 }}><Tag tone="ink">Веб-игра</Tag><Tag>2026</Tag><Tag>Сеть кофеен</Tag></div>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,8fr) minmax(0,4fr)', gap: 'var(--grid-gutter)', alignItems: 'end' }}>
          <h1 style={{ margin: 0, font: 'var(--type-h1)', letterSpacing: 'var(--track-h1)', textWrap: 'balance' }}>Промо-игра для сети кофеен</h1>
          <p style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text-2)' }}>30-секундная браузерная механика с лидербордом и промокодами. От первого scope до production — 9 дней.</p>
        </div>
        <div className="grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 'var(--grid-gutter)', paddingTop: 24, borderTop: '1px solid var(--text)' }}>
          <Stat value={184000} suffix=" ₽" label="бюджет проекта" note="включая AI-инфраструктуру 18 320 ₽" size="lg" />
          <Stat value={9} suffix=" дней" label="до запуска" size="lg" />
          <Stat value={41200} label="игроков за первую неделю" size="lg" />
        </div>
      </Container>
      <Container style={{ paddingTop: 64 }}>
        <DemoBlock dark title="Играть прямо здесь" meta="Live · лидерборд" ratio="21/9" cta="Запустить игру"><div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--contrast-ink-2)', font: 'var(--type-body-sm)' }}>здесь монтируется игра</div></DemoBlock>
      </Container>
      <Container style={{ paddingTop: 96 }}>
        <Para h="Задача">Маркетинговой команде нужна была игровая механика для рекламной кампании: короткая сессия, лидерборд и промокод после прохождения. Дедлайн был привязан к старту медийного размещения.</Para>
        <Para h="Решение">Собрали игровую механику, интерфейс, серверную часть лидерборда и выдачу промокодов. Основную часть frontend-кода производили с AI coding agents, после чего команда проводила review, тестирование и оптимизацию.</Para>
        <Para h="Срок">Первая рабочая сборка появилась на третий день. В production проект вышел через девять дней после старта.</Para>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)', padding: '40px 0', borderTop: '1px solid var(--line)' }}><h3 style={{ margin: 0, font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>Timeline</h3><Trace active={4} steps={['Задача', 'Scope · день 1', 'Сборка · день 3', 'QA · день 8', 'Production · день 9']} /></div>
      </Container>
      <Container style={{ paddingTop: 96 }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)', gap: 'var(--grid-gutter)' }}>
          <h3 style={{ margin: 0, font: 'var(--type-h3)', letterSpacing: 'var(--track-h3)' }}>Сопоставимый объём работ</h3>
          <Compare ours={184000} theirs={[450000, 650000]} note="Ориентир для сопоставимого объёма работ. Финальная стоимость зависит от задачи и состава команды." />
        </div>
      </Container>
      <Container style={{ paddingTop: 96, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button size="lg" onClick={() => go('report')}>Открыть отчёт по проекту</Button><Button size="lg" variant="secondary" onClick={() => go('home', 'intake')}>Запустить похожий проект</Button>
      </Container>
    </main>
  );
}

function ReportPage({ go }) {
  const stages = [['Прототип механики', 3210, 24000], ['Графика и анимация', 5480, 52000], ['Лидерборд и промокоды', 4690, 48000], ['QA, правки, запуск', 4940, 42000]];
  const ai = stages.reduce((a, r) => a + r[1], 0), team = stages.reduce((a, r) => a + r[2], 0);
  const [detail, setDetail] = React.useState(false);
  const cell = { padding: '16px 0', borderBottom: '1px solid var(--line)', font: 'var(--type-body)', textAlign: 'left' };
  const num = { ...cell, textAlign: 'right', fontFeatureSettings: 'var(--num-features)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
  const th = { ...cell, padding: '0 0 12px', font: 'var(--type-caption)', color: 'var(--text-3)', borderBottom: '1px solid var(--text)' };
  return (
    <main>
      <Container style={{ paddingTop: 64, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <Button variant="tertiary" size="sm" onClick={() => go('case')} style={{ alignSelf: 'flex-start' }}>К кейсу</Button>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}><span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)', letterSpacing: '.04em' }}>FINAL REPORT · COFFEE RUN · 14.09.2026</span><h1 style={{ margin: 0, font: 'var(--type-h1)', letterSpacing: 'var(--track-h1)' }}>Из чего сложилась стоимость</h1></div>
          <p style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text-2)', textWrap: 'pretty' }}>До старта клиенту не нужно разбираться в моделях, токенах и AI-инструментах. После запуска мы показываем production изнутри: что использовали, сколько это стоило и за какую работу отвечала команда.</p>
        </div>
      </Container>
      <Container style={{ paddingTop: 64 }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)', gap: 'var(--grid-gutter)', alignItems: 'start', paddingTop: 32, borderTop: '1px solid var(--text)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}><Counter value={ai + team} from={0} size="xl" suffix=" ₽" /><span style={{ font: 'var(--type-body)', color: 'var(--text-2)' }}>Итоговый бюджет</span></div>
            <div className="grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 'var(--grid-gutter)' }}><Stat value={8421388} label="токенов" size="sm" /><Stat value={143} label="сборок" size="sm" /><Stat value={9} suffix=" д." label="production" size="sm" /></div>
          </div>
          <Ledger rows={[{ label: 'AI-инфраструктура', sub: 'Claude · GPT · агентские сессии — по фактическому расходу', value: ai }, { label: 'Production-команда', sub: 'архитектура, управление AI, review, QA, интеграции, деплой — зафиксировано до старта', value: team }, { label: 'Поддержка 3 месяца', sub: 'до 14.12.2026', value: 'включено', tone: 'positive' }]} total={ai + team} totalLabel="Итоговый бюджет" />
        </div>
      </Container>
      <Container style={{ paddingTop: 96 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24, flexWrap: 'wrap', paddingBottom: 24 }}><h2 style={{ margin: 0, font: 'var(--type-h3)', letterSpacing: 'var(--track-h3)' }}>По этапам</h2><Button variant="tertiary" size="sm" onClick={() => setDetail(!detail)}>{detail ? 'Скрыть детализацию по моделям' : 'Показать детализацию по моделям'}</Button></div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Этап</th><th style={{ ...th, textAlign: 'right' }}>AI-расход</th><th style={{ ...th, textAlign: 'right' }}>Работа команды</th><th style={{ ...th, textAlign: 'right' }}>Итого</th></tr></thead>
          <tbody>{stages.map(r => <tr key={r[0]}><td style={cell}>{r[0]}</td><td style={{ ...num, color: 'var(--text-2)' }}>{r[1].toLocaleString('ru-RU')} ₽</td><td style={{ ...num, color: 'var(--text-2)' }}>{r[2].toLocaleString('ru-RU')} ₽</td><td style={num}>{(r[1] + r[2]).toLocaleString('ru-RU')} ₽</td></tr>)}
            <tr><td style={{ ...cell, borderBottom: 'none', font: 'var(--type-label)' }}>Итого</td><td style={{ ...num, borderBottom: 'none' }}>{ai.toLocaleString('ru-RU')} ₽</td><td style={{ ...num, borderBottom: 'none' }}>{team.toLocaleString('ru-RU')} ₽</td><td style={{ ...num, borderBottom: 'none', font: 'var(--type-label)' }}>{(ai + team).toLocaleString('ru-RU')} ₽</td></tr></tbody>
        </table>
        {detail && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 48 }}>
            <thead><tr><th style={th}>Модель</th><th style={{ ...th, textAlign: 'right' }}>Input tokens</th><th style={{ ...th, textAlign: 'right' }}>Output tokens</th><th style={{ ...th, textAlign: 'right' }}>Cached</th><th style={{ ...th, textAlign: 'right' }}>Стоимость</th></tr></thead>
            <tbody>{[['Claude Sonnet', 5120400, 812300, 1904200, 11840], ['GPT', 402100, 96400, 0, 3980], ['Gemini', 78900, 6088, 0, 2500]].map(r => <tr key={r[0]}><td style={cell}>{r[0]}</td>{r.slice(1).map((v, i) => <td key={i} style={{ ...num, color: i === 3 ? 'var(--text)' : 'var(--text-2)' }}>{v.toLocaleString('ru-RU')}{i === 3 ? ' ₽' : ''}</td>)}</tr>)}</tbody>
          </table>
        )}
        <p style={{ margin: '16px 0 0', font: 'var(--type-caption)', color: 'var(--text-3)' }}>Демонстрационные данные. Ставки моделей различаются; стоимость показана по фактическим тарифам провайдеров без наценки.</p>
      </Container>
      <Container style={{ paddingTop: 96 }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'center', padding: '32px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>3 месяца поддержки включены</span><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>До 14.12.2026 — <span data-num style={{ color: 'var(--positive)' }}>0 ₽</span>. После — от 5 000 ₽ / мес.</span></div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}><Button onClick={() => go('home', 'intake')} variant="secondary">Запустить похожий проект</Button><Button>Скачать отчёт</Button></div>
        </div>
      </Container>
    </main>
  );
}
Object.assign(window, { CasePage, ReportPage });
