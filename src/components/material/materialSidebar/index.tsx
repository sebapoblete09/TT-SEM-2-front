"use client";

import ToolsCard from "./ToolsCard";
import RelatedMaterialsCard from "./RelatedMaterialCard";
import { Material } from "@/types/materials";

export default function MaterialSidebar({ material }: { material: Material }) {
  return (
    <div className="space-y-6">
      <ToolsCard herramientas={material.herramientas} />
      <RelatedMaterialsCard />
    </div>
  );
}
