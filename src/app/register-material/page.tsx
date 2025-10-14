"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BasicInfoForm from "@/components/register-material/Basic";
import PropertiesForm from "@/components/register-material/Properties";
import CompositionForm from "@/components/register-material/Composition";
import RecipeForm, { Step } from "@/components/register-material/Recipe";

export default function RegisterMaterialPage() {
  const [herramientas, setHerramientas] = useState<string[]>([]);
  const [currentHerramienta, setCurrentHerramienta] = useState("");
  const [composicion, setComposicion] = useState<string[]>([]);
  const [currentComposicion, setCurrentComposicion] = useState("");
  const [colaboradores, setColaboradores] = useState<string[]>([]);
  const [currentColaborador, setCurrentColaborador] = useState("");
  const [recipeSteps, setRecipeSteps] = useState<Step[]>([
    {
      id: 1,
      orden_paso: 1,
      descripcion: "",
      url_imagen: null,
      url_video: null,
    },
  ]);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Registrar Nuevo Biomaterial
          </h1>
          <p className="text-muted-foreground text-lg">
            Comparte tu investigación con la comunidad UTEM
          </p>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="properties">Propiedades</TabsTrigger>
            <TabsTrigger value="composition">Composición</TabsTrigger>
            <TabsTrigger value="recipe">Receta</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoForm
              herramientas={herramientas}
              setHerramientas={setHerramientas}
              currentHerramienta={currentHerramienta}
              setCurrentHerramienta={setCurrentHerramienta}
              colaboradores={colaboradores}
              setColaboradores={setColaboradores}
              currentColaborador={currentColaborador}
              setCurrentColaborador={setCurrentColaborador}
            />
          </TabsContent>

          <TabsContent value="properties">
            <PropertiesForm />
          </TabsContent>

          <TabsContent value="composition">
            <CompositionForm
              composicion={composicion}
              setComposicion={setComposicion}
              currentComposicion={currentComposicion}
              setCurrentComposicion={setCurrentComposicion}
            />
          </TabsContent>

          <TabsContent value="recipe">
            <RecipeForm
              recipeSteps={recipeSteps}
              setRecipeSteps={setRecipeSteps}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" size="lg">
            Guardar Borrador
          </Button>
          <Button size="lg">Publicar Material</Button>
        </div>
      </div>
    </div>
  );
}
