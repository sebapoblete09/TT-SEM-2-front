"use client";

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
  const opciones = ["Baja", "Media", "Alta"];

  const handleChange = (
    categoria: keyof PropertiesData,
    key: string,
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      [categoria]: { ...prev[categoria], [key]: value },
    }));
  };

  // Helper para renderizar Selects con estilo
  const renderSelects = (
    categoria: keyof PropertiesData,
    props: { label: string; key: string }[]
  ) =>
    props.map((prop) => (
      <div key={prop.key} className="space-y-2">
        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {prop.label}
        </Label>
        <Select
          value={data[categoria]?.[prop.key] || ""}
          onValueChange={(v) => handleChange(categoria, prop.key, v)}
        >
          <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-blue-500 h-11">
            <SelectValue placeholder="Selecciona..." />
          </SelectTrigger>
          <SelectContent>
            {opciones.map((op) => (
              <SelectItem key={op} value={op} className="cursor-pointer">
                {op}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ));

  // Helper para renderizar Textareas con estilo
  const renderTextareas = (
    categoria: keyof PropertiesData,
    props: { label: string; key: string }[]
  ) =>
    props.map((prop) => (
      <div key={prop.key} className="space-y-2">
        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {prop.label}
        </Label>
        <Textarea
          value={data[categoria]?.[prop.key] || ""}
          onChange={(e) => handleChange(categoria, prop.key, e.target.value)}
          placeholder={`Describe la ${prop.label.toLowerCase()}...`}
          rows={2}
          className="bg-slate-50 border-slate-200 focus-visible:ring-purple-500 resize-none min-h-[5rem]"
        />
      </div>
    ));

  return (
    <Card className="border-2 border-slate-500/30shadow-2xl shadow-slate-200/60 bg-white rounded-2xl overflow-hidden">
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
        {/* 1. PROPIEDADES MECÁNICAS (Azul) */}
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

        {/* 2. PROPIEDADES PERCEPTIVAS (Morado) */}
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

        {/* 3. PROPIEDADES EMOCIONALES (Rosa/Rojo) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-rose-600 border-b border-rose-100 pb-2">
            <Heart className="w-5 h-5" />
            <h3 className="font-bold text-lg">Propiedades Emocionales</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
            {renderSelects("emocionales", [
              { label: "Calidez", key: "calidez_emocional" },
              { label: "Inspiración", key: "inspiracion" },
              { label: "Sostenibilidad", key: "sostenibilidad_percibida" }, // Label más corto para que no rompa
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
            onClick={onNext}
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
