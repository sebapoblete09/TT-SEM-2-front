"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMaterialAction } from "@/actions/materials";
import {
  registerMaterialSchema,
  RegisterMaterialFormValues,
} from "@/components/register-material/schemas";

// Componentes de Pasos
import BasicInfoForm from "@/components/register-material/Basic";
import PropertiesForm from "@/components/register-material/Properties";
import CompositionForm from "@/components/register-material/Composition";
import RecipeForm from "@/components/register-material/Recipe";

// UI
import { Loader2, CheckCircle2, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RegisterMaterialForm() {
  const router = useRouter();

  // Estados visuales
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Inicializar el formulario
  const methods = useForm({
    resolver: zodResolver(registerMaterialSchema),
    mode: "onChange",
    defaultValues: {
      nombre: "",
      descripcion: "",
      derivadoDe: "",
      herramientas: [],
      colaboradores: [],
      imagenes: [],
      composicion: [],
      mecanicas: [],
      perceptivas: [],
      emocionales: [],
      recipeSteps: [
        {
          id: Date.now(),
          orden_paso: 1,
          descripcion: "",
          url_imagen: null,
          url_video: null,
        },
      ],
    },
  });

  const { trigger, handleSubmit, getValues } = methods;

  // Navegación
  const nextStep = async (
    fieldsToValidate: (keyof RegisterMaterialFormValues)[]
  ) => {
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    window.location.reload();
  };

  // Envío
  // Envío
  const onSubmit = async (data: RegisterMaterialFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // 1. CAMPOS DE TEXTO SIMPLE
      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion);
      formData.append("derivado_de", data.derivadoDe || "");

      // 2. ARRAYS DE STRINGS
      formData.append("herramientas", JSON.stringify(data.herramientas));
      formData.append(
        "colaboradores",
        JSON.stringify(data.colaboradores || [])
      );

      // 3. ESTRUCTURAS COMPLEJAS (Ahora se envían directo)
      // Antes tenías que armar el objeto, ahora 'data.composicion' ya es [{elemento, cantidad}, ...]
      formData.append("composicion", JSON.stringify(data.composicion));

      // Propiedades: Ya son arrays [{nombre, valor, unidad?}, ...]
      // El backend de Go podrá hacer Unmarshal directamente a sus structs.
      formData.append("prop_mecanicas", JSON.stringify(data.mecanicas));
      formData.append("prop_perceptivas", JSON.stringify(data.perceptivas));
      formData.append("prop_emocionales", JSON.stringify(data.emocionales));

      // 4. PASOS (RECETA)
      // Mapeamos para enviar solo la info de texto en el JSON
      const pasosPayload = data.recipeSteps.map((s, i) => ({
        orden_paso: i + 1,
        descripcion: s.descripcion,
      }));
      formData.append("pasos", JSON.stringify(pasosPayload));

      // 5. ARCHIVOS (IMÁGENES DE PASOS)
      // Buscamos si hay archivos reales (File) en los pasos
      data.recipeSteps.forEach((step: any, i) => {
        // Nota: En tu schema usas 'url_imagen' o 'newFile' según cómo lo hayas definido.
        // Si usas el mismo input file del navegador, suele ser un FileList o File.
        if (step.url_imagen instanceof File) {
          formData.append(`paso_images[${i}]`, step.url_imagen);
        }
      });

      // 6. GALERÍA PRINCIPAL
      if (data.imagenes && data.imagenes.length > 0) {
        // Aseguramos que sea iterable (por si viene como FileList)
        const files = Array.isArray(data.imagenes)
          ? data.imagenes
          : Array.from(data.imagenes);

        files.forEach((file: any) => {
          if (file instanceof File) {
            formData.append("galeria_images[]", file);
          }
        });
      }

      // 7. LLAMADA AL SERVER ACTION
      const result = await createMaterialAction(formData);

      if (!result.success) {
        throw new Error(
          result.message || "Error desconocido al crear material"
        );
      }

      setShowSuccess(true);
    } catch (err: any) {
      console.error("Error en onSubmit:", err);
      // Muestra el error en un alert o toast
      alert(`Ocurrió un error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Header del Formulario */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900">
          Registrar Nuevo Biomaterial
        </h1>
        <p className="text-slate-500 mb-8">Paso {step} de 4</p>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Renderizado condicional de pasos (igual que antes) */}
          <div
            className={
              step === 1
                ? "block animate-in fade-in slide-in-from-right-8 duration-300"
                : "hidden"
            }
          >
            <BasicInfoForm
              onNext={() =>
                nextStep(["nombre", "descripcion", "herramientas", "imagenes"])
              }
            />
          </div>
          <div
            className={
              step === 2
                ? "block animate-in fade-in slide-in-from-right-8 duration-300"
                : "hidden"
            }
          >
            <PropertiesForm
              onNext={() =>
                nextStep(["mecanicas", "perceptivas", "emocionales"])
              }
              onBack={prevStep}
            />
          </div>
          <div
            className={
              step === 3
                ? "block animate-in fade-in slide-in-from-right-8 duration-300"
                : "hidden"
            }
          >
            <CompositionForm
              onNext={() => nextStep(["composicion"])}
              onBack={prevStep}
            />
          </div>
          <div
            className={
              step === 4
                ? "block animate-in fade-in slide-in-from-right-8 duration-300"
                : "hidden"
            }
          >
            <RecipeForm onBack={prevStep} />
          </div>
        </form>
      </FormProvider>

      {/* Overlays de Loading y Success */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
          <Card className="w-64 p-6 bg-white/90 text-center">
            <Loader2 className="h-10 w-10 text-green-600 animate-spin mx-auto mb-4" />
            <h3 className="font-semibold text-slate-800">Guardando...</h3>
          </Card>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in zoom-in-95">
          <Card className="w-full max-w-md p-8 bg-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-teal-500" />
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              ¡Registro Exitoso!
            </h2>
            <p className="text-slate-500 mb-8">
              El material ha sido enviado a revisión.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push("/")}
                size="lg"
                className="w-full bg-slate-900 text-white"
              >
                <Home className="mr-2 h-4 w-4" /> Volver al Inicio
              </Button>
              <Button
                onClick={handleReset}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" /> Registrar Otro
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
