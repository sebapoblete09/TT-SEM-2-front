"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PropertiesForm() {
  return (
    <div className="space-y-6">
      {/* Propiedades Mecánicas */}
      <Card>
        <CardHeader>
          <CardTitle>Propiedades Mecánicas</CardTitle>
          <CardDescription>
            Define las características físicas del material
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "resistencia", label: "Resistencia" },
            { id: "dureza", label: "Dureza" },
            { id: "elasticidad", label: "Elasticidad" },
            { id: "ductilidad", label: "Ductilidad" },
            { id: "fragilidad", label: "Fragilidad" },
          ].map((prop) => (
            <div key={prop.id} className="space-y-2">
              <Label htmlFor={prop.id}>{prop.label}</Label>
              <Select>
                <SelectTrigger id={prop.id} className="w-full">
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Propiedades Perceptivas */}
      <Card>
        <CardHeader>
          <CardTitle>Propiedades Perceptivas</CardTitle>
          <CardDescription>
            Características sensoriales del material
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: "color",
              label: "Color",
              placeholder: "Ej: Beige natural, Translúcido",
            },
            {
              id: "brillo",
              label: "Brillo",
              placeholder: "Ej: Mate, Satinado, Brillante",
            },
            {
              id: "textura",
              label: "Textura",
              placeholder: "Ej: Suave, Rugosa, Lisa",
            },
            {
              id: "transparencia",
              label: "Transparencia",
              placeholder: "Ej: Opaco, Translúcido, Transparente",
            },
            {
              id: "sensacion_termica",
              label: "Sensación Térmica",
              placeholder: "Ej: Cálido, Frío, Neutro",
            },
          ].map((prop) => (
            <div key={prop.id} className="space-y-2">
              <Label htmlFor={prop.id}>{prop.label}</Label>
              <Input id={prop.id} placeholder={prop.placeholder} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Propiedades Emocionales */}
      {/* Propiedades Emocionales */}
      <Card>
        <CardHeader>
          <CardTitle>Propiedades Emocionales</CardTitle>
          <CardDescription>
            Aspectos emocionales y perceptuales del material
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "calidez_emocional", label: "Calidez Emocional" },
            { id: "inspiracion", label: "Inspiración" },
            {
              id: "sostenibilidad_percibida",
              label: "Sostenibilidad Percibida",
            },
            { id: "armonia", label: "Armonía" },
            { id: "innovacion_emocional", label: "Innovación Emocional" },
          ].map((prop) => (
            <div key={prop.id} className="space-y-2">
              <Label htmlFor={prop.id}>{prop.label}</Label>
              <Select>
                <SelectTrigger id={prop.id} className="w-full">
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
