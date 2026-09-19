import type { Metadata } from 'next';
import { KitPage } from '@/site/pages/KitPage';

export const metadata: Metadata = {
  title: 'Библиотека компонентов — VC Studio',
  description: '19 компонентов дизайн-системы VC Studio в шести группах со всеми состояниями.',
};

export default function Page() {
  return <KitPage />;
}
