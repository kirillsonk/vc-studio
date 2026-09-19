import type { Metadata } from 'next';
import { CasePage } from '@/site/pages/CasePage';

export const metadata: Metadata = {
  title: 'Промо-игра для сети кофеен — VC Studio',
  description: '30-секундная браузерная механика с лидербордом и промокодами. От первого scope до production — 9 дней.',
};

export default function Page() {
  return <CasePage />;
}
