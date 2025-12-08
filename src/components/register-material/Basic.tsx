"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  X,
  Upload,
  ArrowRight,
  ImageIcon,
  Users,
  Hammer,
  Leaf,
} from "lucide-react";
import { BasicInfoData } from "@/types/materials";

// IMPORTAMOS EL ESQUEMA Y EL TIPO DESDE EL ARCHIVO EXTERNO
import { basicInfoSchema, BasicInfoFormValues } from "./schemas";

interface BasicInfoFormProps {
  data: BasicInfoData;
  setData: React.Dispatch<React.SetStateAction<BasicInfoData>>;
  onNext: () => void;
}

export default function BasicInfoForm({
  data,
  setData,
  onNext,
}: BasicInfoFormProps) {
  const [herramienta, setHerramienta] = useState("");
  const [colaborador, setColaborador] = useState("");

  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema), // Usamos el esquema importado
    defaultValues: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      derivadoDe: data.derivadoDe || "",
      herramientas: data.herramientas,
      imagenes: data.imagenes,
    },
    mode: "onChange",
  });

  // Sincronizar Herramientas
  useEffect(() => {
    form.setValue("herramientas", data.herramientas, {
      // TRUCO: Solo valida si la lista TIENE algo.
      // Si está vacía (carga inicial), no valida para no asustar al usuario.
      shouldValidate: data.herramientas.length > 0,
      shouldDirty: true,
    });
  }, [data.herramientas, form]);

  // Sincronizar Imágenes
  useEffect(() => {
    form.setValue("imagenes", data.imagenes, {
      // Lo mismo aquí: solo valida si ya subiste al menos una foto
      shouldValidate: data.imagenes.length > 0,
      shouldDirty: true,
    });
  }, [data.imagenes, form]);

  useEffect(() => {
    form.reset({
      nombre: data.nombre,
      descripcion: data.descripcion,
      derivadoDe: data.derivadoDe || "",
      herramientas: data.herramientas,
      imagenes: data.imagenes,
    });
  }, [data, form]);

  // --- LÓGICA DE AVANCE ---
  const handleNextStep = async () => {
    const isValid = await form.trigger();

    if (isValid) {
      const formValues = form.getValues();
      setData((prev) => ({
        ...prev,
        nombre: formValues.nombre,
        descripcion: formValues.descripcion,
        derivadoDe: formValues.derivadoDe || "",
      }));
      onNext();
    }
  };

  // 📸 Manejo de imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileList = Array.from(files);

    const currentValues = form.getValues();

    setData((prev) => ({
      ...prev,
      nombre: currentValues.nombre,
      descripcion: currentValues.descripcion,
      // CORRECCIÓN: Agregamos || "" para evitar undefined
      derivadoDe: currentValues.derivadoDe || "",
      imagenes: [...prev.imagenes, ...fileList],
    }));
  };

  const removeImage = (index: number) => {
    const currentValues = form.getValues();

    setData((prev) => ({
      ...prev,
      nombre: currentValues.nombre,
      descripcion: currentValues.descripcion,
      // CORRECCIÓN AQUÍ TAMBIÉN
      derivadoDe: currentValues.derivadoDe || "",
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const addHerramienta = () => {
    if (herramienta.trim() && !data.herramientas.includes(herramienta)) {
      const currentValues = form.getValues();

      setData((prev) => ({
        ...prev,
        nombre: currentValues.nombre,
        descripcion: currentValues.descripcion,
        // CORRECCIÓN
        derivadoDe: currentValues.derivadoDe || "",
        herramientas: [...prev.herramientas, herramienta],
      }));
      setHerramienta("");
    }
  };

  const removeHerramienta = (item: string) => {
    const currentValues = form.getValues();

    setData((prev) => ({
      ...prev,
      nombre: currentValues.nombre,
      descripcion: currentValues.descripcion,
      // CORRECCIÓN
      derivadoDe: currentValues.derivadoDe || "",
      herramientas: prev.herramientas.filter((h) => h !== item),
    }));
  };

  const addColaborador = () => {
    if (colaborador.trim() && !data.colaboradores.includes(colaborador)) {
      setData((prev) => ({
        ...prev,
        colaboradores: [...prev.colaboradores, colaborador],
      }));
      setColaborador("");
    }
  };

  const removeColaborador = (item: string) => {
    setData((prev) => ({
      ...prev,
      colaboradores: prev.colaboradores.filter((c) => c !== item),
    }));
  };

  return (
    <Card className="border-2 border-slate-500/30 shadow-2xl shadow-slate-200/60 bg-white rounded-2xl overflow-hidden">
      {/* HEADER CON DECORACIÓN */}
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 rounded-lg text-green-700">
            <Leaf className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-800">
            Información Básica
          </CardTitle>
        </div>
        <CardDescription className="text-slate-500 ml-12">
          Comencemos con los detalles fundamentales de tu biomaterial.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 p-6 md:p-8">
        {/* 1. DATOS PRINCIPALES */}
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">
              Nombre del Material <span className="text-red-500">*</span>
            </Label>
            <Input
              {...form.register("nombre")} // <--- AQUÍ ESTÁ LA MAGIA
              placeholder="Ej: Bioplástico de cáscara de naranja"
              className={`h-12 bg-slate-50 border-slate-200 transition-all ${
                form.formState.errors.nombre
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-green-500"
              }`}
            />
            {/* Mostrar mensaje de error si existe */}
            {form.formState.errors.nombre && (
              <p className="text-xs text-red-500 font-medium animate-in slide-in-from-left-1">
                {form.formState.errors.nombre.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              {...form.register("descripcion")} // <--- CONEXIÓN
              rows={4}
              placeholder="Describe sus características..."
              className={`bg-slate-50 border-slate-200 resize-none transition-all ${
                form.formState.errors.descripcion
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-green-500"
              }`}
            />
            {form.formState.errors.descripcion && (
              <p className="text-xs text-red-500 font-medium animate-in slide-in-from-left-1">
                {form.formState.errors.descripcion.message}
              </p>
            )}
          </div>
        </div>

        {/* SEPARADOR */}
        <div className="h-px bg-slate-100 w-full" />

        {/* 2. LISTAS DINÁMICAS (Herramientas y Colaboradores) */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Herramientas */}
          {/* 3. ZONA DE HERRAMIENTAS CON ERROR VISUAL */}
          {/* Herramientas */}
          <div className="space-y-3">
            <Label
              className={`font-medium flex items-center gap-2 ${
                form.formState.errors.herramientas
                  ? "text-red-500"
                  : "text-slate-700"
              }`}
            >
              <Hammer className="w-4 h-4" /> Herramientas{" "}
              <span className="text-red-500">*</span>
            </Label>

            {/* 1. INPUT + BOTÓN (Arriba para facilitar la entrada) */}
            <div className="flex gap-2">
              <Input
                value={herramienta}
                onChange={(e) => setHerramienta(e.target.value)}
                placeholder="Escribe una herramienta y presiona Enter..."
                className={`bg-white border-slate-200 focus-visible:ring-green-500 ${
                  form.formState.errors.herramientas
                    ? "border-red-300 focus-visible:ring-red-500"
                    : ""
                }`}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addHerramienta())
                }
              />
              <Button
                type="button"
                onClick={addHerramienta}
                size="icon"
                className="bg-slate-900 hover:bg-slate-800 shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* 2. MENSAJE DE ERROR (Debajo del input, limpio) */}
            {form.formState.errors.herramientas && (
              <p className="text-xs text-red-500 font-medium animate-in slide-in-from-left-1">
                {form.formState.errors.herramientas.message}
              </p>
            )}

            {/* 3. LISTA DE HERRAMIENTAS (Contenedor visual) */}
            <div
              className={`flex flex-wrap gap-2 p-3 rounded-lg border min-h-[3.5rem] transition-colors ${
                data.herramientas.length === 0
                  ? "border-dashed border-slate-200 bg-slate-50/50 justify-center items-center"
                  : "border-solid border-slate-100 bg-white"
              }`}
            >
              {data.herramientas.length === 0 && (
                <span className="text-sm text-slate-400">
                  Las herramientas agregadas aparecerán aquí
                </span>
              )}

              {data.herramientas.map((h: string) => (
                <Badge
                  key={h}
                  variant="secondary"
                  className="bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-100 pl-3 pr-1 py-1 rounded-full transition-colors"
                >
                  {h}
                  <button
                    onClick={() => removeHerramienta(h)}
                    className="ml-2 p-0.5 hover:bg-amber-200 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Colaboradores */}
          <div className="space-y-3">
            <Label className="text-slate-700 font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" /> Colaboradores
              (opcional)
            </Label>
            <div className="flex gap-2">
              <Input
                value={colaborador}
                onChange={(e) => setColaborador(e.target.value)}
                placeholder="Id del usuario..."
                className="bg-white border-slate-200 focus-visible:ring-green-500"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addColaborador())
                }
              />
              <Button
                type="button"
                onClick={addColaborador}
                size="icon"
                className="bg-slate-900 hover:bg-slate-800 shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {data.colaboradores.length === 0 && (
                <span className="text-xs text-slate-400 italic">
                  Sin colaboradores extra
                </span>
              )}
              {data.colaboradores.map((c: string) => (
                <Badge
                  key={c}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-100 pl-3 pr-1 py-1 rounded-full transition-colors"
                >
                  {c}
                  <button
                    onClick={() => removeColaborador(c)}
                    className="ml-2 p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Derivado De (Campo simple opcional) */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <Label className="text-slate-700 font-medium text-sm">
            ¿Derivado de otro material? (Opcional)
          </Label>
          <Input
            {...form.register("derivadoDe")} // <--- CONEXIÓN
            placeholder="ID o nombre del material base"
            className="mt-2 bg-white border-slate-200 focus-visible:ring-green-500"
          />
        </div>

        {/* 3. ZONA DE IMÁGENES (Upload Mejorado) */}
        <div className="space-y-4">
          <Label className="text-slate-700 font-medium flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-slate-400" /> Galería de Imágenes
          </Label>

          <div
            className={`border-2 border-dashed rounded-xl p-8 transition-all text-center relative group cursor-pointer ${
              form.formState.errors.imagenes
                ? "border-red-200 bg-red-50 hover:bg-red-100/50" // Estilo de error
                : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-green-400"
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
              <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-green-700">
                  Haz clic para subir
                </span>{" "}
                o arrastra tus fotos aquí
              </div>
              <p className="text-xs text-slate-400">PNG, JPG hasta 5MB</p>
            </div>
          </div>

          {/* Grid de Previsualización */}
          {data.imagenes.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-2">
              {data.imagenes.map((img: File, i: number) => (
                <div
                  key={i}
                  className="relative group aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${i}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTÓN SIGUIENTE */}
        <div className="flex justify-end pt-6 border-t border-slate-100">
          <Button
            onClick={handleNextStep} // <--- CAMBIAR 'onNext' POR 'handleNextStep'
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/10 group"
          >
            Siguiente Paso
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
