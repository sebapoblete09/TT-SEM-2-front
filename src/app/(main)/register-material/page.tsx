"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form"; // <--- El cerebro global
import { zodResolver } from "@hookform/resolvers/zod";
import { createMaterialAction } from "@/actions/materials";
import {
  registerMaterialSchema,
  RegisterMaterialFormValues,
} from "@/components/register-material/schemas";

// Componentes de Pasos (Ahora usarán useFormContext internamente)
import BasicInfoForm from "@/components/register-material/Basic";
import PropertiesForm from "@/components/register-material/Properties";
import CompositionForm from "@/components/register-material/Composition";
import RecipeForm from "@/components/register-material/Recipe";

// UI
import { Loader2, CheckCircle2, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RegisterMaterialPage() {
  const router = useRouter();

  // Estados visuales
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 1. INICIALIZAR EL FORMULARIO GLOBAL
  const methods = useForm<RegisterMaterialFormValues>({
    resolver: zodResolver(registerMaterialSchema),
    mode: "onChange",
    defaultValues: {
      nombre: "",
      descripcion: "",
      derivadoDe: "",
      herramientas: [],
      colaboradores: [],
      imagenes: [], // Galería principal
      composicion: [],
      // Objetos anidados inicializados para evitar errores de null
      mecanicas: {
        resistencia: "",
        dureza: "",
        elasticidad: "",
        ductilidad: "",
        fragilidad: "",
      },
      perceptivas: {
        color: "",
        brillo: "",
        textura: "",
        transparencia: "",
        sensacion_termica: "",
      },
      emocionales: {
        calidez_emocional: "",
        inspiracion: "",
        sostenibilidad_percibida: "",
        armonia: "",
        innovacion_emocional: "",
      },
      // Array de pasos con uno inicial
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

  // Extraemos funciones útiles
  const { trigger, handleSubmit, getValues } = methods;

  // 2. NAVEGACIÓN INTELIGENTE (Valida solo lo que se ve)
  const nextStep = async (
    fieldsToValidate: (keyof RegisterMaterialFormValues)[]
  ) => {
    // Dispara validación SOLO de los campos del paso actual
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

  // 3. ENVÍO FINAL (Transformación de datos para el Backend Go)
  const onSubmit = async (data: RegisterMaterialFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // --- TEXTOS ---
      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion);
      formData.append("derivado_de", data.derivadoDe || "");

      // --- ARRAYS/OBJETOS A JSON ---
      formData.append("herramientas", JSON.stringify(data.herramientas));
      formData.append(
        "colaboradores",
        JSON.stringify(data.colaboradores || [])
      );
      formData.append("composicion", JSON.stringify(data.composicion));
      formData.append("prop_mecanicas", JSON.stringify(data.mecanicas));
      formData.append("prop_perceptivas", JSON.stringify(data.perceptivas));
      formData.append("prop_emocionales", JSON.stringify(data.emocionales));

      // --- PASOS (RECETA) ---
      // 1. JSON limpio (sin archivos)
      const pasosPayload = data.recipeSteps.map((s, i) => ({
        orden_paso: i + 1,
        descripcion: s.descripcion,
      }));
      formData.append("pasos", JSON.stringify(pasosPayload));

      // 2. Archivos de Pasos (Indexados)
      data.recipeSteps.forEach((step: any, i) => {
        // En registro usamos 'url_imagen' para guardar el File temporalmente (según tu schema)
        if (step.url_imagen instanceof File) {
          formData.append(`paso_images[${i}]`, step.url_imagen);
        }
        // Si tuvieras video:
        // if (step.url_video instanceof File) formData.append(`paso_video[${i}]`, step.url_video);
      });

      // --- IMÁGENES PRINCIPALES (GALERÍA) ---
      if (data.imagenes) {
        // Maneja tanto FileList como Array de Files
        const files = Array.isArray(data.imagenes)
          ? data.imagenes
          : Array.from(data.imagenes);
        files.forEach((file: any) => {
          if (file instanceof File) {
            formData.append("galeria_images[]", file);
          }
        });
      }

      // --- LLAMADA AL SERVER ACTION ---
      const result = await createMaterialAction(formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      setShowSuccess(true);
    } catch (err: any) {
      console.error(err);
      alert(`Error al registrar: ${err.message || "Inténtalo de nuevo."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 relative">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900">
            Registrar Nuevo Biomaterial
          </h1>
          <p className="text-slate-500 mb-8">Paso {step} de 4</p>

          {/* Barra de Progreso Simple */}
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-500 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* --- PROVIDER GLOBAL (Envuelve todo el Wizard) --- */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* PASO 1: INFORMACIÓN BÁSICA */}
            <div
              className={
                step === 1
                  ? "block animate-in fade-in slide-in-from-right-8 duration-300"
                  : "hidden"
              }
            >
              <BasicInfoForm
                // onNext valida los campos requeridos de este paso antes de avanzar
                onNext={() =>
                  nextStep([
                    "nombre",
                    "descripcion",
                    "herramientas",
                    "imagenes",
                  ])
                }
              />
            </div>

            {/* PASO 2: PROPIEDADES */}
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

            {/* PASO 3: COMPOSICIÓN */}
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

            {/* PASO 4: RECETA (FINAL) */}
            <div
              className={
                step === 4
                  ? "block animate-in fade-in slide-in-from-right-8 duration-300"
                  : "hidden"
              }
            >
              <RecipeForm
                onBack={prevStep}
                // No pasamos onSubmit aquí, el botón del hijo será type="submit" y disparará el onSubmit del form global
              />
            </div>
          </form>
        </FormProvider>
      </div>

      {/* --- ESTADOS DE CARGA Y ÉXITO --- */}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-64 p-6 shadow-2xl border-none bg-white/90 text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
            </div>
            <h3 className="font-semibold text-slate-800">Guardando...</h3>
            <p className="text-xs text-slate-500 mt-1">
              Subiendo datos e imágenes
            </p>
          </Card>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <Card className="w-full max-w-md p-8 shadow-2xl border-none bg-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-teal-500" />

            <div className="flex flex-col items-center">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                ¡Registro Exitoso!
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Tu material <strong>{getValues("nombre")}</strong> ha sido
                enviado correctamente y está pendiente de aprobación.
              </p>

              <div className="flex flex-col gap-3 w-full">
                <Button
                  onClick={() => router.push("/")}
                  size="lg"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
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
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
