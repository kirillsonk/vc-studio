import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import { Analytics } from "@/site/analytics/Analytics";
import { Nav } from '@/site/Nav';
import { Footer } from '@/site/Footer';
import { PageTransition } from '@/site/PageTransition';
import '@/styles/styles.css';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-onest',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Сборка | Сайты и интерактив на скорости AI',
  description: 'Разрабатываем сайты, спецпроекты и веб-сервисы с AI для агентств и бизнеса. Дизайн, разработка, интеграции и запуск',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={onest.variable}>
      <body>
        <a className="skip-link" href="#main">Перейти к содержимому</a>
        <Nav />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
