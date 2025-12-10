import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  prop_mecanicas,
  prop_perceptivas,
  prop_emocionales,
} from "@/types/materials";
import { Hammer, Eye, Heart, Layers } from "lucide-react";

interface Props {
  mecanicas: prop_mecanicas;
  setMecanicas: (v: prop_mecanicas) => void;
  perceptivas: prop_perceptivas;
  setPerceptivas: (v: prop_perceptivas) => void;
  emocionales: prop_emocionales;
  setEmocionales: (v: prop_emocionales) => void;
}

// Helper 1: Para Texto Libre (Perceptivas)
function PropertyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
        {label}
      </label>
      <Input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white text-slate-900"
        placeholder={`Definir ${label.toLowerCase()}...`}
      />
    </div>
  );
}

// Helper 2: Para Selección de Nivel (Mecánicas y Emocionales)
function PropertySelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Seleccionar nivel..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Baja">Baja</SelectItem>
          <SelectItem value="Media">Media</SelectItem>
          <SelectItem value="Alta">Alta</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function PropertiesSection({
  mecanicas,
  setMecanicas,
  perceptivas,
  setPerceptivas,
  emocionales,
  setEmocionales,
}: Props) {
  // Handlers genéricos para actualizar objetos
  const updateMec = (key: keyof prop_mecanicas, val: string) =>
    setMecanicas({ ...mecanicas, [key]: val });

  const updatePer = (key: keyof prop_perceptivas, val: string) =>
    setPerceptivas({ ...perceptivas, [key]: val });

  const updateEmo = (key: keyof prop_emocionales, val: string) =>
    setEmocionales({ ...emocionales, [key]: val });

  return (
    <div className="space-y-6">
      {/* 1. PROPIEDADES MECÁNICAS (Usa Select) */}
      <div className="border p-4 rounded-lg bg-slate-50">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
          <Layers className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-blue-700">Propiedades Mecánicas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PropertySelect
            label="Resistencia"
            value={mecanicas.resistencia}
            onChange={(v) => updateMec("resistencia", v)}
          />
          <PropertySelect
            label="Dureza"
            value={mecanicas.dureza}
            onChange={(v) => updateMec("dureza", v)}
          />
          <PropertySelect
            label="Elasticidad"
            value={mecanicas.elasticidad}
            onChange={(v) => updateMec("elasticidad", v)}
          />
          <PropertySelect
            label="Ductilidad"
            value={mecanicas.ductilidad}
            onChange={(v) => updateMec("ductilidad", v)}
          />
          <PropertySelect
            label="Fragilidad"
            value={mecanicas.fragilidad}
            onChange={(v) => updateMec("fragilidad", v)}
          />
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
          <PropertyInput
            label="Color"
            value={perceptivas.color}
            onChange={(v) => updatePer("color", v)}
          />
          <PropertyInput
            label="Brillo"
            value={perceptivas.brillo}
            onChange={(v) => updatePer("brillo", v)}
          />
          <PropertyInput
            label="Textura"
            value={perceptivas.textura}
            onChange={(v) => updatePer("textura", v)}
          />
          <PropertyInput
            label="Transparencia"
            value={perceptivas.transparencia}
            onChange={(v) => updatePer("transparencia", v)}
          />
          <PropertyInput
            label="Sensación Térmica"
            value={perceptivas.sensacion_termica}
            onChange={(v) => updatePer("sensacion_termica", v)}
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
            value={emocionales.calidez_emocional}
            onChange={(v) => updateEmo("calidez_emocional", v)}
          />
          <PropertySelect
            label="Inspiración"
            value={emocionales.inspiracion}
            onChange={(v) => updateEmo("inspiracion", v)}
          />
          <PropertySelect
            label="Sostenibilidad Percibida"
            value={emocionales.sostenibilidad_percibida}
            onChange={(v) => updateEmo("sostenibilidad_percibida", v)}
          />
          <PropertySelect
            label="Armonía"
            value={emocionales.armonia}
            onChange={(v) => updateEmo("armonia", v)}
          />
          <PropertySelect
            label="Innovación Emocional"
            value={emocionales.innovacion_emocional}
            onChange={(v) => updateEmo("innovacion_emocional", v)}
          />
        </div>
      </div>
    </div>
  );
}
