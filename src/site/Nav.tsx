'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components';
import { Container } from './Chrome';
import { HOME_SECTIONS, ROUTES } from './constants';
import { useGo } from './navigation';

export function Nav() {
  const go = useGo();
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    f();
    window.addEventListener('scroll', f);
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <header className="vc-header" style={{ background: 'var(--canvas)', borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`, transition: 'border-color var(--dur-ui)' }}>
      <Container style={{ height: 'var(--header-h)', display: 'flex', alignItems: 'center', gap: 40 }}>
        <Link href={ROUTES.home} style={{ font: '500 22px/1 var(--font-sans)', letterSpacing: '-.04em', color: 'var(--text)' }}>VC Studio</Link>
        <nav className="nav-links" style={{ display: 'flex', gap: 32, flex: 1, justifyContent: 'flex-end' }}>
          {HOME_SECTIONS.map(([k, l]) => <Link key={k} href={`/#${k}`} style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>{l}</Link>)}
        </nav>
        <Button size="sm" onClick={() => go(ROUTES.intake)}>Запустить проект</Button>
      </Container>
    </header>
  );
}
