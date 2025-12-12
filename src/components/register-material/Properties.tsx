"use client";

import { useFormContext, Controller, FieldError } from "react-hook-form"; // <--- Agrega FieldError
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

// Importamos el esquema y tipo global
import { PROPERTY_OPTIONS, RegisterMaterialFormValues } from "./schemas";

interface PropertiesFormProps {
  onNext: () => void;
  onBack: () => void;
  // Ya no recibe data ni setData
}

export default function PropertiesForm({
  onNext,
  onBack,
}: PropertiesFormProps) {
  // Conectamos al contexto global
  const {
    control,
    register,
    formState: { errors },
    trigger,
  } = useFormContext<RegisterMaterialFormValues>();

  // Manejo del avance (Valida solo los campos de propiedades)
  const handleNextStep = async () => {
    // Validamos las 3 categorías
    const isValid = await trigger(["mecanicas", "perceptivas", "emocionales"]);

    if (isValid) {
      onNext();
    }
  };

  // --- HELPER 1: SELECTS (Controlados con Controller) ---
  const renderSelects = (
    categoria: "mecanicas" | "emocionales",
    props: { label: string; key: string }[]
  ) =>
    props.map((prop) => {
      // Tipado dinámico para acceder a errores anidados
      const error = (errors[categoria] as any)?.[prop.key] as
        | FieldError
        | undefined;
      // Nombre del campo completo (ej: "mecanicas.resistencia")
      const fieldName = `${categoria}.${prop.key}` as any;

      return (
        <div key={prop.key} className="space-y-2">
          <Label
            className={`text-xs font-semibold uppercase tracking-wide ${
              error ? "text-red-500" : "text-slate-500"
            }`}
          >
            {prop.label}
          </Label>

          <Controller
            control={control}
            name={fieldName}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={`h-11 transition-all ${
                    error
                      ? "border-red-500 focus:ring-red-500 bg-red-50/10"
                      : "bg-slate-50 border-slate-200 focus:ring-blue-500"
                  }`}
                >
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_OPTIONS.map((op) => (
                    <SelectItem key={op} value={op} className="cursor-pointer">
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {error && (
            <p className="text-xs text-red-500 font-medium animate-in fade-in">
              {error.message || "Selecciona una opción válida"}
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
      const error = (errors[categoria] as any)?.[prop.key] as
        | FieldError
        | undefined;
      const fieldName = `${categoria}.${prop.key}` as any;

      return (
        <div key={prop.key} className="space-y-2">
          <Label
            className={`text-xs font-semibold uppercase tracking-wide ${
              error ? "text-red-500" : "text-slate-500"
            }`}
          >
            {prop.label}
          </Label>

          <Textarea
            {...register(fieldName)}
            placeholder={`Describe la ${prop.label.toLowerCase()}...`}
            rows={2}
            className={`resize-none min-h-[5rem] transition-all ${
              error
                ? "border-red-500 focus-visible:ring-red-500 bg-red-50/10"
                : "bg-slate-50 border-slate-200 focus-visible:ring-purple-500"
            }`}
          />

          {error && (
            <p className="text-xs text-red-500 font-medium animate-in fade-in">
              {error.message}
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

          <Button
            onClick={handleNextStep} // Valida y avanza
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
