"use client";

import { useState } from "react";
import Stats from "@/components/MaterialPage/Stats-Section";
import Materials_Section from "@/components/MaterialPage/Materials-Section";

export default function Home() {
  const [materialCount, setMaterialCount] = useState(0);

  return (
    <main>
      <Materials_Section setMaterialCountAction={setMaterialCount} />
      <Stats count={materialCount} />
    </main>
  );
}
