"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner"; // O react-toastify
import { useRouter } from "next/navigation";
import { EditSuccess } from "../ui/editConfirmation";

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
import { updateMaterialService } from "@/services/materialServices";

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
}

export default function EditMaterialForm({
  material,
  onSuccess,
}: EditMaterialFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

  // --- 4. MANEJADORES DE LISTAS (CORREGIDOS) ---

  const addToList = (
    field: "composicion" | "herramientas",
    value: string,
    resetFn: (v: string) => void
  ) => {
    // 1. Limpieza básica
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    // 2. Obtener lista actual de forma segura
    const currentList = form.getValues(field) || [];

    // 3. Validar duplicados (case insensitive opcional)
    if (!currentList.includes(trimmedValue)) {
      const newList = [...currentList, trimmedValue];

      // 4. Actualizar RHF forzando validación y dirty state
      form.setValue(field, newList, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      // 5. Limpiar input
      resetFn("");
    }
  };

  const removeFromList = (
    field: "composicion" | "herramientas",
    indexToRemove: number
  ) => {
    // 1. Obtener lista actual
    const currentList = form.getValues(field) || [];

    // 2. Filtrar
    const newList = currentList.filter((_, index) => index !== indexToRemove);

    // 3. Actualizar RHF
    form.setValue(field, newList, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  // --- 5. SUBMIT CON FORMDATA (Igual que Create) ---
  const onSubmit = async (values: EditFormValues) => {
    setIsSubmitting(true);
    try {
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

      // 1. Filtrar URLs existentes (Strings)
      // Importante: Asegurarse de que sean strings y no null/undefined
      const existingGallery = values.galeria_imagenes.filter(
        (img) => typeof img === "string" && img.length > 0
      );

      // 2. Filtrar Nuevos Archivos (File objects)
      const newGalleryFiles = values.galeria_imagenes.filter(
        (img) => img instanceof File
      );
      // 3. Append URLs existentes como JSON string
      // El backend debe esperar este campo y usarlo para NO borrar estas fotos
      formData.append("existing_gallery_urls", JSON.stringify(existingGallery));

      // 4. Append Nuevos Archivos (binarios)
      newGalleryFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append("new_galeria_images[]", file);
        }
      });

      // PASOS: Manejo Híbrido
      // Preparamos el array de pasos para enviar como JSON (sin los objetos File)
      const pasosData = values.pasos.map((p) => ({
        id: p.id,
        orden_paso: p.orden_paso,
        descripcion: p.descripcion,
        // Si es string (URL vieja), la mandamos. Si es File (nueva), mandamos null en el JSON
        url_imagen: typeof p.url_imagen === "string" ? p.url_imagen : null,
      }));

      formData.append("pasos", JSON.stringify(pasosData));

      // Imágenes de Pasos (Nuevas)
      values.pasos.forEach((step, index) => {
        if (step.url_imagen instanceof File) {
          // Usamos una clave que el backend pueda mapear al índice del paso
          // Ejemplo: paso_images[0], paso_images[1]...
          formData.append(`new_paso_images[${index}]`, step.url_imagen);
        }
      });

      await updateMaterialService(material.id, formData);

      setShowSuccessMessage(true);
    } catch (error) {
      console.error(error);
      toast.error("Hubo un problema al guardar los cambios");
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
  if (showSuccessMessage) {
    return <EditSuccess onClose={onSuccess} />;
  }
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
                  {/* Ejemplo para Composición (hacer igual para Herramientas) */}
                  <div className="flex flex-wrap gap-2">
                    {/* Usamos form.watch() para asegurar que la UI se actualice al instante */}
                    {form.watch("composicion").map((c, i) => (
                      <Badge
                        key={`${c}-${i}`}
                        variant="secondary"
                        className="gap-1 pr-1 pl-3 py-1"
                      >
                        {c}
                        <button
                          type="button" // IMPORTANTE: Evita submit accidental
                          className="ml-1 hover:bg-slate-200 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                          onClick={(e) => {
                            e.preventDefault(); // Evita recargas
                            e.stopPropagation(); // Evita clicks en el padre
                            removeFromList("composicion", i);
                          }}
                        >
                          <X className="w-3 h-3 text-slate-500 hover:text-red-600" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <FormLabel>Herramientas</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      className="h-9"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        addToList("herramientas", newTool, setNewTool)
                      }
                    >
                      <Plus className="w-4" />
                    </Button>
                  </div>
                  {/* Ejemplo para Composición (hacer igual para Herramientas) */}
                  <div className="flex flex-wrap gap-2">
                    {/* Usamos form.watch() para asegurar que la UI se actualice al instante */}
                    {form.watch("herramientas").map((c, i) => (
                      <Badge
                        key={`${c}-${i}`}
                        variant="secondary"
                        className="gap-1 pr-1 pl-3 py-1"
                      >
                        {c}
                        <button
                          type="button" // IMPORTANTE: Evita submit accidental
                          className="ml-1 hover:bg-slate-200 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                          onClick={(e) => {
                            e.preventDefault(); // Evita recargas
                            e.stopPropagation(); // Evita clicks en el padre
                            removeFromList("herramientas", i);
                          }}
                        >
                          <X className="w-3 h-3 text-slate-500 hover:text-red-600" />
                        </button>
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
                        if (e.target.files && e.target.files.length > 0) {
                          const newFiles = Array.from(e.target.files);
                          const current =
                            form.getValues("galeria_imagenes") || []; // Asegurar array

                          // Validar duplicados si es necesario, o simplemente agregar
                          form.setValue(
                            "galeria_imagenes",
                            [...current, ...newFiles],
                            {
                              shouldDirty: true,
                              shouldValidate: true,
                            }
                          );

                          // Limpiar el input para permitir subir el mismo archivo si se borró
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </TabsContent>

            {/* TAB PROPIEDADES */}
            {/* TAB PROPIEDADES */}
            <TabsContent value="propiedades" className="space-y-8 mt-0">
              {/* 1. Propiedades Mecánicas (Selects) */}
              <div className="space-y-4">
                <h4 className="font-semibold text-blue-700 border-b pb-2">
                  Mecánicas
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {renderPropSelect(
                    "prop_mecanicas",
                    "resistencia",
                    "Resistencia"
                  )}
                  {renderPropSelect("prop_mecanicas", "dureza", "Dureza")}
                  {renderPropSelect(
                    "prop_mecanicas",
                    "elasticidad",
                    "Elasticidad"
                  )}
                  {renderPropSelect(
                    "prop_mecanicas",
                    "ductilidad",
                    "Ductilidad"
                  )}
                  {renderPropSelect(
                    "prop_mecanicas",
                    "fragilidad",
                    "Fragilidad"
                  )}
                </div>
              </div>

              {/* 2. Propiedades Sensoriales/Perceptivas (Textareas) */}
              <div className="space-y-4">
                <h4 className="font-semibold text-purple-700 border-b pb-2">
                  Sensoriales
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Mapeamos los campos de texto manualmente */}
                  {[
                    { name: "color", label: "Color" },
                    { name: "brillo", label: "Brillo" },
                    { name: "textura", label: "Textura" },
                    { name: "transparencia", label: "Transparencia" },
                    { name: "sensacion_termica", label: "Sensación Térmica" },
                  ].map((prop) => (
                    <FormField
                      key={prop.name}
                      control={form.control}
                      name={`prop_perceptivas.${prop.name}` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase text-slate-500 font-bold">
                            {prop.label}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={2}
                              className="bg-slate-50 min-h-[60px] resize-none"
                              placeholder={`Describe la ${prop.label.toLowerCase()}...`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* 3. Propiedades Emocionales (Selects) */}
              <div className="space-y-4">
                <h4 className="font-semibold text-rose-700 border-b pb-2">
                  Emocionales
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {renderPropSelect(
                    "prop_emocionales",
                    "calidez_emocional",
                    "Calidez"
                  )}
                  {renderPropSelect(
                    "prop_emocionales",
                    "inspiracion",
                    "Inspiración"
                  )}
                  {renderPropSelect(
                    "prop_emocionales",
                    "sostenibilidad_percibida",
                    "Sostenibilidad"
                  )}
                  {renderPropSelect("prop_emocionales", "armonia", "Armonía")}
                  {renderPropSelect(
                    "prop_emocionales",
                    "innovacion_emocional",
                    "Innovación"
                  )}
                </div>
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
