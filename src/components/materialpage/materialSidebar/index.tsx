"use client";

import ToolsCard from "./ToolsCard";
import ApplicationsCard from "./ApplicationsCard";
import RelatedMaterialsCard from "./RelatedMaterialCard";
import { Material } from "@/components/ui/materialCard";

export default function MaterialSidebar({ material }: { material: Material }) {
  return (
    <div className="space-y-6">
      <ToolsCard herramientas={material.herramientas} />
      <ApplicationsCard />
      <RelatedMaterialsCard />
    </div>
  );
}
