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

const title = "Сборка | Разработка сайтов, лендингов и сервисов с AI";
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
