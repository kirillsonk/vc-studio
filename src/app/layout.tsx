import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
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
  title: 'VC Studio | Сайты, сервисы и разработка с AI',
  description: 'Спецпроекты на скорости AI. С ответственностью студии. Промо-сайты, веб-игры, 3D и интерактивные продукты',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={onest.variable}>
      <body>
        <a className="skip-link" href="#main">Перейти к содержимому</a>
        <Nav />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
