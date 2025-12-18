"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form"; // <--- Importamos useFieldArray
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
import {
  Plus,
  Trash2, // Cambiamos X por Trash2 para mejor semántica de borrado
  FlaskConical,
  ArrowLeft,
  ArrowRight,
  Atom,
} from "lucide-react";

import { RegisterMaterialFormValues } from "./schemas";

interface CompositionFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function CompositionForm({
  onNext,
  onBack,
}: CompositionFormProps) {
  // Estado local para los inputs temporales (ahora es un objeto)
  const [newItem, setNewItem] = useState({ elemento: "", cantidad: "" });

  // 1. Conectamos al contexto global
  const {
    control, // Necesario para useFieldArray
    trigger,
    formState: { errors },
  } = useFormContext<RegisterMaterialFormValues>();

  // 2. Usamos useFieldArray para manejar la lista de objetos
  // Esto maneja automáticamente los IDs únicos y el estado del array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "composicion",
  });

  // --- LÓGICA DE AGREGAR ---
  const addItem = () => {
    // Validamos que al menos tenga nombre el elemento antes de agregarlo
    if (newItem.elemento.trim()) {
      append({
        elemento: newItem.elemento.trim(),
        cantidad: newItem.cantidad.trim() || "n/a", // Si no pone cantidad, guardamos "n/a" o string vacío según prefieras
      });
      // Limpiamos los inputs
      setNewItem({ elemento: "", cantidad: "" });
    }
  };

  // --- VALIDACIÓN AL AVANZAR ---
  const handleNextStep = async () => {
    // Dispara la validación del campo 'composicion' (verificará min(1))
    const isValid = await trigger("composicion");
    if (isValid) {
      onNext();
    }
  };

  // Helper para detectar errores (puede venir como array o root error)
  const rootError =
    errors.composicion?.root?.message ||
    (typeof errors.composicion?.message === "string"
      ? errors.composicion?.message
      : null);

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
          Define los ingredientes y proporciones base de tu material.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 p-6 md:p-8">
        {/* --- INPUTS DE AGREGADO --- */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label
              className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-2 ${
                errors.composicion ? "text-red-500" : "text-slate-500"
              }`}
            >
              <Atom className="w-4 h-4" /> Agregar Ingrediente
            </Label>

            {/* ERROR GENERAL (ej: "Debes agregar al menos uno") */}
            {rootError && (
              <span className="text-xs text-red-500 font-medium animate-in fade-in">
                {rootError}
              </span>
            )}
          </div>

          <div className="flex gap-2 items-start">
            {/* Input Elemento */}
            <div className="flex-1">
              <Input
                placeholder="Ingrediente (Ej: Agua)"
                value={newItem.elemento}
                onChange={(e) =>
                  setNewItem({ ...newItem, elemento: e.target.value })
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addItem())
                }
                className="bg-slate-50 border-slate-200 focus-visible:ring-amber-500 h-11"
              />
            </div>

            {/* Input Cantidad */}
            <div className="w-1/3">
              <Input
                placeholder="Cant. (Ej: 500ml)"
                value={newItem.cantidad}
                onChange={(e) =>
                  setNewItem({ ...newItem, cantidad: e.target.value })
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addItem())
                }
                className="bg-slate-50 border-slate-200 focus-visible:ring-amber-500 h-11"
              />
            </div>

            <Button
              type="button"
              onClick={addItem}
              size="icon"
              className="bg-slate-900 hover:bg-slate-800 shrink-0 h-11 w-11 rounded-lg"
              disabled={!newItem.elemento.trim()} // Deshabilitar si no hay nombre
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-[10px] text-slate-400 ml-1">
            * Ingresa el nombre y la medida (opcional). Presiona Enter o el
            botón + para añadir.
          </p>
        </div>

        {/* --- LISTA DE COMPONENTES (Tabla Visual) --- */}
        <div
          className={`rounded-xl border min-h-[8rem] transition-colors overflow-hidden ${
            errors.composicion
              ? "border-red-200 bg-red-50/30"
              : "border-slate-100 bg-slate-50/50"
          }`}
        >
          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center h-full">
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
                Aún no hay componentes.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {field.elemento}
                      </span>
                      {/* Mostramos la cantidad con estilo diferente */}
                      <span className="text-xs text-slate-400 font-medium">
                        {field.cantidad && field.cantidad !== "n/a"
                          ? field.cantidad
                          : "Sin medida"}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- BOTONES DE NAVEGACIÓN --- */}
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
