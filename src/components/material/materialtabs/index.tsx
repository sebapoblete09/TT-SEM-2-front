"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Material } from "@/types/materials";
import RecipeTab from "./RecipeTabs";
import PropertiesTab from "./PropertiesTabs";
import CompositionTab from "./CompositionTabs";

export default function MaterialTabsContainer({
  material,
}: {
  material: Material;
}) {
  return (
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
    </Tabs>
  );
}
