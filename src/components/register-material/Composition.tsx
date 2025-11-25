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
import {
  Plus,
  X,
  FlaskConical,
  ArrowLeft,
  ArrowRight,
  Atom,
} from "lucide-react";

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
    <Card className="border-2 border-slate-500/30 shadow-2xl shadow-slate-200/60 bg-white rounded-2xl overflow-hidden max-w-2xl mx-auto">
      {/* HEADER CON ESTILO UNIFICADO */}
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
            <FlaskConical className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-800">
            Composición Química
          </CardTitle>
        </div>
        <CardDescription className="text-slate-500 ml-12">
          Define los ingredientes y componentes base de tu material.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 p-6 md:p-8">
        {/* INPUT PRINCIPAL */}
        <div className="space-y-4">
          <Label
            htmlFor="componente-input"
            className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2"
          >
            <Atom className="w-4 h-4" /> Agregar Componente
          </Label>

          <div className="flex gap-2">
            <Input
              id="componente-input"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addItem())
              }
              placeholder="Ej: Glicerina, Agar, Agua..."
              className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-amber-500 transition-all text-base"
            />
            <Button
              type="button"
              onClick={addItem}
              size="icon"
              className="h-12 w-12 bg-slate-900 hover:bg-slate-800 shrink-0 rounded-lg"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* LISTA DE COMPONENTES */}
        <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-6 min-h-[8rem]">
          {composicion.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm text-center py-4">
              <Atom className="w-8 h-8 mb-2 opacity-20" />
              <p>Aún no hay componentes.</p>
              <p className="text-xs">Escribe uno arriba y presiona Enter.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {composicion.map((c) => (
                <Badge
                  key={c}
                  variant="secondary"
                  className="bg-white border border-slate-200 text-slate-700 pl-3 pr-1 py-1.5 text-sm font-normal shadow-sm hover:border-amber-300 transition-colors"
                >
                  {c}
                  <button
                    onClick={() => removeItem(c)}
                    className="ml-2 p-0.5 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
                    aria-label={`Remover ${c}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* BOTONES DE NAVEGACIÓN */}
        <div className="flex justify-between pt-4 border-t border-slate-100">
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
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/10 group px-6"
          >
            Siguiente Paso
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
