const { Button } = window.VCStudioDesignSystem_40ecfd;

function Container({ children, style, id }) {
  return <div id={id} style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-pad)', boxSizing: 'border-box', ...style }}>{children}</div>;
}
function Section({ children, style, id, pad = 140, border }) {
  return <section id={id} style={{ paddingTop: pad, borderTop: border ? '1px solid var(--line)' : 'none' }}><Container style={style}>{children}</Container></section>;
}
/** Editorial 5/7 head: index + title left, lead right. */
function Head({ index, title, lead, children }) {
  return (
    <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'end', paddingBottom: 48 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>{index && <span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)' }}>{index}</span>}<h2 style={{ margin: 0, font: 'var(--type-h2)', letterSpacing: 'var(--track-h2)', maxWidth: 760, textWrap: 'balance' }}>{title}</h2></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>{lead && <p style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text-2)', maxWidth: 480, textWrap: 'pretty' }}>{lead}</p>}{children}</div>
    </div>
  );
}

function Nav({ go, screen }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f); }, []);
  const items = [['cases', 'Кейсы'], ['process', 'Как работаем'], ['economics', 'Стоимость'], ['agencies', 'Для агентств']];
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 'var(--z-header)', background: 'var(--canvas)', borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`, transition: 'border-color var(--dur-ui)' }}>
      <Container style={{ height: 'var(--header-h)', display: 'flex', alignItems: 'center', gap: 40 }}>
        <a href="#" onClick={e => { e.preventDefault(); go('home'); }} style={{ font: '500 22px/1 var(--font-sans)', letterSpacing: '-.04em', color: 'var(--text)' }}>VC Studio</a>
        <nav className="nav-links" style={{ display: 'flex', gap: 32, flex: 1, justifyContent: 'flex-end' }}>
          {items.map(([k, l]) => <a key={k} href="#" onClick={e => { e.preventDefault(); go('home', k); }} style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>{l}</a>)}
        </nav>
        <Button size="sm" onClick={() => go('home', 'intake')}>Запустить проект</Button>
      </Container>
    </header>
  );
}

function Footer({ go }) {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', marginTop: 140 }}>
      <Container style={{ padding: '48px var(--container-pad) 40px', display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,4fr) minmax(0,3fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }} >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}><span style={{ font: '500 22px/1 var(--font-sans)', letterSpacing: '-.04em' }}>VC Studio</span><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)', maxWidth: 360 }}>AI-native production для сайтов, игр и digital-спецпроектов.</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[['cases', 'Кейсы'], ['process', 'Как работаем'], ['economics', 'Стоимость'], ['agencies', 'Для агентств'], ['faq', 'Вопросы']].map(([k, l]) => <a key={k} href="#" onClick={e => { e.preventDefault(); go('home', k); }} style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>{l}</a>)}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><a href="mailto:hello@vc.studio" style={{ font: 'var(--type-body-sm)' }}>hello@vc.studio</a><a href="#" style={{ font: 'var(--type-body-sm)' }}>Telegram</a><span style={{ font: 'var(--type-caption)', color: 'var(--text-3)', marginTop: 16 }}>© 2026</span></div>
      </Container>
    </footer>
  );
}

Object.assign(window, { Container, Section, Head, Nav, Footer });
