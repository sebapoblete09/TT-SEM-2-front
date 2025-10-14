"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload } from "lucide-react";

export interface BasicInfoData {
  nombre: string;
  descripcion: string;
  herramientas: string[];
  derivadoDe: string;
  colaboradores: string[];
  imagenes: File[];
}

interface BasicInfoFormProps {
  data: BasicInfoData;
  setData: React.Dispatch<React.SetStateAction<BasicInfoData>>;
  onNext: () => void;
}

export default function BasicInfoForm({
  data,
  setData,
  onNext,
}: BasicInfoFormProps) {
  const [herramienta, setHerramienta] = useState("");
  const [colaborador, setColaborador] = useState("");

  // 📸 Manejo de imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileList = Array.from(files);
    setData((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, ...fileList],
    }));
  };

  const removeImage = (index: number) => {
    setData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const addHerramienta = () => {
    if (herramienta.trim() && !data.herramientas.includes(herramienta)) {
      setData((prev) => ({
        ...prev,
        herramientas: [...prev.herramientas, herramienta],
      }));
      setHerramienta("");
    }
  };

  const removeHerramienta = (item: string) => {
    setData((prev) => ({
      ...prev,
      herramientas: prev.herramientas.filter((h) => h !== item),
    }));
  };

  const addColaborador = () => {
    if (colaborador.trim() && !data.colaboradores.includes(colaborador)) {
      setData((prev) => ({
        ...prev,
        colaboradores: [...prev.colaboradores, colaborador],
      }));
      setColaborador("");
    }
  };

  const removeColaborador = (item: string) => {
    setData((prev) => ({
      ...prev,
      colaboradores: prev.colaboradores.filter((c) => c !== item),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Básica</CardTitle>
        <CardDescription>
          Proporciona los detalles fundamentales de tu biomaterial
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Nombre */}
        <div>
          <Label>Nombre *</Label>
          <Input
            value={data.nombre}
            onChange={(e) =>
              setData((prev) => ({ ...prev, nombre: e.target.value }))
            }
            placeholder="Ej: Bioplástico de almidón de maíz"
          />
        </div>

        {/* Descripción */}
        <div>
          <Label>Descripción *</Label>
          <Textarea
            value={data.descripcion}
            onChange={(e) =>
              setData((prev) => ({ ...prev, descripcion: e.target.value }))
            }
            rows={4}
            placeholder="Describe las características y aplicaciones del material..."
          />
        </div>

        {/* Herramientas */}
        <div>
          <Label>Herramientas necesarias</Label>
          <div className="flex gap-2">
            <Input
              value={herramienta}
              onChange={(e) => setHerramienta(e.target.value)}
              placeholder="Ej: Espátula, termómetro..."
            />
            <Button type="button" onClick={addHerramienta} variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.herramientas.map((h) => (
              <Badge key={h} variant="secondary">
                {h}
                <button
                  onClick={() => removeHerramienta(h)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Derivado de */}
        <div>
          <Label>Derivado de (opcional)</Label>
          <Input
            value={data.derivadoDe}
            onChange={(e) =>
              setData((prev) => ({ ...prev, derivadoDe: e.target.value }))
            }
            placeholder="ID o nombre del material base, si aplica"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Si este material es una variación de otro existente, indica su ID o
            nombre de referencia.
          </p>
        </div>

        {/* Colaboradores */}
        <div>
          <Label>Colaboradores</Label>
          <div className="flex gap-2">
            <Input
              value={colaborador}
              onChange={(e) => setColaborador(e.target.value)}
              placeholder="Email o nombre del colaborador"
            />
            <Button type="button" onClick={addColaborador} variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.colaboradores.map((c) => (
              <Badge key={c} variant="outline">
                {c}
                <button
                  onClick={() => removeColaborador(c)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* 📸 Imágenes de galería */}
        <div>
          <Label>Galería de imágenes</Label>
          <div className="flex items-center gap-3 mt-2">
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>

          {data.imagenes.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {data.imagenes.map((img, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Imagen ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 bg-black/60 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón siguiente */}
        <div className="flex justify-end pt-4">
          <Button onClick={onNext}>Siguiente</Button>
        </div>
      </CardContent>
    </Card>
  );
}
