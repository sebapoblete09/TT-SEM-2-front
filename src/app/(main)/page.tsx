"use client";

import { useState } from "react";
import Hero from "@/components/homepage/Hero";
import Stats from "@/components/homepage/Stats-Section";
import Materials_Section from "@/components/homepage/Materials-Section";

export default function Home() {
  const [materialCount, setMaterialCount] = useState(0);

  return (
    <main>
      <Hero />
      <Materials_Section setMaterialCountAction={setMaterialCount} />
      <Stats count={materialCount} />
    </main>
  );
}
