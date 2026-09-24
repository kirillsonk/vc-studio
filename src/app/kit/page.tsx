import type { Metadata } from 'next';
import { KitPage } from '@/site/pages/KitPage';

export const metadata: Metadata = {
  title: 'Библиотека компонентов | Сборка',
  description: '19 компонентов дизайн-системы Сборки в шести группах со всеми состояниями',
};

export default function Page() {
  return <KitPage />;
}
