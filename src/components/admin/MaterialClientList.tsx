"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Material } from "@/types/materials";
import { MaterialCardItem } from "./MaterialDetail"; // Asegúrate que la ruta sea correcta
import { toast } from "react-toastify";
import {
  approveMaterialAction,
  rejectedMaterialAction,
} from "@/actions/materials";

// Extendemos el tipo para la UI
type MaterialWithUI = Material & {
  correctionSent?: boolean;
};

type MaterialListProps = {
  initialMaterials: Material[];
  filterType?: "pending" | "approved" | "all";
};

export function MaterialClientList({
  initialMaterials,
  filterType = "all",
}: MaterialListProps) {
  const router = useRouter();

  // Estado local
  const [materials, setMaterials] =
    useState<MaterialWithUI[]>(initialMaterials);

  // 1. SINCRONIZACIÓN AUTOMÁTICA
  // Cuando router.refresh() trae nuevos datos, actualizamos el estado local.
  useEffect(() => {
    setMaterials(initialMaterials);
  }, [initialMaterials]);

  // --- APROBAR ---
  const handleApprove = async (id: string) => {
    // Guardamos el estado anterior por si hay que revertir (rollback)
    const previousMaterials = [...materials];

    try {
      // 1. Actualización OPTIMISTA
      // Si estamos en la vista de pendientes, lo quitamos visualmente inmediato
      setMaterials((prev) => prev.filter((m) => m.id !== id));

      toast.success("Procesando aprobación...");

      // 2. Llamada al Server Action
      const result = await approveMaterialAction(id);

      if (!result.success) {
        throw new Error(result.message);
      }

      // 3. Éxito confirmado
      toast.success("¡Material aprobado y publicado!");
    } catch (e) {
      console.error(e);
      // 4. Rollback (Si falla, devolvemos el material a la lista)
      setMaterials(previousMaterials);
      toast.error(e instanceof Error ? e.message : "Error al aprobar.");
    }
  };

  // --- RECHAZAR / CORREGIR ---
  const handleReject = async (id: string, reason: string) => {
    // Guardamos el estado anterior por si hay que revertir (rollback)
    const previousMaterials = [...materials];
    try {
      // Actualización OPTIMISTA (Visual inmediata)
      // Marcamos estado false y activamos la etiqueta visual
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, estado: false, correctionSent: true } : m
        )
      ); // Sincroniza datos reales
      toast.success("Procesando rechazo...");

      // 2. Llamada al Server Action
      const result = await rejectedMaterialAction(id, reason);

      if (!result.success) {
        throw new Error(result.message);
      }

      // 3. Éxito confirmado
      toast.success("¡Material rechazado y notificado!");
    } catch (e) {
      console.error(e);
      setMaterials(previousMaterials);
      toast.error(e instanceof Error ? e.message : "Error al rechazar.");
    }
  };

  // Si esta lista es SOLO de pendientes, y aprobamos uno, no queremos verlo más.
  const visibleMaterials = materials.filter((m) => {
    if (filterType === "pending") return m.estado === false; // Solo pendientes
    if (filterType === "approved") return m.estado === true; // Solo aprobados
    return true; // Mostrar todos
  });

  return (
    <div className="rounded-lg p-4">
      <ul className="space-y-4">
        {visibleMaterials.length === 0 ? (
          <li className="text-center text-muted-foreground p-4 bg-slate-50 rounded-xl border border-dashed">
            No hay materiales en esta lista.
          </li>
        ) : (
          visibleMaterials.map((material) => (
            <MaterialCardItem
              key={material.id}
              material={material}
              onApprove={handleApprove}
              onRejectWithReason={handleReject}
              isCorrectionSent={material.correctionSent}
            />
          ))
        )}
      </ul>
    </div>
  );
}
