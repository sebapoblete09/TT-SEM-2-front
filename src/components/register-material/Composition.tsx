"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form"; // <--- CLAVE
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

// Importamos el tipo del schema global
import { RegisterMaterialFormValues } from "./schemas";

interface CompositionFormProps {
  onNext: () => void;
  onBack: () => void;
  // Ya no recibe composicion ni setComposicion
}

export default function CompositionForm({
  onNext,
  onBack,
}: CompositionFormProps) {
  // Estado local para el input temporal
  const [currentInput, setCurrentInput] = useState("");

  // Conectamos al contexto global
  const {
    formState: { errors },
    watch,
    setValue,
    trigger,
    clearErrors,
  } = useFormContext<RegisterMaterialFormValues>();

  // Observamos el valor actual de la composición
  const composicion = watch("composicion") || [];

  // --- LÓGICA DE AGREGAR/QUITAR ---
  const addItem = () => {
    if (currentInput.trim() && !composicion.includes(currentInput.trim())) {
      const newList = [...composicion, currentInput.trim()];

      setValue("composicion", newList, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setCurrentInput("");
      clearErrors("composicion");
    }
  };

  const removeItem = (item: string) => {
    const newList = composicion.filter((c) => c !== item);
    setValue("composicion", newList, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // --- VALIDACIÓN AL AVANZAR ---
  const handleNextStep = async () => {
    const isValid = await trigger("composicion"); // Valida solo este campo
    if (isValid) {
      onNext();
    }
  };

  return (
    <Card className="border-2 border-slate-500/30 shadow-2xl shadow-slate-200/60 bg-white rounded-2xl overflow-hidden max-w-2xl mx-auto">
      {/* HEADER */}
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
          <div className="flex justify-between items-center">
            <Label
              htmlFor="componente-input"
              className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-2 ${
                errors.composicion ? "text-red-500" : "text-slate-500"
              }`}
            >
              <Atom className="w-4 h-4" /> Agregar Componente
            </Label>

            {/* MENSAJE DE ERROR */}
            {errors.composicion && (
              <span className="text-xs text-red-500 font-medium animate-in fade-in">
                {errors.composicion.message}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              id="componente-input"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addItem())
              }
              placeholder="Ej: Glicerina, Agar, Agua..."
              className={`h-12 bg-slate-50 focus-visible:ring-amber-500 transition-all text-base ${
                errors.composicion
                  ? "border-red-300 focus-visible:ring-red-500"
                  : "border-slate-200"
              }`}
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
        <div
          className={`rounded-xl border p-6 min-h-[8rem] transition-colors ${
            errors.composicion
              ? "border-red-200 bg-red-50/30"
              : "border-slate-100 bg-slate-50/50"
          }`}
        >
          {composicion.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-4">
              <Atom
                className={`w-8 h-8 mb-2 ${
                  errors.composicion
                    ? "text-red-300"
                    : "text-slate-300 opacity-50"
                }`}
              />
              <p
                className={`text-sm ${
                  errors.composicion
                    ? "text-red-400 font-medium"
                    : "text-slate-400"
                }`}
              >
                {errors.composicion
                  ? "¡La lista no puede estar vacía!"
                  : "Aún no hay componentes."}
              </p>
              {!errors.composicion && (
                <p className="text-xs text-slate-400 mt-1">
                  Escribe uno arriba y presiona Enter.
                </p>
              )}
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
            onClick={handleNextStep}
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
