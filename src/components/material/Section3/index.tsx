"use client";

import { Material } from "@/types/materials";
// Asegúrate de importar desde tu componente UI configurado, no directo de radix si usas shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertiesCard from "./PropertiesTabs"; // O la ruta correcta a tu PropertiesCard
import { Eye, Heart, Layers } from "lucide-react";

export default function Properties({ material }: { material: Material }) {
  return (
    <section>
      {/* 1. defaultValue debe coincidir con el primer trigger */}
      <Tabs defaultValue="mecanicas" className="w-full ">
        {/* 2. Definimos los IDs (values) de cada pestaña */}
        <TabsList className="grid w-full grid-cols-3 bg-white">
          <TabsTrigger value="mecanicas">Mecánicas</TabsTrigger>
          <TabsTrigger value="perceptivas">Perceptivas</TabsTrigger>
          <TabsTrigger value="emocionales">Emocionales</TabsTrigger>
        </TabsList>

        {/* 3. Contenido A: Mecánicas */}
        <TabsContent value="mecanicas" className="mt-4 focus-visible:ring-0">
          <PropertiesCard
            title="Propiedades Mecánicas"
            data={material.prop_mecanicas}
            icon={Layers}
            iconColorClass="bg-blue-100 text-blue-600"
          />
        </TabsContent>

        {/* 4. Contenido B: Perceptivas */}
        <TabsContent value="perceptivas" className="mt-4 focus-visible:ring-0">
          <PropertiesCard
            title="Propiedades Sensoriales"
            data={material.prop_perceptivas}
            icon={Eye}
            iconColorClass="bg-purple-100 text-purple-600"
          />
        </TabsContent>

        {/* 5. Contenido C: Emocionales (Este te faltaba envolver) */}
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
