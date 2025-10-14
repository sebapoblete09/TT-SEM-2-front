"use client";

import { useState } from "react";
import BasicInfoForm, {
  BasicInfoData,
} from "@/components/register-material/Basic";
import PropertiesForm, {
  PropertiesData,
} from "@/components/register-material/Properties";
import CompositionForm from "@/components/register-material/Composition";
import RecipeForm, { Step } from "@/components/register-material/Recipe";

export default function RegisterMaterialPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

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

      const res = await fetch("http://localhost:8080/materials", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al guardar material");

      alert("✅ Material registrado con éxito");
      console.log("Payload enviado:", Object.fromEntries(formData));
      setStep(1);
    } catch (err) {
      console.error(err);
      alert("❌ Ocurrió un error al registrar el material");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Registrar Nuevo Biomaterial</h1>

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

        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm text-white text-lg">
            Guardando material...
          </div>
        )}
      </div>
    </div>
  );
}
