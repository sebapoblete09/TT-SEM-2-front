"use client";

import { useState } from "react";
import BasicInfoForm from "@/components/register-material/Basic";
import PropertiesForm, {
  PropertiesData,
} from "@/components/register-material/Properties";
import CompositionForm from "@/components/register-material/Composition";
import RecipeForm, { Step } from "@/components/register-material/Recipe";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { BasicInfoData } from "@/types/materials";
import { Loader2, CheckCircle2, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterMaterialPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Nuevo estado para el modal de éxito

  const supabase = createClient();

  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    nombre: "",
    descripcion: "",
    herramientas: [],
    derivadoDe: "",
    colaboradores: [],
    imagenes: [],
  });

  const [properties, setProperties] = useState<PropertiesData>({
    mecanicas: {},
    perceptivas: {},
    emocionales: {},
  });

  const [composicion, setComposicion] = useState<string[]>([]);
  const [recipeSteps, setRecipeSteps] = useState<Step[]>([
    {
      id: 1,
      orden_paso: 1,
      descripcion: "",
      url_imagen: null,
      url_video: null,
    },
  ]);

  const handleSubmit = async () => {
    try {
      // Obténer la sesión (y el token)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      // Valida que tengas el token
      if (sessionError || !session?.access_token) {
        throw new Error(
          sessionError?.message || "No se encontró sesión. Inicia sesión."
        );
      }

      const accessToken = session.access_token;

      setLoading(true);

      // Convertir las propiedades en objetos planos (stringificados)
      const prop_mecanicas = JSON.stringify(properties.mecanicas);
      const prop_perceptivas = JSON.stringify(properties.perceptivas);
      const prop_emocionales = JSON.stringify(properties.emocionales);

      // Crear el FormData
      const formData = new FormData();

      formData.append("nombre", basicInfo.nombre);
      formData.append("descripcion", basicInfo.descripcion);
      formData.append("herramientas", JSON.stringify(basicInfo.herramientas));
      formData.append("composicion", JSON.stringify(composicion));
      formData.append("creador_id", "1");
      formData.append("prop_mecanicas", prop_mecanicas);
      formData.append("prop_perceptivas", prop_perceptivas);
      formData.append("prop_emocionales", prop_emocionales);
      formData.append("colaboradores", JSON.stringify(basicInfo.colaboradores));
      formData.append(
        "pasos",
        JSON.stringify(
          recipeSteps.map((s) => ({
            orden_paso: s.orden_paso,
            descripcion: s.descripcion,
          }))
        )
      );
      formData.append("derivado_de", basicInfo.derivadoDe || "");

      // Agregar imágenes de pasos (si las tienes en recipeSteps)
      recipeSteps.forEach((step, i) => {
        if (step.url_imagen instanceof File) {
          formData.append(`paso_images[${i}]`, step.url_imagen);
        }
      });

      // Agregar imágenes de galería
      basicInfo.imagenes.forEach((img: File) => {
        formData.append("galeria_images[]", img);
      });

      console.log("Enviando FormData al backend (localhost:8080)...");
      const baseUrl =
        process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
      const response = await fetch(`${baseUrl}/materials`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        // Manejar el error si el backend de tu compañero falla
        const errorData = await response.json(); // O .text()
        throw new Error(errorData.message || "Error en el backend");
      }
      // ÉXITO: No redirigimos aún, mostramos el modal
      setLoading(false);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert("❌ Ocurrió un error al registrar el material");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    window.location.reload(); // La forma más rápida de limpiar todo
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 relative">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900">
          Registrar Nuevo Biomaterial
        </h1>
        <p className="text-slate-500 mb-8">Paso {step} de 4</p>

        {/* Renderizado de Pasos */}
        <div className="transition-all duration-300 ease-in-out">
          {step === 1 && (
            <BasicInfoForm
              data={basicInfo}
              setData={setBasicInfo}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <PropertiesForm
              data={properties}
              setData={setProperties}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <CompositionForm
              composicion={composicion}
              setComposicion={setComposicion}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <RecipeForm
              recipeSteps={recipeSteps}
              setRecipeSteps={setRecipeSteps}
              onBack={() => setStep(3)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>

      {/* === 1. OVERLAY DE LOADING === */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-64 p-6 shadow-2xl border-none bg-white/90 text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
            </div>
            <h3 className="font-semibold text-slate-800">
              Guardando Material...
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Subiendo imágenes y datos
            </p>
          </Card>
        </div>
      )}

      {/* === 2. OVERLAY DE ÉXITO (SUCCESS MODAL) === */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <Card className="w-full max-w-md p-8 shadow-2xl border-none bg-white text-center relative overflow-hidden">
            {/* Confeti o decoración de fondo */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-teal-500" />

            <div className="flex flex-col items-center">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                ¡Registro Exitoso!
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Tu material <strong>{basicInfo.nombre}</strong> ha sido enviado
                correctamente y está pendiente de aprobación.
              </p>

              <div className="flex flex-col gap-3 w-full">
                <Button
                  onClick={() => router.push("/")}
                  size="lg"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Volver al Inicio
                </Button>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Otro Material
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
