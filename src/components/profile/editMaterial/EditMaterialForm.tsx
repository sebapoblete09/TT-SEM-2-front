"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editMaterialSchema } from "@/components/register-material/schemas";
import { Material } from "@/types/materials";
import { updateMaterialAction } from "@/actions/materials";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Home } from "lucide-react";
import { useRouter } from "next/navigation";

import { BasicInfoSection } from "./BasicInfoSection";
import { PropertiesSection } from "./PropertiesSection";
import { StepsSection } from "./StepSection";
import { GallerySection } from "./GallerySection";

interface EditProps {
  material: Material;
  onSuccessClose?: () => void;
}

export default function EditMaterialForm({
  material,
  onSuccessClose,
}: EditProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 1. INICIALIZAR EL FORMULARIO
  // Nota: No pasamos el genérico <EditMaterialFormValues> para dejar que Zod infiera
  // y evitar conflictos de tipos con los arrays.
  const methods = useForm({
    resolver: zodResolver(editMaterialSchema),
    defaultValues: {
      nombre: material.nombre || "",
      descripcion: material.descripcion || "",
      derivadoDe: material.derivado_de || "",
      herramientas: material.herramientas || [],

      // Mapeo de Composición (Array de objetos)
      composicion:
        material.composicion?.map((c) => ({
          elemento: c.elemento,
          cantidad: c.cantidad === "n/a" ? "" : c.cantidad,
        })) || [],

      // Mapeo de Mecánicas (DB devuelve number, Form usa string)
      mecanicas:
        material.prop_mecanicas?.map((p) => ({
          nombre: p.nombre,
          valor: String(p.valor), // Convertimos a string para el input
          unidad: p.unidad === "n/a" ? "" : p.unidad,
        })) || [],

      // Mapeo de Perceptivas
      perceptivas:
        material.prop_perceptivas?.map((p) => ({
          nombre: p.nombre,
          valor: p.valor,
        })) || [],

      // Mapeo de Emocionales
      emocionales:
        material.prop_emocionales?.map((p) => ({
          nombre: p.nombre,
          valor: p.valor,
        })) || [],

      // Mapeo de Pasos
      pasos: material.pasos
        ? material.pasos
            .sort((a, b) => a.orden_paso - b.orden_paso)
            .map((p) => ({
              id: p.ID || Math.random(), // Asegurar ID para keys de React
              orden_paso: p.orden_paso,
              descripcion: p.descripcion,
              url_imagen: p.url_imagen,
              url_video: p.url_video,
              newFile: null,
            }))
        : [],

      // Mapeo de Galería
      galeria:
        material.galeria?.map((g) => ({
          id: g.ID || Math.random(),
          url_imagen: g.url_imagen,
          caption: g.caption || "",
        })) || [],

      newGalleryFiles: [],
    },
  });

  const { handleSubmit, getValues } = methods;

  // 2. MANEJO DEL SUBMIT
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Campos Simples
      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion);
      if (data.derivadoDe) formData.append("derivado_de", data.derivadoDe);

      // Arrays JSON
      formData.append("herramientas", JSON.stringify(data.herramientas));

      // Composición (Ya es un array de objetos correcto)
      formData.append("composicion", JSON.stringify(data.composicion));

      // Propiedades (Ya son arrays de objetos correctos)
      formData.append("prop_mecanicas", JSON.stringify(data.mecanicas));
      formData.append("prop_perceptivas", JSON.stringify(data.perceptivas));
      formData.append("prop_emocionales", JSON.stringify(data.emocionales));

      // Pasos (JSON estructura)
      const pasosPayload = data.pasos.map((s: any, i: number) => ({
        orden_paso: i + 1,
        descripcion: s.descripcion,
      }));
      formData.append("pasos", JSON.stringify(pasosPayload));

      // Archivos de Pasos (Nuevos)
      data.pasos.forEach((step: any, i: number) => {
        if (step.newFile instanceof File) {
          formData.append(`paso_images[${i}]`, step.newFile);
        }
      });

      // Archivos de Galería (Nuevos)
      if (data.newGalleryFiles && data.newGalleryFiles.length > 0) {
        // Manejar si es FileList o Array
        const files = Array.isArray(data.newGalleryFiles)
          ? data.newGalleryFiles
          : Array.from(data.newGalleryFiles);

        files.forEach((file: any) => {
          if (file instanceof File) {
            formData.append("galeria_images[]", file);
          }
        });
      }

      // Captions de Galería Existente
      const captions = data.galeria?.map((g: any) => g.caption || "") || [];
      formData.append("galeria_captions", JSON.stringify(captions));

      // Enviar al Server Action
      const res = await updateMaterialAction(material.id, formData);

      if (res.success) {
        setSuccess(true);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al enviar");
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors: any) => {
    console.log("Errores de validación:", errors);
    toast.error("Revisa el formulario, hay campos inválidos.");
  };

  const handleSuccessRedirect = () => {
    if (onSuccessClose) {
      onSuccessClose();
    } else {
      router.push("/user");
    }
  };

  // --- RENDER: ÉXITO ---
  if (success) {
    return (
      <div className="flex justify-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="w-full max-w-md p-8 shadow-xl border bg-white text-center relative overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-teal-500" />

          <div className="flex flex-col items-center">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              ¡Actualización Exitosa!
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              El material <strong>{getValues("nombre")}</strong> ha sido
              actualizado correctamente.
            </p>

            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={handleSuccessRedirect}
                size="lg"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Home className="mr-2 h-4 w-4" />
                Volver a Mis Materiales
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // --- RENDER: FORMULARIO ---
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border overflow-hidden"
      >
        <Tabs defaultValue="general" className="w-full">
          <div className="border-b px-6 py-4 bg-slate-50/50">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-lg">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="propiedades">Propiedades</TabsTrigger>
              <TabsTrigger value="proceso">Proceso</TabsTrigger>
              <TabsTrigger value="galeria">Galería</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 min-h-[500px]">
            <TabsContent value="general" className="mt-0">
              <BasicInfoSection
                derivadoDe={material.derivado_de}
                colaboradores={material.colaboradores} // Se pasan como props de lectura
              />
            </TabsContent>

            <TabsContent value="propiedades" className="mt-0">
              <PropertiesSection />
            </TabsContent>

            <TabsContent value="proceso" className="mt-0">
              <StepsSection />
            </TabsContent>

            <TabsContent value="galeria" className="mt-0">
              <GallerySection />
            </TabsContent>
          </div>
        </Tabs>

        <div className="bg-slate-50 px-6 py-4 border-t flex justify-end gap-4">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
