"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageIcon, Plus, Video, X } from "lucide-react";

export interface Step {
  id: number;
  orden_paso: number;
  descripcion: string;
  url_imagen: string | null;
  url_video: string | null;
}

interface RecipeFormProps {
  recipeSteps: Step[];
  setRecipeSteps: React.Dispatch<React.SetStateAction<Step[]>>;
}

export default function RecipeForm({
  recipeSteps,
  setRecipeSteps,
}: RecipeFormProps) {
  const addRecipeStep = () => {
    const newOrden = recipeSteps.length + 1;
    setRecipeSteps([
      ...recipeSteps,
      {
        id: newOrden,
        orden_paso: newOrden,
        descripcion: "",
        url_imagen: null,
        url_video: null,
      },
    ]);
  };

  const removeRecipeStep = (id: number) => {
    setRecipeSteps(recipeSteps.filter((step) => step.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Método / Receta</CardTitle>
        <CardDescription>
          Documenta el proceso paso a paso para crear el biomaterial
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recipeSteps.map((step) => (
          <div key={step.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Paso {step.orden_paso}</h4>
              {recipeSteps.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRecipeStep(step.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>Descripción del Paso</Label>
              <Textarea
                placeholder="Describe detalladamente este paso..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Imagen del Paso (Opcional)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                  <ImageIcon className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Subir imagen
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Video del Paso (Opcional)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                  <Video className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Subir video
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent"
          onClick={addRecipeStep}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Paso
        </Button>
      </CardContent>
    </Card>
  );
}
