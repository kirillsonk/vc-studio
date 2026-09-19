import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import { Nav } from '@/site/Nav';
import { Footer } from '@/site/Footer';
import '@/styles/styles.css';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-onest',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VC Studio — AI-native production',
  description: 'Спецпроекты на скорости AI. С ответственностью студии. Промо-сайты, веб-игры, 3D и интерактивные продукты.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={onest.variable}>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
