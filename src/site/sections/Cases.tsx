'use client';

import React from 'react';
import { CaseCard } from '@/components';
import { Head, Section } from '../Chrome';
import { Media } from '../Media';
import { CASES } from '../data';
import { ROUTES } from '../constants';
import { useGo } from '../navigation';

export function Cases() {
  const go = useGo();
  return (
    <Section id="cases" pad={160}>
      <Head index="02" title="Кейсы с открытой экономикой" lead="Показываем не только результат, но и срок, итоговый бюджет и фактический AI-расход." />
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: '64px var(--grid-gutter)', alignItems: 'start' }}>
        {CASES.map(c => (
          <CaseCard
            key={c.slug}
            size={c.size}
            ratio={c.ratio}
            onClick={() => go(ROUTES.case)}
            kind={c.kind}
            year={c.year}
            client={c.client}
            title={c.title}
            days={c.days}
            budget={c.budget}
            media={<Media {...c.media} />}
          />
        ))}
      </div>
    </Section>
  );
}
