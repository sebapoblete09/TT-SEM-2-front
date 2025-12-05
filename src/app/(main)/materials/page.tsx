"use client";

import Materials_Section from "@/components/MaterialPage/Materials-Section";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense
      fallback={<div className="p-20 text-center">Cargando catálogo...</div>}
    >
      <Materials_Section />
    </Suspense>
  );
}
