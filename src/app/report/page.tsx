import type { Metadata } from 'next';
import { ReportPage } from '@/site/pages/ReportPage';

export const metadata: Metadata = {
  title: 'Из чего сложилась стоимость | Сборка',
  description: 'Production-отчет по проекту: AI-расход, работа команды и итоговый бюджет',
};

export default function Page() {
  return <ReportPage />;
}
