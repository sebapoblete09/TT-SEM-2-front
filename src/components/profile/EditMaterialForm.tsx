"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner"; // O react-toastify
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // <--- IMPORTAR ESTO

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  X,
  Save,
  Loader2,
  Trash2,
  FlaskConical,
  Hammer,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";

// Types & Constants
import { Material } from "@/types/materials";
import { PROPERTY_OPTIONS } from "@/components/register-material/schemas";

// --- 1. ESQUEMA DE VALIDACIÓN (EDICIÓN) ---
const optionEnum = z.enum(["Baja", "Media", "Alta"]);

// Esquema flexible para imágenes: Puede ser String (URL existente) o File (Nueva) o Null
const imageSchema = z.union([z.string(), z.any(), z.null()]).optional();

const editSchema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  descripcion: z.string().min(10, "Mínimo 10 caracteres"),
  composicion: z.array(z.string()),
  herramientas: z.array(z.string()),

  // Galería (Mezcla de URLs y Files)
  galeria_imagenes: z.array(imageSchema),

  prop_mecanicas: z.object({
    resistencia: optionEnum,
    dureza: optionEnum,
    elasticidad: optionEnum,
    ductilidad: optionEnum,
    fragilidad: optionEnum,
  }),
  prop_perceptivas: z.object({
    color: z.string(),
    brillo: z.string(),
    textura: z.string(),
    transparencia: z.string(),
    sensacion_termica: z.string(),
  }),
  prop_emocionales: z.object({
    calidez_emocional: optionEnum,
    inspiracion: optionEnum,
    sostenibilidad_percibida: optionEnum,
    armonia: optionEnum,
    innovacion_emocional: optionEnum,
  }),

  pasos: z.array(
    z.object({
      id: z.number().optional(),
      orden_paso: z.number(),
      descripcion: z.string().min(5, "Descripción requerida"),
      url_imagen: imageSchema, // File o URL
    })
  ),
});

type EditFormValues = z.infer<typeof editSchema>;

interface EditMaterialFormProps {
  material: Material;
  onSuccess: () => void;
  access_token?: string; // Si lo tienes disponible, pásalo, si no, usa supabase client
}

