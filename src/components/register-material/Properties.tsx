"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Activity,
  Eye,
  Heart,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  LucideIcon,
} from "lucide-react";

import { RegisterMaterialFormValues } from "./schemas";

interface PropertiesFormProps {
  onNext: () => void;
  onBack: () => void;
}

// --- SUB-COMPONENTE PARA CADA SECCIÓN (Mecánica, Perceptiva, Emocional) ---
interface PropertySectionProps {
  name: "mecanicas" | "perceptivas" | "emocionales"; // Nombre en el schema
  title: string;
  icon: LucideIcon;
  iconColor: string; // Ej: "text-blue-700 bg-blue-100"
  isNumeric?: boolean; // Si es true, muestra input de unidad y valida números
}

const PropertySection = ({
  name,
  title,
  icon: Icon,
  iconColor,
  isNumeric = false,
}: PropertySectionProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<RegisterMaterialFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  // Acceso seguro a errores de arrays (puede ser undefined)
  const sectionErrors = errors[name] as any;

  return (
    <section className="space-y-4">
      {/* Título de la Sección */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className={`flex items-center gap-2 ${iconColor.split(" ")[0]}`}>
          <Icon className="w-5 h-5" />
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            append(
              isNumeric
                ? ({ nombre: "", valor: "", unidad: "" } as any)
                : ({ nombre: "", valor: "" } as any)
            )
          }
          className="text-slate-500 hover:text-green-600 hover:bg-green-50"
        >
          <Plus className="w-4 h-4 mr-1" /> Añadir
        </Button>
      </div>

      {/* Lista de Campos */}
      <div className="space-y-3">
        {fields.length === 0 && (
          <p className="text-sm text-slate-400 italic py-2">
            No has añadido propiedades {title.toLowerCase()}.
          </p>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-50 p-3 rounded-lg border border-slate-100"
          >
            {/* Input: NOMBRE (Ej: Resistencia) */}
            <div className="flex-1 w-full">
              <Label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">
                Propiedad
              </Label>
              <Input
                placeholder="Ej: Resistencia"
                {...register(`${name}.${index}.nombre` as any)}
                className={`bg-white h-9 ${
                  sectionErrors?.[index]?.nombre ? "border-red-500" : ""
                }`}
              />
            </div>

            {/* Input: VALOR */}
            <div className="flex-1 w-full">
              <Label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">
                Valor {isNumeric ? "(Texto/Núm)" : "(Texto)"}
              </Label>
              <Input
                // CAMBIO: Siempre texto, para que coincida con el schema string
                type="text"
                // CAMBIO: Quitamos step y placeholder numérico estricto
                placeholder={isNumeric ? "Ej: 10 o 10-20" : "Descripción..."}
                {...register(`${name}.${index}.valor` as any)}
                className={`bg-white h-9 ${
                  sectionErrors?.[index]?.valor ? "border-red-500" : ""
                }`}
              />
            </div>

            {/* Input: UNIDAD (Solo para mecánicas) */}
            {isNumeric && (
              <div className="w-full md:w-24">
                <Label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">
                  Unidad
                </Label>
                <Input
                  placeholder="Ej: MPa"
                  {...register(`${name}.${index}.unidad` as any)}
                  className="bg-white h-9"
                />
              </div>
            )}

            {/* Botón Eliminar */}
            <div className="pt-6 md:pt-0 self-end md:self-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-9 w-9"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Mostrar errores genéricos de validación si existen (ej: tipos incorrectos) */}
        {fields.map(
          (_, index) =>
            (sectionErrors?.[index]?.nombre ||
              sectionErrors?.[index]?.valor) && (
              <p key={index} className="text-xs text-red-500 mt-1">
                * Revisa la fila {index + 1}:{" "}
                {sectionErrors?.[index]?.nombre?.message ||
                  sectionErrors?.[index]?.valor?.message}
              </p>
            )
        )}
      </div>
    </section>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function PropertiesForm({
  onNext,
  onBack,
}: PropertiesFormProps) {
  const { trigger } = useFormContext<RegisterMaterialFormValues>();

  const handleNextStep = async () => {
    // Validamos los arrays completos
    const isValid = await trigger(["mecanicas", "perceptivas", "emocionales"]);
    if (isValid) {
      onNext();
    }
  };

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
          Define las características técnicas, sensoriales y emocionales de
          forma dinámica.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-10 p-6 md:p-8">
        {/* 1. PROPIEDADES MECÁNICAS (Numéricas) */}
        <PropertySection
          name="mecanicas"
          title="Propiedades Mecánicas"
          icon={Activity}
          iconColor="text-blue-700 bg-blue-100"
          isNumeric={true}
        />

        {/* 2. PROPIEDADES PERCEPTIVAS (Texto) */}
        <PropertySection
          name="perceptivas"
          title="Propiedades Perceptivas"
          icon={Eye}
          iconColor="text-purple-700 bg-purple-100"
          isNumeric={false}
        />

        {/* 3. PROPIEDADES EMOCIONALES (Texto) */}
        <PropertySection
          name="emocionales"
          title="Propiedades Emocionales"
          icon={Heart}
          iconColor="text-rose-600 bg-rose-100"
          isNumeric={false}
        />

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
