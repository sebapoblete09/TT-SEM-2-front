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
      {/* El Hero suele verse mejor si aparece de inmediato o con una animación diferente, 
          pero si quieres que todo tenga el mismo efecto, envuélvelo también. 
          A veces al Hero le quito el ScrollReveal para que cargue instantáneo. */}
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
