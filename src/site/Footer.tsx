import React from 'react';
import Link from 'next/link';
import { Container } from './Chrome';
import { HOME_SECTIONS } from './constants';

const FOOTER_LINKS: Array<[href: string, label: string]> = [
  ...HOME_SECTIONS.map(([id, label]) => [`/#${id}`, label] as [string, string]),
  ['/#faq', 'Вопросы'],
];

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', marginTop: 140 }}>
      <Container className="grid" style={{ padding: '48px var(--container-pad) 40px', display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,4fr) minmax(0,3fr)', gap: 'var(--grid-gutter)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ font: '500 22px/1 var(--font-sans)', letterSpacing: '-.04em' }}>VC Studio</span>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)', maxWidth: 360 }}>AI-native production для сайтов, игр и digital-спецпроектов.</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FOOTER_LINKS.map(([href, l]) => <Link key={href} href={href} style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>{l}</Link>)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a href="mailto:hello@vc.studio" style={{ font: 'var(--type-body-sm)' }}>hello@vc.studio</a>
          <a href="#" style={{ font: 'var(--type-body-sm)' }}>Telegram</a>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-3)', marginTop: 16 }}>© 2026</span>
        </div>
      </Container>
    </footer>
  );
}
