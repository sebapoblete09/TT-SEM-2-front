// components/admin/RejectionDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { z } from "zod"; // 1. Importamos Zod
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// 2. Definimos el Schema fuera del componente
// Esto valida un string simple, no un objeto
const reasonSchema = z
  .string()
  .trim() // Elimina espacios al inicio y final
  .min(5, "El motivo debe ser descriptivo (mínimo 5 caracteres).")
  .max(500, "El mensaje es demasiado largo (máximo 500 caracteres).");

interface RejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
}

export function DeleteMaterial({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: RejectionDialogProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null); // Estado para el error

  // Limpiar el formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (open) {
      setReason("");
      setError(null);
    }
  }, [open]);

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();

    // 3. Validamos usando safeParse
    const result = reasonSchema.safeParse(reason);

    if (!result.success) {
      // format() devuelve un objeto con los errores estructurados
      // Para un string simple, el error está en _errors
      const formatted = result.error.format();
      // formatted._errors es un array de strings con los mensajes
      setError(formatted._errors[0]);
      return;
    }

    // Si pasa la validación, limpiamos error y enviamos
    setError(null);
    onConfirm(result.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
    if (error) setError(null);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md border-2">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600 flex items-center gap-2">
            Eliminación de material
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción es irreversible. El material se eliminará del sistema y
            se notificará al usuario. Por favor, justifica la decisión.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-3">
          <Label htmlFor="reason" className="font-semibold text-slate-700">
            Motivo de la eliminación <span className="text-red-500">*</span>
          </Label>

          <Textarea
            id="reason"
            placeholder="Ej: La imagen 3 infringe derechos de autor o la descripción técnica es incoherente..."
            value={reason}
            onChange={handleChange}
            className={`resize-none transition-all ${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
            rows={4}
          />

          {/* 4. Mostrar el mensaje de error si existe */}
          {error && (
            <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
              {error}
            </p>
          )}

          {/* Contador de caracteres (opcional pero útil) */}
          <div className="text-right">
            <span
              className={`text-[10px] ${
                reason.length > 500 ? "text-red-500" : "text-slate-400"
              }`}
            >
              {reason.length}/500
            </span>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isSubmitting} // Ya no deshabilitamos por !reason, dejamos que Zod maneje el error
            className="bg-red-600 hover:bg-red-700 text-white border-red-700"
          >
            {isSubmitting ? "Eliminando..." : "Eliminar Definitivamente"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
