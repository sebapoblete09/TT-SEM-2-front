"use client";
/**
 * @file page.tsx
 * @description Página principal del Wizard de registro de materiales.
 * Gestiona el estado global del formulario multipasos (Wizard), la comunicación con el backend
 * y el feedback visual al usuario (Loading/Success).
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Tipos e Interfaces
import { BasicInfoData } from "@/types/materials";
import { Step } from "@/components/register-material/Recipe";
import { PropertiesData } from "@/components/register-material/Properties";

// Componentes de Pasos del Formulario
import BasicInfoForm from "@/components/register-material/Basic";
import PropertiesForm from "@/components/register-material/Properties";
import CompositionForm from "@/components/register-material/Composition";
import RecipeForm from "@/components/register-material/Recipe";

// Componentes UI & Iconos
import { Loader2, CheckCircle2, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RegisterMaterialPage() {
  const router = useRouter();
  const supabase = createClient();

  // --- ESTADOS DE CONTROL DE FLUJO ---
  const [step, setStep] = useState(1); // Paso actual del wizard (1-4)
  const [loading, setLoading] = useState(false); // Estado de carga durante el envío
  const [showSuccess, setShowSuccess] = useState(false); // Control del modal de éxito

  // --- ESTADOS DE DATOS DEL FORMULARIO ---
  // Se mantienen en el componente padre para persistir data al navegar entre pasos

  // Paso 1: Información Básica
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    nombre: "",
    descripcion: "",
    herramientas: [],
    derivadoDe: "",
    colaboradores: [],
    imagenes: [],
  });

  // Paso 2: Propiedades (Mecánicas, Perceptivas, Emocionales)
  const [properties, setProperties] = useState<PropertiesData>({
    mecanicas: {},
    perceptivas: {},
    emocionales: {},
  });

  // Paso 3: Composición Química
  const [composicion, setComposicion] = useState<string[]>([]);

  // Paso 4: Receta / Pasos de Fabricación
  const [recipeSteps, setRecipeSteps] = useState<Step[]>([
    {
      id: 1,
      orden_paso: 1,
      descripcion: "",
      url_imagen: null,
      url_video: null,
    },
  ]);

  /**
   * Envía todos los datos recolectados al backend.
   * Realiza la autenticación, construye el FormData (incluyendo archivos)
   * y maneja la respuesta del servidor.
   */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1. Verificación de Sesión
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
      const formData = new FormData();

      // 2. Construcción del Payload (FormData)
      // Se serializan los objetos/arrays a JSON string para enviarlos como texto
      formData.append("nombre", basicInfo.nombre);
      formData.append("descripcion", basicInfo.descripcion);
      formData.append("herramientas", JSON.stringify(basicInfo.herramientas));
      formData.append("composicion", JSON.stringify(composicion));
      formData.append("creador_id", JSON.stringify(session.user.id));
      formData.append("prop_mecanicas", JSON.stringify(properties.mecanicas));
      formData.append(
        "prop_perceptivas",
        JSON.stringify(properties.perceptivas)
      );
      formData.append(
        "prop_emocionales",
        JSON.stringify(properties.emocionales)
      );
      formData.append("colaboradores", JSON.stringify(basicInfo.colaboradores));
      formData.append("derivado_de", basicInfo.derivadoDe || "");

      // Mapeo de pasos (sin archivos aún)
      formData.append(
        "pasos",
        JSON.stringify(
          recipeSteps.map((s) => ({
            orden_paso: s.orden_paso,
            descripcion: s.descripcion,
          }))
        )
      );

      // 3. Adjuntar Archivos Multimedia
      // Imágenes de pasos
      recipeSteps.forEach((step, i) => {
        if (step.url_imagen instanceof File) {
          formData.append(`paso_images[${i}]`, step.url_imagen);
        }
      });

      // Agregar imágenes de galería
      basicInfo.imagenes.forEach((img: File) => {
        formData.append("galeria_images[]", img);
      });

      // 4. Petición al Backend
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Error desconocido en el backend");
      }

      // 5. Éxito: Mostrar Modal
      setLoading(false);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert(
        "❌ Ocurrió un error al registrar el material. Revisa la consola para más detalles."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reinicia el formulario recargando la página.
   * Útil para registrar múltiples materiales en una sesión.
   */
  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 relative">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        {/* Header de la Página */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900">
            Registrar Nuevo Biomaterial
          </h1>
          <p className="text-slate-500 mb-8">Paso {step} de 4</p>
        </div>

        {/* --- RENDERIZADO CONDICIONAL DE PASOS --- */}
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

      {/* --- OVERLAYS DE ESTADO --- */}

      {/* 1. LOADING OVERLAY */}
      {/* Bloquea la interfaz mientras se procesa el envío */}
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

      {/* 2. SUCCESS MODAL */}
      {/* Feedback positivo y opciones de navegación post-registro */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <Card className="w-full max-w-md p-8 shadow-2xl border-none bg-white text-center relative overflow-hidden">
            {/* Decoración superior */}
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
                  variant="secondary"
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
