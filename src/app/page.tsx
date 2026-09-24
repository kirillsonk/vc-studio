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
