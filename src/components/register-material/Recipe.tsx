"use client";

import { useEffect, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form"; // <--- CLAVE
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
  ClipboardList,
  Image as ImageIcon,
  Video,
  ArrowLeft,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import Image from "next/image";

// Importamos el tipo global
import { RegisterMaterialFormValues } from "../../schemas/schemas";

interface RecipeFormProps {
  onBack: () => void;
  // No recibe onSubmit ni setRecipeSteps, usa el contexto
}

export interface Step {
  id: number;
  orden_paso: number;
  descripcion: string;
  url_imagen: File | null;
  url_video: File | null;
}
export default function RecipeForm({ onBack }: RecipeFormProps) {
  // Previsualizaciones locales
  const [previews, setPreviews] = useState<
    Record<number, { image?: string; video?: string }>
  >({});

  // Conectamos al contexto global
  const {
    control,
    register,
    formState: { errors },
    getValues,
    setValue,
    trigger,
  } = useFormContext<RegisterMaterialFormValues>();

  // Gestión de array dinámico conectado al schema global
  const { fields, append, remove } = useFieldArray({
    control,
    name: "recipeSteps",
  });

  // CARGA INICIAL DE PREVIEWS (Al montar, lee del estado global)
  useEffect(() => {
    const initialPreviews: Record<number, { image?: string; video?: string }> =
      {};
    const currentSteps = getValues("recipeSteps");

    currentSteps.forEach((step) => {
      if (step.url_imagen instanceof File) {
        initialPreviews[step.id] = {
          ...initialPreviews[step.id],
          image: URL.createObjectURL(step.url_imagen),
        };
      }
      if (step.url_video instanceof File) {
        initialPreviews[step.id] = {
          ...initialPreviews[step.id],
          video: URL.createObjectURL(step.url_video),
        };
      }
    });
    setPreviews((prev) => ({ ...prev, ...initialPreviews }));

    return () => {
      Object.values(initialPreviews).forEach((p) => {
        if (p.image) URL.revokeObjectURL(p.image);
        if (p.video) URL.revokeObjectURL(p.video);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // MANEJO DE ARCHIVOS (Actualiza RHF y Previews)
  const handleFileChange = (
    index: number,
    field: "url_imagen" | "url_video",
    file: File | null
  ) => {
    // 1. Actualizamos RHF
    setValue(`recipeSteps.${index}.${field}`, file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // 2. Actualizamos Preview
    const stepId = getValues(`recipeSteps.${index}.id`);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews((prev) => ({
        ...prev,
        [stepId]: {
          ...prev[stepId],
          [field === "url_imagen" ? "image" : "video"]: url,
        },
      }));
    } else {
      setPreviews((prev) => {
        const newPreviews = { ...prev };
        if (newPreviews[stepId]) {
          if (field === "url_imagen") delete newPreviews[stepId].image;
          if (field === "url_video") delete newPreviews[stepId].video;
        }
        return newPreviews;
      });
    }
  };

  // VALIDACIÓN FINAL Y SUBMIT (Disparado por el botón submit real)
  // Nota: En realidad, el botón type="submit" disparará el onSubmit del <form> en page.tsx.
  const handleFinalSubmit = async (e: React.MouseEvent) => {
    // Prevenimos el submit default si la validación falla
    e.preventDefault();

    const isValid = await trigger("recipeSteps");

    if (isValid) {
      // Disparamos el evento submit nativo del formulario para que page.tsx lo capture
      const formElement = document.querySelector("form");
      formElement?.requestSubmit();
    }
  };

  return (
    <Card className="border-2 border-slate-500/30 shadow-2xl shadow-slate-200/60 bg-white rounded-2xl overflow-hidden max-w-3xl mx-auto">
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
          {fields.map((field, index) => {
            const stepError = errors.recipeSteps?.[index];
            const realStepId = getValues(`recipeSteps.${index}.id`);

            return (
              <div
                key={field.id}
                className={`relative bg-white border rounded-xl p-6 shadow-sm transition-all group ${
                  stepError?.descripcion
                    ? "border-red-200 ring-1 ring-red-100"
                    : "border-slate-200 hover:shadow-md hover:border-teal-200"
                }`}
              >
                {/* Badge Número */}
                <div
                  className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-white z-10 ${
                    stepError
                      ? "bg-red-500 text-white"
                      : "bg-teal-600 text-white"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Botón Eliminar */}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label
                      className={`text-xs font-semibold uppercase tracking-wide ${
                        stepError?.descripcion
                          ? "text-red-500"
                          : "text-slate-500"
                      }`}
                    >
                      Instrucciones del Paso {index + 1}
                    </Label>
                    <Textarea
                      {...register(`recipeSteps.${index}.descripcion`)}
                      rows={3}
                      placeholder="Ej: Mezclar la glicerina con el agua..."
                      className={`resize-none ${
                        stepError?.descripcion
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-50/10"
                          : "bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                      }`}
                    />
                    {stepError?.descripcion && (
                      <p className="text-xs text-red-500 font-medium animate-in fade-in">
                        {stepError.descripcion.message}
                      </p>
                    )}
                  </div>

                  {/* Zona Multimedia */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* IMAGEN */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" /> Imagen (Opcional)
                      </Label>
                      <div className="relative h-32 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 hover:border-teal-400 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden group/upload">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(
                              index,
                              "url_imagen",
                              e.target.files?.[0] || null
                            )
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />

                        {previews[realStepId]?.image ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={previews[realStepId]!.image!}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/upload:bg-black/20 transition-colors z-10 flex items-center justify-center">
                              <p className="text-white text-xs font-medium opacity-0 group-hover/upload:opacity-100">
                                Cambiar
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-6 h-6 text-slate-300 mb-1" />
                            <span className="text-xs text-slate-400">
                              Subir Foto
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* VIDEO */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <Video className="w-3 h-3" /> Video (Opcional)
                      </Label>
                      <div className="relative h-32 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 hover:border-teal-400 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden group/upload">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) =>
                            handleFileChange(
                              index,
                              "url_video",
                              e.target.files?.[0] || null
                            )
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        {previews[realStepId]?.video ? (
                          <div className="relative w-full h-full bg-black flex justify-center">
                            <video
                              src={previews[realStepId]!.video!}
                              className="h-full w-auto"
                            />
                          </div>
                        ) : (
                          <>
                            <Video className="w-6 h-6 text-slate-300 mb-1" />
                            <span className="text-xs text-slate-400">
                              Subir Video
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón Agregar Paso */}
        <Button
          type="button"
          onClick={() =>
            append({
              id: Date.now(),
              orden_paso: fields.length + 1,
              descripcion: "",
              url_imagen: null,
              url_video: null,
            })
          }
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

          {/* BOTÓN FINAL */}
          <Button
            onClick={handleFinalSubmit}
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
