"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Importamos el nuevo esquema
import { compositionSchema, CompositionFormValues } from "./schemas";

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
  // Estado local para el input de texto (no gestionado por Zod, solo es temporal)
  const [current, setCurrent] = useState("");

  // --- 1. CONFIGURACIÓN DEL FORMULARIO ZOD ---
  const form = useForm<CompositionFormValues>({
    resolver: zodResolver(compositionSchema),
    defaultValues: {
      composicion: composicion,
    },
    mode: "onChange",
  });

  // --- 2. SINCRONIZACIÓN (Efecto espejo) ---
  // Cada vez que agregas/quitas un item, actualizamos a Zod
  useEffect(() => {
    form.setValue("composicion", composicion, {
      shouldValidate: composicion.length > 0, // Solo validar si ya hay items para no mostrar rojo al inicio
      shouldDirty: true,
    });
  }, [composicion, form]);

  // --- 3. VALIDACIÓN AL AVANZAR ---
  const handleNextStep = async () => {
    const isValid = await form.trigger(); // Dispara la validación del esquema
    if (isValid) {
      onNext();
    }
  };

  // --- LÓGICA DE AGREGAR/QUITAR (Manual) ---
  const addItem = () => {
    if (current.trim() && !composicion.includes(current)) {
      setComposicion((prev) => [...prev, current]);
      setCurrent("");
      // Limpiamos el error de Zod visualmente apenas agregamos uno válido
      form.clearErrors("composicion");
    }
  };

  const removeItem = (item: string) => {
    setComposicion((prev) => prev.filter((c) => c !== item));
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
                form.formState.errors.composicion
                  ? "text-red-500"
                  : "text-slate-500"
              }`}
            >
              <Atom className="w-4 h-4" /> Agregar Componente
            </Label>

            {/* MENSAJE DE ERROR (Aparece a la derecha del label) */}
            {form.formState.errors.composicion && (
              <span className="text-xs text-red-500 font-medium animate-in fade-in">
                {form.formState.errors.composicion.message}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              id="componente-input"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addItem())
              }
              placeholder="Ej: Glicerina, Agar, Agua..."
              // Borde rojo si hay error y la lista está vacía
              className={`h-12 bg-slate-50 focus-visible:ring-amber-500 transition-all text-base ${
                form.formState.errors.composicion
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
            form.formState.errors.composicion
              ? "border-red-200 bg-red-50/30" // Fondo rojizo suave si hay error
              : "border-slate-100 bg-slate-50/50"
          }`}
        >
          {composicion.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-4">
              <Atom
                className={`w-8 h-8 mb-2 ${
                  form.formState.errors.composicion
                    ? "text-red-300"
                    : "text-slate-300 opacity-50"
                }`}
              />
              <p
                className={`text-sm ${
                  form.formState.errors.composicion
                    ? "text-red-400 font-medium"
                    : "text-slate-400"
                }`}
              >
                {form.formState.errors.composicion
                  ? "¡La lista no puede estar vacía!"
                  : "Aún no hay componentes."}
              </p>
              {!form.formState.errors.composicion && (
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
            onClick={handleNextStep} // <--- Conectado a Zod
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
