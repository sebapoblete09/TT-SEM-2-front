"use client";

import { useState } from "react";
import {
  Material,
  prop_emocionales,
  prop_mecanicas,
  prop_perceptivas,
} from "@/types/materials";
import { updateMaterialAction } from "@/actions/materials";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importamos los submódulos
import { BasicInfoSection } from "./BasicInfoSection";
import { StepsSection, StepWithFile } from "./StepSection";
import { GallerySection } from "./GallerySection";
import { PropertiesSection } from "./PropertiesSection";

interface EditProps {
  material: Material;
}

export default function EditMaterialForm({ material }: EditProps) {
  const [loading, setLoading] = useState(false);

  // --- ESTADOS ---
  const [nombre, setNombre] = useState(material.nombre);
  const [descripcion, setDescripcion] = useState(material.descripcion);
  const [herramientas, setHerramientas] = useState<string[]>(
    material.herramientas || []
  );
  const [composicion, setComposicion] = useState<string[]>(
    material.composicion || []
  );
  const [mecanicas, setMecanicas] = useState<prop_mecanicas>(
    material.prop_mecanicas || {
      material_id: material.id,
      resistencia: "",
      dureza: "",
      elasticidad: "",
      ductilidad: "",
      fragilidad: "",
    }
  );
  const [perceptivas, setPerceptivas] = useState<prop_perceptivas>(
    material.prop_perceptivas || {
      material_id: material.id,
      color: "",
      brillo: "",
      textura: "",
      transparencia: "",
      sensacion_termica: "",
    }
  );
  const [emocionales, setEmocionales] = useState<prop_emocionales>(
    material.prop_emocionales || {
      material_id: material.id,
      calidez_emocional: "",
      inspiracion: "",
      sostenibilidad_percibida: "",
      armonia: "",
      innovacion_emocional: "",
    }
  );

  const [steps, setSteps] = useState<StepWithFile[]>(
    material.pasos
      .sort((a, b) => a.orden_paso - b.orden_paso)
      .map((p) => ({ ...p, newFile: null }))
  );

  const [galleryCaptions, setGalleryCaptions] = useState(
    material.galeria?.sort((a, b) => a.ID - b.ID).map((g) => g.caption || "") ||
      []
  );
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

  // --- HANDLERS ---
  const handleStepChange = (index: number, val: string) => {
    const newSteps = [...steps];
    newSteps[index].descripcion = val;
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        orden_paso: steps.length + 1, // El siguiente número
        descripcion: "",
        newFile: null,
        // No ponemos ID, el backend sabrá que es nuevo porque su orden_paso es nuevo
        // o porque no machea con existingPasos por lógica de descarte.
      },
    ]);
  };

  const handleRemoveStep = (indexToRemove: number) => {
    // 1. Filtramos el paso
    const filtered = steps.filter((_, i) => i !== indexToRemove);

    // 2. IMPORTANTE: Renumeramos los orden_paso para mantener secuencia 1, 2, 3...
    // Esto asegura que el backend entienda la nueva estructura limpiamente.
    const reordered = filtered.map((step, i) => ({
      ...step,
      orden_paso: i + 1,
    }));

    setSteps(reordered);
  };

  const handleStepFile = (index: number, file: File) => {
    const newSteps = [...steps];
    newSteps[index].newFile = file;
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Construcción del FormData (Lógica de negocio pura)
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("herramientas", JSON.stringify(herramientas));
      formData.append("composicion", JSON.stringify(composicion));
      formData.append("prop_mecanicas", JSON.stringify(mecanicas));
      formData.append("prop_perceptivas", JSON.stringify(perceptivas));
      formData.append("prop_emocionales", JSON.stringify(emocionales));

      const pasosPayload = steps.map((s, i) => ({
        orden_paso: i + 1,
        descripcion: s.descripcion,
      }));
      formData.append("pasos", JSON.stringify(pasosPayload));

      steps.forEach((step, i) => {
        if (step.newFile) formData.append(`paso_images[${i}]`, step.newFile);
      });

      if (newGalleryFiles.length > 0) {
        newGalleryFiles.forEach((f) => formData.append("galeria_images[]", f));
      } else {
        formData.append("galeria_captions", JSON.stringify(galleryCaptions));
      }

      const res = await updateMaterialAction(material.id, formData);
      if (res.success) {
        toast.success("Material actualizado");
        setNewGalleryFiles([]);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error al enviar");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERIZADO LIMPIO ---
  return (
    // El form envuelve todo para que el botón de submit funcione desde cualquier tab
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border overflow-hidden"
    >
      <Tabs defaultValue="general" className="w-full">
        {/* --- HEADER DE TABS --- */}
        <div className="border-b px-6 py-4 bg-slate-50/50">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="propiedades">Propiedades</TabsTrigger>
            <TabsTrigger value="proceso">Proceso</TabsTrigger>
            <TabsTrigger value="galeria">Galería</TabsTrigger>
          </TabsList>
        </div>

        {/* --- CONTENIDO DE TABS --- */}
        <div className="p-6 min-h-[500px]">
          {/* TAB 1: GENERAL */}
          <TabsContent
            value="general"
            className="mt-0 space-y-6 animate-in fade-in-50"
          >
            <BasicInfoSection
              nombre={nombre}
              setNombre={setNombre}
              descripcion={descripcion}
              setDescripcion={setDescripcion}
              herramientas={herramientas}
              setHerramientas={setHerramientas}
              composicion={composicion}
              setComposicion={setComposicion}
              derivadoDe={material.derivado_de}
              colaboradores={material.colaboradores}
            />
          </TabsContent>

          {/* TAB 2: PROPIEDADES */}
          <TabsContent
            value="propiedades"
            className="mt-0 space-y-6 animate-in fade-in-50"
          >
            <PropertiesSection
              mecanicas={mecanicas}
              setMecanicas={setMecanicas}
              perceptivas={perceptivas}
              setPerceptivas={setPerceptivas}
              emocionales={emocionales}
              setEmocionales={setEmocionales}
            />
          </TabsContent>

          {/* TAB 3: PROCESO (STEPS) */}
          <TabsContent
            value="proceso"
            className="mt-0 space-y-6 animate-in fade-in-50"
          >
            <StepsSection
              steps={steps}
              onStepChange={handleStepChange}
              onStepFile={handleStepFile}
              // Pasamos las nuevas funciones
              onAddStep={handleAddStep}
              onRemoveStep={handleRemoveStep}
            />
          </TabsContent>

          {/* TAB 4: GALERÍA */}
          <TabsContent
            value="galeria"
            className="mt-0 space-y-6 animate-in fade-in-50"
          >
            <GallerySection
              originalGallery={material.galeria || []}
              captions={galleryCaptions}
              setCaptions={setGalleryCaptions}
              newFiles={newGalleryFiles}
              setNewFiles={setNewGalleryFiles}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* --- FOOTER CON BOTÓN DE GUARDADO --- */}
      <div className="bg-slate-50 px-6 py-4 border-t flex justify-between items-center">
        <p className="text-xs text-slate-400">
          * Recuerda guardar los cambios antes de salir.
        </p>
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="min-w-[150px]"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
