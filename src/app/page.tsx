import Hero from "@/components/homepage/Hero";
import Stats from "@/components/homepage/Stats-Section";
import FilterSection from "@/components/homepage/Filter-Section";
import Materials_Section from "@/components/homepage/Materials-Section";

export default function Home() {
  return (
    <main>
      <Hero />
      <FilterSection />
      <Materials_Section />
      <Stats />
    </main>
  );
}
