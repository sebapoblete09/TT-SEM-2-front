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

  const renderSelects = (categoria: keyof PropertiesData, props: string[]) =>
    props.map((p) => (
      <div key={p} className="space-y-2">
        <Label>{p}</Label>
        <Select
          value={data[categoria]?.[p] || ""}
          onValueChange={(v) => handleChange(categoria, p, v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            {opciones.map((o) => (
              <SelectItem key={o} value={o.toLowerCase()}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ));

  const renderTextareas = (categoria: keyof PropertiesData, props: string[]) =>
    props.map((p) => (
      <div key={p} className="space-y-2">
        <Label>{p}</Label>
        <Textarea
          value={data[categoria]?.[p] || ""}
          onChange={(e) => handleChange(categoria, p, e.target.value)}
          placeholder={`Describe la ${p.toLowerCase()} del material...`}
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
          <div className="grid grid-cols-2 gap-4">
            {renderSelects("mecanicas", [
              "Resistencia",
              "Dureza",
              "Elasticidad",
              "Ductilidad",
              "Fragilidad",
            ])}
          </div>
        </section>

        {/* Propiedades Perceptivas */}
        <section>
          <h3 className="font-semibold mb-2">Propiedades Perceptivas</h3>
          <div className="grid grid-cols-2 gap-4">
            {renderTextareas("perceptivas", [
              "Color",
              "Brillo",
              "Textura",
              "Transparencia",
              "Sensación Térmica",
            ])}
          </div>
        </section>

        {/* Propiedades Emocionales */}
        <section>
          <h3 className="font-semibold mb-2">Propiedades Emocionales</h3>
          <div className="grid grid-cols-2 gap-4">
            {renderSelects("emocionales", [
              "Calidez Emocional",
              "Inspiración",
              "Sostenibilidad Percibida",
              "Armonía",
              "Innovación Emocional",
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
