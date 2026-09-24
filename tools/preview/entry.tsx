import React from 'react';
import { createRoot } from 'react-dom/client';
import { Nav } from '@/site/Nav';
import { Footer } from '@/site/Footer';
import { Hero } from '@/site/sections/Hero';
import { Cases } from '@/site/sections/Cases';
import { WhatWeDo } from '@/site/sections/WhatWeDo';
import { Approach } from '@/site/sections/Approach';
import { Economics } from '@/site/sections/Economics';
import { Process } from '@/site/sections/Process';
import { Agencies } from '@/site/sections/Agencies';
import { FAQ } from '@/site/sections/FAQ';
import { Intake } from '@/site/sections/Intake';
import { ScrollReveal } from '@/site/ScrollReveal';
import { FloatingContact } from '@/site/FloatingContact';
import { CasePage } from '@/site/pages/CasePage';
import { ReportPage } from '@/site/pages/ReportPage';
import { KitPage } from '@/site/pages/KitPage';
import { currentPath } from './shims/router';

// Mirrors src/app/page.tsx
function Home() {
  return (
    <main id="main">
      <ScrollReveal />
      <Hero />
      <WhatWeDo />
      <Approach />
      <Economics />
      <Cases />
      <Process />
      <Agencies />
      <FAQ />
      <Intake />
      <FloatingContact />
    </main>
  );
}

function App() {
  const [path, setPath] = React.useState('/');
  React.useEffect(() => {
    const sync = () => setPath(currentPath());
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  const Screen = path === '/case' ? CasePage : path === '/report' ? ReportPage : path === '/kit' ? KitPage : Home;
  return (
    <>
      <Nav />
      <div key={path}><Screen /></div>
      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
