import type { Metadata } from "next";
import { Hero } from "@/site/sections/Hero";
import { Cases } from "@/site/sections/Cases";
import { WhatWeDo } from "@/site/sections/WhatWeDo";
import { Approach } from "@/site/sections/Approach";
import { Economics } from "@/site/sections/Economics";
import { Process } from "@/site/sections/Process";
import { Clients } from "@/site/sections/Clients";
import { FAQ } from "@/site/sections/FAQ";
import { Intake } from "@/site/sections/Intake";
import { ScrollReveal } from "@/site/ScrollReveal";
import { FloatingContact } from "@/site/FloatingContact";

const title = "Сборка. Цифровые продукты и AI-разработка";
const description = "Создаем сайты и сервисы с AI, чтобы вы тратили меньше на разработку. От идеи и дизайна до запуска: понятная смета, проверка и настройка инфраструктуры";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://sborkadigital.ru/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Сборка",
    url: "https://sborkadigital.ru/",
    title,
    description,
  },
};

export default function HomePage() {
  return (
    <main id="main">
      <div className="mobile-ribbons" aria-hidden="true">
        <svg viewBox="0 0 400 900" preserveAspectRatio="xMidYMid slice" fill="none">
          <g className="mobile-ribbon-drift">
            {[0, 12, 24].map((offset) => <path key={offset} transform={`translate(${offset} 0)`} d="M450 -120C180 40 510 180 310 350S-90 500 70 690S470 820 290 1040" stroke={offset === 0 ? "#C94320" : "#9CA79A"} />)}
            <path className="mobile-ribbon-light" d="M450 -120C180 40 510 180 310 350S-90 500 70 690S470 820 290 1040" stroke="#C94320" />
          </g>
        </svg>
      </div>
      <ScrollReveal />
      <Hero />
      <WhatWeDo />
      <Approach />
      <Economics />
      <Cases />
      <Process />
      <Clients />
      <FAQ />
      <Intake />
      <FloatingContact />
    </main>
  );
}
