"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CompositionFormProps {
  composicion: string[];
  setComposicion: React.Dispatch<React.SetStateAction<string[]>>;
  currentComposicion: string;
  setCurrentComposicion: React.Dispatch<React.SetStateAction<string>>;
}

export default function CompositionForm({
  composicion,
  setComposicion,
  currentComposicion,
  setCurrentComposicion,
}: CompositionFormProps) {
  const handleAdd = () => {
    if (currentComposicion.trim() !== "") {
      setComposicion([...composicion, currentComposicion.trim()]);
      setCurrentComposicion("");
    }
  };

  const handleRemove = (index: number) => {
    setComposicion(composicion.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Composición</h2>
      <p className="text-muted-foreground mb-4">
        Agrega los materiales o componentes principales del biomaterial.
      </p>

      <div className="flex gap-2">
        <Input
          placeholder="Ej. cáscara de naranja"
          value={currentComposicion}
          onChange={(e) => setCurrentComposicion(e.target.value)}
        />
        <Button type="button" onClick={handleAdd}>
          Agregar
        </Button>
      </div>

      <ul className="list-disc pl-6">
        {composicion.map((item, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>{item}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(index)}
            >
              Eliminar
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
