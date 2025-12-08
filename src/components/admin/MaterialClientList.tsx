"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Material } from "@/types/materials";
import { MaterialCardItem } from "./MaterialDetail"; // Asegúrate que la ruta sea correcta
import { toast } from "react-toastify";

// Extendemos el tipo para la UI
type MaterialWithUI = Material & {
  correctionSent?: boolean;
};

type MaterialListProps = {
  initialMaterials: Material[];
  access_token: string;
  filterType?: "pending" | "approved" | "all"; // Opcional: para saber qué lista estamos viendo
};

export function MaterialClientList({
  initialMaterials,
  access_token,
  filterType = "all", // Por defecto asume que muestra todo, ajusta según tu uso
}: MaterialListProps) {
  const router = useRouter();

  // Estado local
  const [materials, setMaterials] =
    useState<MaterialWithUI[]>(initialMaterials);

  // 1. SINCRONIZACIÓN AUTOMÁTICA (La clave para evitar el F5)
  // Cuando router.refresh() trae nuevos datos, actualizamos el estado local.
  useEffect(() => {
    setMaterials(initialMaterials);
  }, [initialMaterials]);

  // --- APROBAR ---
  const handleApprove = async (id: string) => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";

      // Actualización OPTIMISTA (Visual inmediata)
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, estado: true, correctionSent: false } : m
        )
      );

      const response = await fetch(`${baseUrl}/materials/${id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!response.ok) throw new Error("Error al aprobar");

      toast.success("¡Material aprobado y publicado exitosamente!");
      router.refresh(); // Sincroniza con el servidor en segundo plano
    } catch (e) {
      console.error(e);
      toast.error("Hubo un error al intentar aprobar el material.");
      // Si falla, revertimos el cambio (opcional, requeriría guardar estado previo)
      router.refresh();
    }
  };

  // --- RECHAZAR / CORREGIR ---
  const handleReject = async (id: string, reason: string) => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";

      // Actualización OPTIMISTA (Visual inmediata)
      // Marcamos estado false y activamos la etiqueta visual
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, estado: false, correctionSent: true } : m
        )
      );

      const response = await fetch(`${baseUrl}/materials/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ razon: reason }),
      });

      if (!response.ok) throw new Error("Error al rechazar");

      toast.info("Solicitud de corrección enviada al usuario.");
      router.refresh(); // Sincroniza datos reales
    } catch (e) {
      console.error(e);
      toast.error("No se pudo enviar la corrección. Intente nuevamente.");
    }
  };

  // Lógica de filtrado visual (Opcional si quieres que desaparezcan de la lista actual)
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
              // Pasamos la prop visual que creamos en el map optimista
              isCorrectionSent={material.correctionSent}
            />
          ))
        )}
      </ul>
    </div>
  );
}
