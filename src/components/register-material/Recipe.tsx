"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  X,
  ClipboardList,
  Image as ImageIcon,
  Video,
  ArrowLeft,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import Image from "next/image";

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
        id: Date.now(), // Usamos Date.now para ID único temporal más seguro que length
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
    <Card className="border-2 border-slate-500/30 shadow-2xl shadow-slate-200/60 bg-white rounded-2xl overflow-hidden max-w-3xl mx-auto">
      {/* HEADER */}
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-teal-100 rounded-lg text-teal-700">
            <ClipboardList className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-800">
            Proceso de Fabricación
          </CardTitle>
        </div>
        <CardDescription className="text-slate-500 ml-12">
          Detalla paso a paso cómo replicar este biomaterial.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 p-6 md:p-8">
        <div className="space-y-6">
          {recipeSteps.map((step, index) => (
            <div
              key={step.id}
              className="relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm transition-all hover:shadow-md hover:border-teal-200 group"
            >
              {/* Badge de Número Flotante */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-white z-10">
                {index + 1}
              </div>

              {/* Botón Eliminar (Solo si hay más de 1 paso) */}
              {recipeSteps.length > 1 && (
                <button
                  onClick={() => removeStep(step.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                  title="Eliminar paso"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="space-y-4 mt-2">
                {/* Descripción */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Instrucciones del Paso {index + 1}
                  </Label>
                  <Textarea
                    value={step.descripcion}
                    onChange={(e) =>
                      updateStep(step.id, "descripcion", e.target.value)
                    }
                    rows={3}
                    placeholder="Ej: Mezclar la glicerina con el agua a 60°C..."
                    className="bg-slate-50 border-slate-200 focus-visible:ring-teal-500 resize-none"
                  />
                </div>

                {/* Zona Multimedia (Grid 2 columnas) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Subir Imagen */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Imagen (Opcional)
                    </Label>

                    <div className="relative h-32 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 hover:border-teal-400 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden group/upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          updateStep(
                            step.id,
                            "url_imagen",
                            e.target.files?.[0] || null
                          )
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />

                      {previews[step.id]?.image ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={previews[step.id]!.image!}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/upload:bg-black/20 transition-colors z-10 flex items-center justify-center">
                            <p className="text-white text-xs font-medium opacity-0 group-hover/upload:opacity-100">
                              Cambiar imagen
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-6 h-6 text-slate-300 mb-1 group-hover/upload:text-teal-500 transition-colors" />
                          <span className="text-xs text-slate-400 font-medium">
                            Subir Foto
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Subir Video */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                      <Video className="w-3 h-3" /> Video (Opcional)
                    </Label>

                    <div className="relative h-32 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 hover:border-teal-400 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden group/upload">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          updateStep(
                            step.id,
                            "url_video",
                            e.target.files?.[0] || null
                          )
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />

                      {previews[step.id]?.video ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-black">
                          <video
                            src={previews[step.id]!.video!}
                            className="h-full w-auto max-w-full"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/upload:bg-black/40 transition-colors z-10 flex items-center justify-center">
                            <p className="text-white text-xs font-medium opacity-0 group-hover/upload:opacity-100">
                              Cambiar video
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Video className="w-6 h-6 text-slate-300 mb-1 group-hover/upload:text-teal-500 transition-colors" />
                          <span className="text-xs text-slate-400 font-medium">
                            Subir Video
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón Agregar Paso */}
        <Button
          type="button"
          onClick={addStep}
          variant="outline"
          className="w-full border-dashed border-2 border-slate-200 h-14 text-slate-500 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50/50"
        >
          <Plus className="h-5 w-5 mr-2" /> Agregar Siguiente Paso
        </Button>

        {/* NAVEGACIÓN FINAL */}
        <div className="flex justify-between pt-8 border-t border-slate-100">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Atrás
          </Button>

          <Button
            onClick={onSubmit}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/10 px-8"
          >
            Finalizar y Publicar
            <CheckCircle2 className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
