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
    <section className=" grid grid-cols-2 gap-2 p-7">
      <CompositionTab composicion={material.composicion} />

      <ToolsCard herramientas={material.herramientas} />
    </section>
  );
}
{
  /* 
  <PropertiesTab
        mecanicas={material.prop_mecanicas}
        emocionales={material.prop_emocionales}
        perceptivas={material.prop_perceptivas}
      />
      <Tabs defaultValue="recipe" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="recipe">Receta</TabsTrigger>
        <TabsTrigger value="properties">Propiedades</TabsTrigger>
        <TabsTrigger value="composition">Composición</TabsTrigger>
      </TabsList>

      <TabsContent value="recipe">
        <RecipeTab pasos={material.pasos} />
      </TabsContent>

      <TabsContent value="properties">
        <PropertiesTab
          mecanicas={material.prop_mecanicas}
          perceptivas={material.prop_perceptivas}
          emocionales={material.prop_emocionales}
        />
      </TabsContent>

      <TabsContent value="composition">
        <CompositionTab composicion={material.composicion} />
      </TabsContent>
    </Tabs>*/
}
