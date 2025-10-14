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
    <Card>
      <CardHeader>
        <CardTitle>Composición</CardTitle>
        <CardDescription>
          Define los componentes principales del material
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label>Agregar Componente</Label>
        <div className="flex gap-2">
          <Input
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Ej: Glicerina"
          />
          <Button type="button" onClick={addItem} variant="secondary">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {composicion.map((c) => (
            <Badge key={c}>
              {c}
              <button
                onClick={() => removeItem(c)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Atrás
          </Button>
          <Button onClick={onNext}>Siguiente</Button>
        </div>
      </CardContent>
    </Card>
  );
}
