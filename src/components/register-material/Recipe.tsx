"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface Step {
  id: number;
  orden_paso: number;
  descripcion: string;
  url_imagen: File | null;
  url_video: File | null;
}

interface RecipeFormProps {
  recipeSteps: Step[];
  setRecipeSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  onBack: () => void;
  onSubmit: () => void;
}

export default function RecipeForm({
  recipeSteps,
  setRecipeSteps,
  onBack,
  onSubmit,
}: RecipeFormProps) {
  const [previews, setPreviews] = useState<
    Record<number, { image?: string; video?: string }>
  >({});

  // 🖼️ Crear previews locales cuando cambian archivos
  useEffect(() => {
    const newPreviews: Record<number, { image?: string; video?: string }> = {};
    recipeSteps.forEach((step) => {
      const imageUrl = step.url_imagen
        ? URL.createObjectURL(step.url_imagen)
        : undefined;
      const videoUrl = step.url_video
        ? URL.createObjectURL(step.url_video)
        : undefined;
      newPreviews[step.id] = { image: imageUrl, video: videoUrl };
    });
    setPreviews(newPreviews);

    // 🧹 limpiar URLs temporales al desmontar
    return () => {
      Object.values(previews).forEach((p) => {
        if (p.image) URL.revokeObjectURL(p.image);
        if (p.video) URL.revokeObjectURL(p.video);
      });
    };
  }, [recipeSteps]);

  const addStep = () => {
    setRecipeSteps((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        orden_paso: prev.length + 1,
        descripcion: "",
        url_imagen: null,
        url_video: null,
      },
    ]);
  };

  const removeStep = (id: number) => {
    setRecipeSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStep = <K extends keyof Step>(
    id: number,
    field: K,
    value: Step[K]
  ) => {
    setRecipeSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receta / Proceso</CardTitle>
        <CardDescription>
          Agrega los pasos del proceso de creación del material.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {recipeSteps.map((step, index) => (
          <div
            key={step.id}
            className="border p-4 rounded-lg space-y-3 relative"
          >
            <h3 className="font-semibold">Paso {index + 1}</h3>

            {/* 📝 Descripción */}
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={step.descripcion}
                onChange={(e) =>
                  updateStep(step.id, "descripcion", e.target.value)
                }
                rows={3}
                placeholder="Describe este paso..."
              />
            </div>

            {/* 📸 Archivos */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Imagen (opcional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    updateStep(
                      step.id,
                      "url_imagen",
                      e.target.files?.[0] || null
                    )
                  }
                />
                {previews[step.id]?.image && (
                  <Image
                    src={previews[step.id]!.image!}
                    alt="preview"
                    width={200}
                    height={200}
                    className="mt-2 rounded-lg object-cover border"
                  />
                )}
              </div>

              <div>
                <Label>Video (opcional)</Label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    updateStep(
                      step.id,
                      "url_video",
                      e.target.files?.[0] || null
                    )
                  }
                />
                {previews[step.id]?.video && (
                  <video
                    controls
                    src={previews[step.id]!.video!}
                    className="mt-2 w-48 rounded-lg border"
                  />
                )}
              </div>
            </div>

            {recipeSteps.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                className="absolute top-2 right-2 text-destructive"
                onClick={() => removeStep(step.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        {/* ➕ Agregar paso */}
        <Button type="button" variant="secondary" onClick={addStep}>
          <Plus className="h-4 w-4 mr-2" /> Agregar Paso
        </Button>

        {/* 🔙 / ✅ Navegación */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Atrás
          </Button>
          <Button onClick={onSubmit}>Finalizar y Publicar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
