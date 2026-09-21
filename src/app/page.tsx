import { Hero } from "@/site/sections/Hero";
import { Cases } from "@/site/sections/Cases";
import { WhatWeDo } from "@/site/sections/WhatWeDo";
import { Economics } from "@/site/sections/Economics";
import { Process } from "@/site/sections/Process";
import { Agencies } from "@/site/sections/Agencies";
import { FAQ } from "@/site/sections/FAQ";
import { Intake } from "@/site/sections/Intake";
export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <Cases />
      <WhatWeDo />
      <Economics />
      <Process />
      <Agencies />
      <FAQ />
      <Intake />
    </main>
  );
}
