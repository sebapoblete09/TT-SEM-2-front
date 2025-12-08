// components/admin/RejectionDialog.tsx
"use client";

import { useState } from "react";
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

interface RejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
}

export function RejectionDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: RejectionDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita cierre automático
    if (!reason.trim()) return;
    onConfirm(reason);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Solicitar corrección</AlertDialogTitle>
          <AlertDialogDescription>
            El material volverá al estado de "Rechazado/Pendiente" y se
            notificará al usuario. Escribe el motivo para que pueda corregirlo.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-2">
          <Label htmlFor="reason">Motivo del rechazo:</Label>
          <Textarea
            id="reason"
            placeholder="Ej: La imagen 3 está borrosa, falta describir la textura..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="resize-none"
            rows={4}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isSubmitting || !reason.trim()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? "Enviando..." : "Enviar Corrección"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
