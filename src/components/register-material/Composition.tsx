"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface CompositionFormProps {
  composicion: string[];
  setComposicion: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  onBack: () => void;
}

export default function CompositionForm({
  composicion,
  setComposicion,
  onNext,
  onBack,
}: CompositionFormProps) {
  const [current, setCurrent] = useState("");

  const addItem = () => {
    if (current.trim() && !composicion.includes(current)) {
      setComposicion((prev) => [...prev, current]);
      setCurrent("");
    }
  };

  const removeItem = (item: string) => {
    setComposicion((prev) => prev.filter((c) => c !== item));
  };

  return (
    // Se centra y se da un ancho máximo al Card para mejor visualización en desktop
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Composición</CardTitle>
        <CardDescription>
          Define los componentes principales del material
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grupo de Label e Input/Button */}
        <div className="space-y-2">
          <Label htmlFor="componente-input">Agregar Componente</Label>
          {/* Contenedor responsive: flex-col en móvil, sm:flex-row en pantallas pequeñas y más */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="componente-input"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Ej: Glicerina"
              className="flex-grow" // Permite que el input crezca
            />
            <Button
              type="button"
              onClick={addItem}
              variant="secondary"
              className="w-full sm:w-auto" // Ancho completo en móvil, auto en sm+
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              {/* El texto "Agregar" se oculta en pantallas extra pequeñas */}
              <span className="hidden sm:inline">Agregar</span>
            </Button>
          </div>
        </div>

        {/* Contenedor de Badges: flex-wrap ya lo hace responsive */}
        {composicion.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {composicion.map((c) => (
              <Badge key={c} variant="secondary">
                {c}
                <button
                  onClick={() => removeItem(c)}
                  className="ml-2 rounded-full p-0.5 hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label={`Remover ${c}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Navegación: justify-between funciona bien en todas las pantallas */}
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
