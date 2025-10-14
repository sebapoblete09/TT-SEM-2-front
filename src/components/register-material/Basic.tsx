"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, X } from "lucide-react";

interface BasicInfoFormProps {
  herramientas: string[];
  setHerramientas: React.Dispatch<React.SetStateAction<string[]>>;
  currentHerramienta: string;
  setCurrentHerramienta: React.Dispatch<React.SetStateAction<string>>;
  colaboradores: string[];
  setColaboradores: React.Dispatch<React.SetStateAction<string[]>>;
  currentColaborador: string;
  setCurrentColaborador: React.Dispatch<React.SetStateAction<string>>;
}

export default function BasicInfoForm({
  herramientas,
  setHerramientas,
  currentHerramienta,
  setCurrentHerramienta,
  colaboradores,
  setColaboradores,
  currentColaborador,
  setCurrentColaborador,
}: BasicInfoFormProps) {
  const addHerramienta = () => {
    if (
      currentHerramienta.trim() &&
      !herramientas.includes(currentHerramienta.trim())
    ) {
      setHerramientas([...herramientas, currentHerramienta.trim()]);
      setCurrentHerramienta("");
    }
  };

  const removeHerramienta = (herramienta: string) => {
    setHerramientas(herramientas.filter((h) => h !== herramienta));
  };

  const addColaborador = () => {
    if (
      currentColaborador.trim() &&
      !colaboradores.includes(currentColaborador.trim())
    ) {
      setColaboradores([...colaboradores, currentColaborador.trim()]);
      setCurrentColaborador("");
    }
  };

  const removeColaborador = (colab: string) => {
    setColaboradores(colaboradores.filter((c) => c !== colab));
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
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Material *</Label>
          <Input id="name" placeholder="Ej: Bioplástico de Almidón de Maíz" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción *</Label>
          <Textarea
            id="description"
            placeholder="Describe las características principales y aplicaciones potenciales..."
            rows={6}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label>Herramientas Necesarias</Label>
          <div className="flex gap-2">
            <Input
              value={currentHerramienta}
              onChange={(e) => setCurrentHerramienta(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addHerramienta())
              }
              placeholder="Ej: Olla, Espátula, Termómetro..."
            />
            <Button type="button" onClick={addHerramienta} variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {herramientas.map((herramienta) => (
              <Badge
                key={herramienta}
                variant="secondary"
                className="px-3 py-1"
              >
                {herramienta}
                <button
                  onClick={() => removeHerramienta(herramienta)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="derivado_de">Derivado de (Opcional)</Label>
          <Input
            id="derivado_de"
            placeholder="ID del material base si este es una variación"
          />
          <p className="text-xs text-muted-foreground">
            Si este material es una variación de otro existente, ingresa su ID
          </p>
        </div>

        <div className="space-y-2">
          <Label>Colaboradores</Label>
          <div className="flex gap-2">
            <Input
              value={currentColaborador}
              onChange={(e) => setCurrentColaborador(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addColaborador())
              }
              placeholder="Email del colaborador..."
            />
            <Button type="button" onClick={addColaborador} variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {colaboradores.map((colab) => (
              <Badge key={colab} variant="outline" className="px-3 py-1">
                {colab}
                <button
                  onClick={() => removeColaborador(colab)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Galería de Imágenes *</Label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Arrastra imágenes aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG hasta 10MB (mínimo 3 imágenes)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
