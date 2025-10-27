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

  const renderSelects = (
    categoria: keyof PropertiesData,
    props: { label: string; key: string }[]
  ) =>
    props.map((prop) => (
      <div key={prop.key} className="space-y-2">
        <Label>{prop.label}</Label>
        <Select
          value={data[categoria]?.[prop.key] || ""}
          onValueChange={(v) => handleChange(categoria, prop.key, v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            {opciones.map((op) => (
              <SelectItem key={op} value={op}>
                {op}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ));

  const renderTextareas = (
    categoria: keyof PropertiesData,
    props: { label: string; key: string }[]
  ) =>
    props.map((prop) => (
      <div key={prop.key} className="space-y-2">
        <Label>{prop.label}</Label>
        <Textarea
          value={data[categoria]?.[prop.key] || ""}
          onChange={(e) => handleChange(categoria, prop.key, e.target.value)}
          placeholder={`Describe la ${prop.label.toLowerCase()} del material...`}
          rows={2}
        />
      </div>
    ));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Propiedades del Material</CardTitle>
        <CardDescription>
          Define las características mecánicas, perceptivas y emocionales del
          biomaterial
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Propiedades Mecánicas */}
        <section>
          <h3 className="font-semibold mb-2">Propiedades Mecánicas</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {renderSelects("mecanicas", [
              { label: "Resistencia", key: "resistencia" },
              { label: "Dureza", key: "dureza" },
              { label: "Elasticidad", key: "elasticidad" },
              { label: "Ductilidad", key: "ductilidad" },
              { label: "Fragilidad", key: "fragilidad" },
            ])}
          </div>
        </section>

        {/* Propiedades Perceptivas */}
        <section>
          <h3 className="font-semibold mb-2">Propiedades Perceptivas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderTextareas("perceptivas", [
              { label: "Color", key: "color" },
              { label: "Brillo", key: "brillo" },
              { label: "Textura", key: "textura" },
              { label: "Transparencia", key: "transparencia" },
              { label: "Sensación Térmica", key: "sensacion_termica" },
            ])}
          </div>
        </section>

        {/* Propiedades Emocionales */}
        <section>
          <h3 className="font-semibold mb-2">Propiedades Emocionales</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {renderSelects("emocionales", [
              { label: "Calidez Emocional", key: "calidez_emocional" },
              { label: "Inspiración", key: "inspiracion" },
              {
                label: "Sostenibilidad Percibida",
                key: "sostenibilidad_percibida",
              },
              { label: "Armonía", key: "armonia" },
              { label: "Innovación Emocional", key: "innovacion_emocional" },
            ])}
          </div>
        </section>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Atrás
          </Button>
          <Button onClick={onNext}>Siguiente</Button>
        </div>
      </CardContent>
    </Card>
  );
}
