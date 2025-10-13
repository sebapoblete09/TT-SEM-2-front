import Hero from "@/components/homepage/Hero";
import Stats from "@/components/homepage/Stats-Section";
import Materials_Section from "@/components/homepage/Materials-Section";

export default function Home() {
  return (
    <main>
      <Hero />
      <Materials_Section />
      <Stats />
    </main>
  );
}
