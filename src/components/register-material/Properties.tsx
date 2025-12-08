"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Importamos el esquema y las opciones desde tu archivo de schemas
import {
  propertiesSchema,
  PropertiesFormValues,
  PROPERTY_OPTIONS,
} from "./schemas";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Activity,
  Eye,
  Heart,
  Layers,
  ArrowRight,
} from "lucide-react";

// Mantenemos la interfaz de datos del padre
export interface PropertiesData {
  mecanicas: Record<string, string>;
  perceptivas: Record<string, string>;
  emocionales: Record<string, string>;
}

interface PropertiesFormProps {
  data: PropertiesData;
  setData: React.Dispatch<React.SetStateAction<PropertiesData>>;
  onNext: () => void;
  onBack: () => void;
}

export default function PropertiesForm({
  data,
  setData,
  onNext,
  onBack,
}: PropertiesFormProps) {
  // 1. Inicializamos el formulario
  const form = useForm<PropertiesFormValues>({
    resolver: zodResolver(propertiesSchema),
    // 'as any' ayuda a TypeScript a mapear el objeto inicial sin conflictos estrictos
    defaultValues: data as any,
    mode: "onChange",
  });

  // 2. Sincronización si el usuario vuelve atrás (Rellena el form con lo guardado)
  useEffect(() => {
    form.reset(data as any);
  }, [data, form]);

  // 3. Manejo del Submit
  const handleNextStep = async () => {
    // Dispara la validación de TODOS los campos
    const isValid = await form.trigger();

    if (isValid) {
      const values = form.getValues();
      // Guardamos en el estado global del Wizard
      setData(values as unknown as PropertiesData);
      onNext();
    }
  };

  // --- HELPER 1: SELECTS (Controlados por React Hook Form) ---
  const renderSelects = (
    categoria: "mecanicas" | "emocionales",
    props: { label: string; key: string }[]
  ) =>
    props.map((prop) => {
      // Nombre del campo para Zod (ej: "mecanicas.resistencia")
      const fieldName = `${categoria}.${prop.key}` as any;

      return (
        <div key={prop.key} className="space-y-2">
          <Label
            className={`text-xs font-semibold uppercase tracking-wide ${
              // CORRECCIÓN AQUÍ:
              (form.formState.errors[categoria] as any)?.[prop.key]
                ? "text-red-500"
                : "text-slate-500"
            }`}
          >
            {prop.label}
          </Label>

          {/* El Controller conecta componentes UI complejos (como Select) con Hook Form */}
          <Controller
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={`h-11 transition-all ${
                    (form.formState.errors[categoria] as any)?.[prop.key]
                      ? "border-red-500 focus:ring-red-500 bg-red-50/10"
                      : "bg-slate-50 border-slate-200 focus:ring-blue-500"
                  }`}
                >
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  {/* Usamos las constantes importadas del schema */}
                  {PROPERTY_OPTIONS.map((op) => (
                    <SelectItem key={op} value={op} className="cursor-pointer">
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {/* Mensaje de error */}
          {(form.formState.errors[categoria] as any)?.[prop.key] && (
            <p className="text-xs text-red-500 font-medium animate-in fade-in">
              {(form.formState.errors[categoria] as any)?.[prop.key]?.message ||
                "Selecciona una opción válida"}
            </p>
          )}
        </div>
      );
    });

  // --- HELPER 2: TEXTAREAS (Conectados con register) ---
  const renderTextareas = (
    categoria: "perceptivas",
    props: { label: string; key: string }[]
  ) =>
    props.map((prop) => {
      const fieldName = `${categoria}.${prop.key}` as any;

      return (
        <div key={prop.key} className="space-y-2">
          <Label
            className={`text-xs font-semibold uppercase tracking-wide ${
              (form.formState.errors[categoria] as any)?.[prop.key]
                ? "text-red-500"
                : "text-slate-500"
            }`}
          >
            {prop.label}
          </Label>

          <Textarea
            {...form.register(fieldName)}
            placeholder={`Describe la ${prop.label.toLowerCase()}...`}
            rows={2}
            className={`resize-none min-h-[5rem] transition-all ${
              (form.formState.errors[categoria] as any)?.[prop.key]
                ? "border-red-500 focus-visible:ring-red-500 bg-red-50/10"
                : "bg-slate-50 border-slate-200 focus-visible:ring-purple-500"
            }`}
          />

          {/* Mensaje de error */}
          {(form.formState.errors[categoria] as any)?.[prop.key] && (
            <p className="text-xs text-red-500 font-medium animate-in fade-in">
              {(form.formState.errors[categoria] as any)?.[prop.key]?.message}
            </p>
          )}
        </div>
      );
    });

  return (
    <Card className="border-2 border-slate-500/30 shadow-2xl shadow-slate-200/60 bg-white rounded-2xl overflow-hidden">
      {/* HEADER */}
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
            <Layers className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-800">
            Propiedades del Material
          </CardTitle>
        </div>
        <CardDescription className="text-slate-500 ml-12">
          Define las características técnicas y sensoriales para clasificar tu
          biomaterial.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-10 p-6 md:p-8">
        {/* 1. PROPIEDADES MECÁNICAS (Selects) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-blue-700 border-b border-blue-100 pb-2">
            <Activity className="w-5 h-5" />
            <h3 className="font-bold text-lg">Propiedades Mecánicas</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
            {renderSelects("mecanicas", [
              { label: "Resistencia", key: "resistencia" },
              { label: "Dureza", key: "dureza" },
              { label: "Elasticidad", key: "elasticidad" },
              { label: "Ductilidad", key: "ductilidad" },
              { label: "Fragilidad", key: "fragilidad" },
            ])}
          </div>
        </section>

        {/* 2. PROPIEDADES PERCEPTIVAS (Textareas) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-purple-700 border-b border-purple-100 pb-2">
            <Eye className="w-5 h-5" />
            <h3 className="font-bold text-lg">Propiedades Perceptivas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {renderTextareas("perceptivas", [
              { label: "Color", key: "color" },
              { label: "Brillo", key: "brillo" },
              { label: "Textura", key: "textura" },
              { label: "Transparencia", key: "transparencia" },
              { label: "Sensación Térmica", key: "sensacion_termica" },
            ])}
          </div>
        </section>

        {/* 3. PROPIEDADES EMOCIONALES (Selects) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-rose-600 border-b border-rose-100 pb-2">
            <Heart className="w-5 h-5" />
            <h3 className="font-bold text-lg">Propiedades Emocionales</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
            {renderSelects("emocionales", [
              { label: "Calidez", key: "calidez_emocional" },
              { label: "Inspiración", key: "inspiracion" },
              { label: "Sostenibilidad", key: "sostenibilidad_percibida" },
              { label: "Armonía", key: "armonia" },
              { label: "Innovación", key: "innovacion_emocional" },
            ])}
          </div>
        </section>

        {/* BOTONES DE NAVEGACIÓN */}
        <div className="flex justify-between pt-8 border-t border-slate-100">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Volver
          </Button>

          {/* El botón ahora llama a handleNextStep para validar */}
          <Button
            onClick={handleNextStep}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/10 group"
          >
            Continuar
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
