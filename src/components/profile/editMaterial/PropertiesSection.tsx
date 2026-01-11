import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Eye,
  Heart,
  Plus,
  Trash2,
  LucideIcon,
  Activity,
} from "lucide-react";
import { EditMaterialFormValues } from "@/schemas/schemas"; // Importa tu tipo de edición

// =========================================================
// SUB-COMPONENTE GENÉRICO (Mecánica, Perceptiva, Emocional)
// =========================================================
interface PropertySectionProps {
  name: "mecanicas" | "perceptivas" | "emocionales"; // Clave en el schema
  title: string;
  icon: LucideIcon;
  iconColor: string; // clases de tailwind para color (ej: "text-blue-500")
  bgColor: string; // clases de tailwind para fondo icono (ej: "bg-blue-100")
  borderColor: string; // clases de tailwind para borde focus (ej: "focus-visible:ring-blue-500")
  isNumeric?: boolean; // Si es true, habilita campo Unidad y validación numérica visual
}

function DynamicPropertySection({
  name,
  title,
  icon: Icon,
  iconColor,
  bgColor,
  borderColor,
  isNumeric = false,
}: PropertySectionProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<EditMaterialFormValues>();

  // Hook para manejar arrays dinámicos
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  // Acceso seguro a errores de este array específico
  const sectionErrors = errors[name] as any;

  return (
    <div className="border p-4 rounded-lg bg-slate-50/50">
      {/* Header de la Sección */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${bgColor}`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <h3
            className={`font-semibold ${iconColor.replace(
              "text-",
              "text-slate-"
            )}`}
          >
            {title}
          </h3>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            append(
              isNumeric
                ? ({ nombre: "", valor: "", unidad: "" } as any) // Valor ahora es string según acordamos
                : ({ nombre: "", valor: "" } as any)
            )
          }
          className="h-7 text-xs text-slate-500 hover:text-green-600 hover:bg-green-50"
        >
          <Plus className="w-3 h-3 mr-1" /> Añadir
        </Button>
      </div>

      {/* Lista de Campos */}
      <div className="space-y-3">
        {fields.length === 0 && (
          <p className="text-xs text-slate-400 italic py-2 text-center">
            No hay propiedades definidas.
          </p>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-white p-3 rounded-md border border-slate-100 shadow-sm"
          >
            {/* 1. NOMBRE (Ej: Resistencia) */}
            <div className="flex-1 w-full md:w-auto">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 block">
                Propiedad
              </label>
              <Input
                placeholder="Ej: Resistencia"
                {...register(`${name}.${index}.nombre` as any)}
                className={`h-8 text-sm ${
                  sectionErrors?.[index]?.nombre
                    ? "border-red-500"
                    : borderColor
                }`}
              />
            </div>

            {/* 2. VALOR (Ej: Alta o 10.5) */}
            <div className="flex-1 w-full md:w-auto">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 block">
                Valor
              </label>
              <Input
                placeholder="Descripción..."
                {...register(`${name}.${index}.valor` as any)}
                className={`h-8 text-sm ${
                  sectionErrors?.[index]?.valor ? "border-red-500" : borderColor
                }`}
              />
            </div>

            {/* 3. UNIDAD (Solo si es numérico/mecánica) */}
            {isNumeric && (
              <div className="w-full md:w-24">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 block">
                  Unidad
                </label>
                <Input
                  placeholder="Ej: MPa"
                  {...register(`${name}.${index}.unidad` as any)}
                  className={`h-8 text-sm ${borderColor}`}
                />
              </div>
            )}

            {/* 4. BOTÓN BORRAR */}
            <div className="pt-4 md:pt-0 self-end md:self-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================
export function PropertiesSection() {
  return (
    <div className="space-y-6">
      {/* 1. PROPIEDADES MECÁNICAS */}
      <DynamicPropertySection
        name="mecanicas"
        title="Propiedades Mecánicas"
        icon={Activity}
        iconColor="text-blue-600"
        bgColor="bg-blue-100"
        borderColor="focus-visible:ring-blue-500"
        isNumeric={true}
      />

      {/* 2. PROPIEDADES PERCEPTIVAS */}
      <DynamicPropertySection
        name="perceptivas"
        title="Propiedades Perceptivas"
        icon={Eye}
        iconColor="text-purple-600"
        bgColor="bg-purple-100"
        borderColor="focus-visible:ring-purple-500"
        isNumeric={false}
      />

      {/* 3. PROPIEDADES EMOCIONALES */}
      <DynamicPropertySection
        name="emocionales"
        title="Propiedades Emocionales"
        icon={Heart}
        iconColor="text-rose-600"
        bgColor="bg-rose-100"
        borderColor="focus-visible:ring-rose-500"
        isNumeric={false}
      />
    </div>
  );
}
