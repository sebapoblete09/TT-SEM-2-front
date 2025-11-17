"use client";

import Hero from "@/components/homepage/Hero";
import InnovationSection from "@/components/homepage/InnovationArea";
import JoinUs from "@/components/homepage/JoinUs";
import Steps from "@/components/homepage/Steps";
import WhyBiomaterials from "@/components/homepage/WhyBiomaterials";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhyBiomaterials />
      <Steps />
      <InnovationSection />
      <JoinUs />
    </main>
  );
}
