"use client";

import { Material } from "@/types/materials";
import CompositionTab from "./CompositionTabs";
import ToolsCard from "./ToolsCard";

export default function CompositionsTools({
  material,
}: {
  material: Material;
}) {
  return (
    <section className=" grid grid-cols-1 md:grid-cols-2 gap-2 p-7">
      <CompositionTab composicion={material.composicion} />

      <ToolsCard herramientas={material.herramientas} />
    </section>
  );
}
