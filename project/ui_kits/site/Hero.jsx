const { Button, Counter } = window.VCStudioDesignSystem_40ecfd;

/** Production canvas: a light build interface that assembles itself in ~1.6s, then stays calm. */
function ProductionCanvas() {
  const rows = [['Hero section', 'ready'], ['Interactive canvas', 'ready'], ['API integration', 'building'], ['QA', 'queued']];
  const [step, setStep] = React.useState(0);
  const [tokens, setTokens] = React.useState(0);
  React.useEffect(() => {
    const t = [200, 500, 800, 1100, 1400].map((ms, i) => setTimeout(() => setStep(i + 1), ms));
    const t0 = setTimeout(() => setTokens(1284310), 900);
    const live = setInterval(() => setTokens(v => v ? v + Math.round(Math.random() * 600) : v), 2400);
    return () => { t.forEach(clearTimeout); clearTimeout(t0); clearInterval(live); };
  }, []);
  const cost = Math.round(tokens * 0.00299);
  const status = s => s === 'ready' ? { c: 'var(--positive)', t: 'ready' } : s === 'building' ? { c: 'var(--brand)', t: 'building' } : { c: 'var(--text-3)', t: 'queued' };
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: 28, display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', overflow: 'hidden', opacity: step > 0 ? 1 : 0, transition: 'opacity var(--dur-ui) var(--ease)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 16, borderBottom: '1px solid var(--text)' }}><span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)', letterSpacing: '.04em' }}>BUILD 0042</span><span style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--type-caption)', color: 'var(--positive)' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--positive)' }} />Live</span></div>
      <div style={{ position: 'relative' }}>
        <div aria-hidden style={{ position: 'absolute', left: 4, top: 0, bottom: 0, width: 1.5, background: 'var(--line)' }} />
        <div aria-hidden style={{ position: 'absolute', left: 4, top: 0, width: 1.5, background: 'var(--brand)', height: `${Math.min(step, 4) / 4 * 100}%`, transition: 'height var(--dur-reveal) var(--ease)' }} />
        {rows.map(([n, s], i) => { const on = step > i, st = status(s); return (
          <div key={n} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 12, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--line)', opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: 'all var(--dur-ui) var(--ease)' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: s === 'queued' ? 'var(--surface)' : st.c, border: `1.5px solid ${st.c}`, boxSizing: 'border-box', marginLeft: .5 }} />
            <span style={{ font: 'var(--type-body-sm)', color: 'var(--text)' }}>{n}</span>
            <span style={{ font: 'var(--type-caption)', color: st.c }}>{st.t}</span>
          </div>); })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, paddingTop: 24, opacity: step > 3 ? 1 : 0, transition: 'opacity var(--dur-reveal) var(--ease)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>AI-расход этой сборки</span><Counter value={tokens} size="md" suffix=" токенов" style={{ fontSize: 'clamp(22px,2vw,30px)' }} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>Фактическая стоимость моделей</span><Counter value={cost} size="md" suffix=" ₽" style={{ fontSize: 'clamp(22px,2vw,30px)' }} /></div>
      </div>
      <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)', paddingTop: 16, opacity: step > 4 ? 1 : 0, transition: 'opacity var(--dur-reveal)' }}>Счётчик показывает, сколько контекста и генерации потребовалось модели для этого демо. Без наценки на AI-инфраструктуру.</span>
    </div>
  );
}

function Hero({ go }) {
  const [in_, setIn] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setIn(true), 40); return () => clearTimeout(t); }, []);
  const reveal = (d) => ({ clipPath: in_ ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)', transform: in_ ? 'none' : 'translateY(12px)', transition: `clip-path var(--dur-reveal) var(--ease) ${d}ms, transform var(--dur-reveal) var(--ease) ${d}ms` });
  return (
    <Container style={{ paddingTop: 72 }}>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <h1 style={{ margin: 0, font: 'var(--type-display)', letterSpacing: 'var(--track-display)', maxWidth: 820, textWrap: 'balance', ...reveal(80) }}>Спецпроекты на скорости AI. С ответственностью студии.</h1>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,4fr) minmax(0,3fr)', gap: 'var(--grid-gutter)', alignItems: 'start', ...reveal(240) }}>
            <p style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text-2)', textWrap: 'pretty' }}>Делаем промо-сайты, веб-игры, 3D и интерактивные продукты. AI берёт на себя большую часть написания кода, наша команда — архитектуру, качество и запуск.</p>
            <p style={{ margin: 0, font: 'var(--type-body-sm)', color: 'var(--text-2)', paddingTop: 4, borderTop: '1px solid var(--line)' }}>Расход AI показываем по факту. Работу команды фиксируем заранее.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', ...reveal(360) }}><Button size="lg" onClick={() => go('home', 'intake')}>Запустить проект</Button><Button size="lg" variant="secondary" onClick={() => go('home', 'cases')}>Смотреть кейсы</Button></div>
        </div>
        <ProductionCanvas />
      </div>
    </Container>
  );
}
Object.assign(window, { Hero, ProductionCanvas });
