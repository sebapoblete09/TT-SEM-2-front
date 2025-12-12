"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editMaterialSchema,
  EditMaterialFormValues,
} from "@/components/register-material/schemas";
import { Material } from "@/types/materials";
import { updateMaterialAction } from "@/actions/materials";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Home, Plus } from "lucide-react"; // Importar iconos
import { useRouter } from "next/navigation"; // Importar router

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
  const [success, setSuccess] = useState(false); // Estado para el modal de éxito

  // 1. INICIALIZAR EL FORMULARIO
  const methods = useForm<EditMaterialFormValues>({
    resolver: zodResolver(editMaterialSchema),
    defaultValues: {
      nombre: material.nombre || "",
      descripcion: material.descripcion || "",
      derivadoDe: material.derivado_de || "",
      herramientas: material.herramientas || [],
      composicion: material.composicion || [],
      mecanicas: material.prop_mecanicas || {
        resistencia: "",
        dureza: "",
        elasticidad: "",
        ductilidad: "",
        fragilidad: "",
      },
      perceptivas: material.prop_perceptivas || {
        color: "",
        brillo: "",
        textura: "",
        transparencia: "",
        sensacion_termica: "",
      },
      emocionales: material.prop_emocionales || {
        calidez_emocional: "",
        inspiracion: "",
        sostenibilidad_percibida: "",
        armonia: "",
        innovacion_emocional: "",
      },
      pasos: material.pasos
        ? material.pasos
            .sort((a, b) => a.orden_paso - b.orden_paso)
            .map((p) => ({
              id: p.ID || p.ID,
              orden_paso: p.orden_paso,
              descripcion: p.descripcion,
              url_imagen: p.url_imagen,
              url_video: p.url_video,
              newFile: null,
            }))
        : [],
      galeria:
        material.galeria?.map((g) => ({
          id: g.ID || g.ID,
          url_imagen: g.url_imagen,
          caption: g.caption || "",
        })) || [],
      newGalleryFiles: [],
    },
  });

  const { handleSubmit, getValues } = methods; // getValues para leer nombre en el modal

  // 2. MANEJO DEL SUBMIT
  const onSubmit = async (data: EditMaterialFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion);
      if (data.derivadoDe) formData.append("derivado_de", data.derivadoDe);
      formData.append("herramientas", JSON.stringify(data.herramientas));
      formData.append("composicion", JSON.stringify(data.composicion));
      formData.append("prop_mecanicas", JSON.stringify(data.mecanicas));
      formData.append("prop_perceptivas", JSON.stringify(data.perceptivas));
      formData.append("prop_emocionales", JSON.stringify(data.emocionales));

      const pasosPayload = data.pasos.map((s, i) => ({
        orden_paso: i + 1,
        descripcion: s.descripcion,
      }));
      formData.append("pasos", JSON.stringify(pasosPayload));

      data.pasos.forEach((step: any, i) => {
        if (step.newFile instanceof File) {
          formData.append(`paso_images[${i}]`, step.newFile);
        }
      });

      if (data.newGalleryFiles && data.newGalleryFiles.length > 0) {
        (data.newGalleryFiles as File[]).forEach((file) => {
          formData.append("galeria_images[]", file);
        });
      } else {
        const captions = data.galeria?.map((g) => g.caption || "") || [];
        formData.append("galeria_captions", JSON.stringify(captions));
      }

      const res = await updateMaterialAction(material.id, formData);

      if (res.success) {
        setSuccess(true); // <--- ACTIVAR MODAL DE ÉXITO
        // Opcional: toast.success("Material actualizado");
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
    console.log("Errores:", errors);
    toast.error("Revisa el formulario, hay campos inválidos.");
  };

  // Handler para el botón "Volver a Mis Materiales"
  const handleSuccessRedirect = () => {
    if (onSuccessClose) {
      onSuccessClose(); // Cierra el modal del padre
    } else {
      router.push("/user"); // Fallback si es página
    }
  };

  // 1. SI HUBO ÉXITO: Mostramos SOLO la tarjeta de éxito
  if (success) {
    return (
      <div className="flex justify-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="w-full max-w-md p-8 shadow-xl border bg-white text-center relative overflow-hidden rounded-2xl">
          {/* Decoración superior */}
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

  // 2. SI NO (ESTADO NORMAL): Mostramos el formulario
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
              <BasicInfoSection />
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
