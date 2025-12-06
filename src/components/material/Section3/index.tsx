"use client";

import { Material } from "@/types/materials";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertiesCard from "./PropertiesTabs";
import { Eye, Heart, Layers } from "lucide-react";

export default function Properties({ material }: { material: Material }) {
  return (
    <section>
      <Tabs defaultValue="mecanicas" className="w-full ">
        <TabsList className="grid w-full grid-cols-3 bg-white">
          <TabsTrigger value="mecanicas">Mecánicas</TabsTrigger>
          <TabsTrigger value="perceptivas">Perceptivas</TabsTrigger>
          <TabsTrigger value="emocionales">Emocionales</TabsTrigger>
        </TabsList>

        {/* Contenido A: Mecánicas */}
        <TabsContent value="mecanicas" className="mt-4 focus-visible:ring-0">
          <PropertiesCard
            title="Propiedades Mecánicas"
            data={material.prop_mecanicas}
            icon={Layers}
            iconColorClass="bg-blue-100 text-blue-600"
          />
        </TabsContent>

        {/*  Contenido B: Perceptivas */}
        <TabsContent value="perceptivas" className="mt-4 focus-visible:ring-0">
          <PropertiesCard
            title="Propiedades Sensoriales"
            data={material.prop_perceptivas}
            icon={Eye}
            iconColorClass="bg-purple-100 text-purple-600"
          />
        </TabsContent>

        {/*  Contenido C: Emocionales  */}
        <TabsContent value="emocionales" className="mt-4 focus-visible:ring-0">
          <PropertiesCard
            title="Propiedades Emocionales"
            data={material.prop_emocionales}
            icon={Heart}
            iconColorClass="bg-rose-100 text-rose-600"
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
