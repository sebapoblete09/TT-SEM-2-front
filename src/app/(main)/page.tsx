"use client";

import Hero from "@/components/homepage/Hero";
import InnovationSection from "@/components/homepage/InnovationArea";
import JoinUs from "@/components/homepage/JoinUs";
import Steps from "@/components/homepage/Steps";
import WhyBiomaterials from "@/components/homepage/WhyBiomaterials";
// Importamos nuestro nuevo componente animado
import ScrollReveal from "@/components/ui/scrollReveal";

export default function Home() {
  return (
    <main className="">
      {" "}
      <ScrollReveal>
        <Hero />
      </ScrollReveal>
      <ScrollReveal>
        <WhyBiomaterials />
      </ScrollReveal>
      <ScrollReveal>
        <Steps />
      </ScrollReveal>
      <ScrollReveal>
        <InnovationSection />
      </ScrollReveal>
      <ScrollReveal>
        <JoinUs />
      </ScrollReveal>
    </main>
  );
}