export default function EditMaterialForm({
  material,
  onSuccess,
}: EditMaterialFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para inputs de listas
  const [newComp, setNewComp] = useState("");
  const [newTool, setNewTool] = useState("");

  // --- 2. CONFIGURACIÓN DEL FORMULARIO ---
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      nombre: material.nombre,
      descripcion: material.descripcion,
      composicion: material.composicion || [],
      herramientas: material.herramientas || [],
      // Mapeamos la galería existente
      galeria_imagenes: material.galeria?.map((g) => g.url_imagen) || [],

      prop_mecanicas: material.prop_mecanicas as any,
      prop_perceptivas: material.prop_perceptivas as any,
      prop_emocionales: material.prop_emocionales as any,

      pasos:
        material.pasos
          ?.sort((a, b) => a.orden_paso - b.orden_paso)
          .map((p) => ({
            id: p.ID,
            orden_paso: p.orden_paso,
            descripcion: p.descripcion,
            url_imagen: p.url_imagen, // Esto será un string (URL)
          })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pasos",
  });

  // --- 3. HELPER PARA PREVISUALIZAR IMÁGENES (File o URL) ---
  const getImageSrc = (fileOrUrl: any) => {
    if (!fileOrUrl) return null;
    if (typeof fileOrUrl === "string") return fileOrUrl; // Es URL existente
    if (fileOrUrl instanceof File) return URL.createObjectURL(fileOrUrl); // Es archivo nuevo
    return null;
  };

  // --- 4. MANEJADORES DE LISTAS ---
  const addToList = (
    field: "composicion" | "herramientas",
    value: string,
    resetFn: (v: string) => void
  ) => {
    if (!value.trim()) return;
    const currentList = form.getValues(field);
    if (!currentList.includes(value.trim())) {
      form.setValue(field, [...currentList, value.trim()], {
        shouldDirty: true,
      });
      resetFn("");
    }
  };

  const removeFromList = (
    field: "composicion" | "herramientas",
    index: number
  ) => {
    const currentList = form.getValues(field);
    const newList = currentList.filter((_, i) => i !== index);
    form.setValue(field, newList, { shouldDirty: true });
  };

  // --- 5. SUBMIT CON FORMDATA (Igual que Create) ---
  const onSubmit = async (values: EditFormValues) => {
    setIsSubmitting(true);
    try {
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
      // 1. Construir FormData
      const formData = new FormData();

      // Datos Simples
      formData.append("nombre", values.nombre);
      formData.append("descripcion", values.descripcion);

      // JSON Strings (Igual que en el Register)
      formData.append("composicion", JSON.stringify(values.composicion));
      formData.append("herramientas", JSON.stringify(values.herramientas));
      formData.append("prop_mecanicas", JSON.stringify(values.prop_mecanicas));
      formData.append(
        "prop_perceptivas",
        JSON.stringify(values.prop_perceptivas)
      );
      formData.append(
        "prop_emocionales",
        JSON.stringify(values.prop_emocionales)
      );

      // GALERÍA: Manejo Híbrido
      // Filtramos cuáles son URLs existentes y cuáles son nuevos Files
      const existingGallery = values.galeria_imagenes.filter(
        (img) => typeof img === "string"
      );
      const newGalleryFiles = values.galeria_imagenes.filter(
        (img) => img instanceof File
      );

      // Enviamos la lista de URLs que se deben MANTENER
      formData.append("existing_gallery_urls", JSON.stringify(existingGallery));

      // Enviamos los nuevos archivos
      newGalleryFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append("new_galeria_images[]", file);
        }
      });

      // PASOS: Manejo Híbrido
      // Preparamos el array de pasos para enviar como JSON (sin los objetos File)
      const pasosData = values.pasos.map((p) => ({
        id: p.id, // Si tiene ID, es update. Si no, es create.
        orden_paso: p.orden_paso,
        descripcion: p.descripcion,
        // Si es string, mandamos la URL para que el back sepa que se mantiene
        url_imagen: typeof p.url_imagen === "string" ? p.url_imagen : null,
      }));
      formData.append("pasos", JSON.stringify(pasosData));

      // Imágenes de Pasos (Nuevas)
      values.pasos.forEach((step, index) => {
        if (step.url_imagen instanceof File) {
          // Usamos el índice para que el back sepa a qué paso corresponde
          formData.append(`new_paso_images[${index}]`, step.url_imagen);
        }
      });

      // 2. Enviar al Backend
      const baseUrl =
        process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";

      // Necesitas obtener el token de sesión aquí si no lo pasas por props
      // const { data: { session } } = await supabase.auth.getSession();
      // const token = session?.access_token;

      const response = await fetch(`${baseUrl}/materials/${material.id}`, {
        method: "PUT",
        headers: {
          // IMPORTANTE: NO agregues "Content-Type".
          // fetch detecta FormData y pone "multipart/form-data; boundary=..." automáticamente.

          // Agregamos el token aquí:
          Authorization: `Bearer ${accessToken}`,
        },
        // headers: { Authorization: `Bearer ${token}` }, // NO poner Content-Type, fetch lo pone auto con boundary
        body: formData,
      });

      if (!response.ok) throw new Error("Error al actualizar material");

      toast.success("Material actualizado correctamente");
      router.refresh();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar cambios");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Renderizado de Selects (Reutilizable) ---
  const renderPropSelect = (cat: any, name: string, label: string) => (
    <FormField
      control={form.control}
      name={`${cat}.${name}` as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs uppercase text-slate-500 font-bold">
            {label}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-slate-50">
                <SelectValue placeholder="-" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {PROPERTY_OPTIONS.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <Tabs defaultValue="basico" className="w-full flex-1 flex flex-col">
          <div className="px-6 border-b sticky top-0 bg-white z-10 pt-2">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-6">
              <TabsTrigger
                value="basico"
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none px-0 pb-2"
              >
                Básico
              </TabsTrigger>
              <TabsTrigger
                value="propiedades"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 pb-2"
              >
                Propiedades
              </TabsTrigger>
              <TabsTrigger
                value="pasos"
                className="data-[state=active]:border-b-2 data-[state=active]:border-teal-600 rounded-none px-0 pb-2"
              >
                Receta
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB BÁSICO */}
            <TabsContent value="basico" className="space-y-6 mt-0">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Listas (Composición / Herramientas) - Igual que antes ... */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* ... (Tu código de listas va aquí, es igual al anterior) ... */}
                {/* Solo recuerda usar addToList y removeFromList */}
                <div className="space-y-3">
                  <FormLabel>Composición</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newComp}
                      onChange={(e) => setNewComp(e.target.value)}
                      className="h-9"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        addToList("composicion", newComp, setNewComp)
                      }
                    >
                      <Plus className="w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch("composicion").map((c, i) => (
                      <Badge key={i} variant="secondary">
                        {c}{" "}
                        <X
                          className="w-3 ml-1 cursor-pointer"
                          onClick={() => removeFromList("composicion", i)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* GALERÍA (Edición) */}
              <div className="space-y-3">
                <FormLabel>Galería de Imágenes</FormLabel>
                <div className="grid grid-cols-4 gap-4">
                  {form.watch("galeria_imagenes").map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square border rounded-lg overflow-hidden group"
                    >
                      {/* Usamos el helper para mostrar URL o Blob */}
                      <Image
                        src={getImageSrc(img) || ""}
                        alt="preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const current = form.getValues("galeria_imagenes");
                            form.setValue(
                              "galeria_imagenes",
                              current.filter((_, idx) => idx !== i)
                            );
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <label className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 aspect-square">
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                    <span className="text-xs text-slate-500 mt-1">Agregar</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          const newFiles = Array.from(e.target.files);
                          const current = form.getValues("galeria_imagenes");
                          form.setValue("galeria_imagenes", [
                            ...current,
                            ...newFiles,
                          ]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </TabsContent>

            {/* TAB PROPIEDADES */}
            <TabsContent value="propiedades" className="space-y-8 mt-0">
              {/* ... (Igual que en el código anterior, usa renderPropSelect) ... */}
              <div className="grid grid-cols-2 gap-4">
                {renderPropSelect(
                  "prop_mecanicas",
                  "resistencia",
                  "Resistencia"
                )}
                {/* ... resto de selects ... */}
              </div>
            </TabsContent>

            {/* TAB RECETA */}
            <TabsContent value="pasos" className="space-y-6 mt-0">
              <div className="flex justify-between">
                <h4 className="font-semibold">Pasos</h4>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    append({
                      orden_paso: fields.length + 1,
                      descripcion: "",
                      url_imagen: null,
                    })
                  }
                >
                  <Plus className="w-4 mr-2" /> Agregar
                </Button>
              </div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 p-4 border rounded-lg bg-slate-50"
                >
                  <span className="font-bold text-slate-400">#{index + 1}</span>
                  <div className="flex-1 space-y-3">
                    <FormField
                      control={form.control}
                      name={`pasos.${index}.descripcion`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Input de Imagen por Paso */}
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 border rounded bg-white overflow-hidden">
                        {/* Mostrar imagen existente o nueva */}
                        {form.watch(`pasos.${index}.url_imagen`) ? (
                          <Image
                            src={
                              getImageSrc(
                                form.watch(`pasos.${index}.url_imagen`)
                              ) || ""
                            }
                            alt="step"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 m-auto text-slate-300 relative top-4" />
                        )}
                      </div>
                      <Input
                        type="file"
                        className="w-full"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            form.setValue(`pasos.${index}.url_imagen`, file);
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </TabsContent>
          </div>

          <div className="border-t p-4 flex justify-end gap-3 bg-white sticky bottom-0 z-10">
            <Button type="button" variant="ghost" onClick={onSuccess}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-green-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </Tabs>
      </form>
    </Form>
  );
}
