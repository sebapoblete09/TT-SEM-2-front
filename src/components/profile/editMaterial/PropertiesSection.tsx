import { FieldError, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hammer, Eye, Heart, Layers } from "lucide-react";
import { EditMaterialFormValues } from "@/components/register-material/schemas"; // Asegúrate de importar tu tipo
function PropertyInput({ label, name }: { label: string; name: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<EditMaterialFormValues>();

  // 2. CORRECCIÓN AQUÍ:
  // Usamos 'as FieldError | undefined' para decirle a TS que el resultado tiene .message
  const error = name
    .split(".")
    .reduce((obj: any, key) => obj?.[key], errors) as FieldError | undefined;

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
        {label}
      </label>
      <Input
        {...register(name as any)} // 'as any' en el name ayuda si TS se pone estricto con los paths
        className={`bg-white text-slate-900 ${
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        }`}
        placeholder={`Definir ${label.toLowerCase()}...`}
      />
      {/* Ahora TS ya sabe que 'error' es un FieldError y tiene .message */}
      {error && (
        <span className="text-red-500 text-[10px] mt-1 block">
          {error.message}
        </span>
      )}
    </div>
  );
}

function PropertySelect({ label, name }: { label: string; name: string }) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EditMaterialFormValues>();

  // CORRECCIÓN 1: Forzamos a que TS trate el valor como string
  // Usamos 'as any' en el watch para evitar conflictos de path, y 'as string' en el resultado
  const currentValue = watch(name as any) as string;

  // CORRECCIÓN 2: Forzamos el tipo del error
  // (obj: any) permite navegar sin restricciones
  // 'as FieldError | undefined' asegura que TS sepa que tiene la propiedad .message
  const error = name
    .split(".")
    .reduce((obj: any, key) => obj?.[key], errors) as FieldError | undefined;

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
        {label}
      </label>
      <Select
        value={currentValue}
        onValueChange={(val) =>
          setValue(name as any, val, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      >
        <SelectTrigger className={`bg-white ${error ? "border-red-500" : ""}`}>
          <SelectValue placeholder="Seleccionar..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Baja">Baja</SelectItem>
          <SelectItem value="Media">Media</SelectItem>
          <SelectItem value="Alta">Alta</SelectItem>
        </SelectContent>
      </Select>

      {/* Ahora TS sabe que 'error' es de tipo FieldError */}
      {error && (
        <span className="text-red-500 text-[10px] mt-1 block">
          {error.message || "Requerido"}
        </span>
      )}
    </div>
  );
}

// --- Componente Principal ---
export function PropertiesSection() {
  // Ya no recibe props, usa el contexto del padre

  return (
    <div className="space-y-6">
      {/* 1. PROPIEDADES MECÁNICAS (Usa Select) */}
      <div className="border p-4 rounded-lg bg-slate-50">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
          <Layers className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-blue-700">Propiedades Mecánicas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PropertySelect label="Resistencia" name="mecanicas.resistencia" />
          <PropertySelect label="Dureza" name="mecanicas.dureza" />
          <PropertySelect label="Elasticidad" name="mecanicas.elasticidad" />
          <PropertySelect label="Ductilidad" name="mecanicas.ductilidad" />
          <PropertySelect label="Fragilidad" name="mecanicas.fragilidad" />
        </div>
      </div>

      {/* 2. PROPIEDADES PERCEPTIVAS (Usa Input Texto) */}
      <div className="border p-4 rounded-lg bg-slate-50">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
          <Eye className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-purple-600">
            Propiedades Perceptivas
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PropertyInput label="Color" name="perceptivas.color" />
          <PropertyInput label="Brillo" name="perceptivas.brillo" />
          <PropertyInput label="Textura" name="perceptivas.textura" />
          <PropertyInput
            label="Transparencia"
            name="perceptivas.transparencia"
          />
          <PropertyInput
            label="Sensación Térmica"
            name="perceptivas.sensacion_termica"
          />
        </div>
      </div>

      {/* 3. PROPIEDADES EMOCIONALES (Usa Select) */}
      <div className="border p-4 rounded-lg bg-slate-50">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
          <Heart className="w-5 h-5 text-rose-500" />
          <h3 className="font-semibold text-rose-700">
            Propiedades Emocionales
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PropertySelect
            label="Calidez Emocional"
            name="emocionales.calidez_emocional"
          />
          <PropertySelect label="Inspiración" name="emocionales.inspiracion" />
          <PropertySelect
            label="Sostenibilidad Percibida"
            name="emocionales.sostenibilidad_percibida"
          />
          <PropertySelect label="Armonía" name="emocionales.armonia" />
          <PropertySelect
            label="Innovación Emocional"
            name="emocionales.innovacion_emocional"
          />
        </div>
      </div>
    </div>
  );
}
