// components/admin/MaterialClientList.tsx
"use client"; // <-- ¡CLAVE!

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Material } from "@/types/materials";
import { MaterialCardItem } from "./MaterialDetail";

// 1. Define las props que recibe
type MaterialListProps = {
  initialMaterials: Material[];
  access_token: string;
};
export function MaterialClientList({
  initialMaterials,
  access_token,
}: MaterialListProps) {
  const router = useRouter();
  // 2. Estado para que la lista sea interactiva (desaparezcan al borrarlos)
  const [materials, setMaterials] = useState(initialMaterials);

  // 3. Lógica para llamar a tu API de "Aprobar"
  const handleApprove = async (id: string) => {
    console.log("Aprobando material:", id);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
      const response = await fetch(`${baseUrl}/materials/${id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!response.ok) {
        console.error("Error aprobando material", await response.text());
      }
    } catch (e) {
      console.error("Error al aprobar material", e);
    }

    // ÉXITO
    // A. Actualizamos la lista visualmente (inmediato)
    alert("Material Aprovado exitosamente");
    setMaterials(materials.filter((m) => m.id !== id));

    // B. REFRESCAMOS LOS DATOS DEL SERVIDOR (Esto actualiza los números de arriba)
    router.refresh();
  };

  // 4. Lógica para llamar a tu API de "Eliminar"
  const handleDelete = async (id: string) => {
    console.log("Eliminando material:", id);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
      const response = await fetch(`${baseUrl}/materials/${id}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!response.ok) {
        console.error("Error rechazando material", await response.text());
      }
    } catch (e) {
      console.error("Error al aprobar material", e);
    }
    // ÉXITO
    setMaterials(materials.filter((m) => m.id !== id));

    // REFRESCAR DATOS DEL PADRE
    router.refresh();
  };

  return (
    <div className="rounded-lg p-4">
      <ul className="space-y-4">
        {materials.length === 0 ? (
          <li className="text-center text-muted-foreground p-4">
            No hay materiales pendientes.
          </li>
        ) : (
          // --- RENDERIZADO SIMPLIFICADO ---
          materials.map((material) => (
            <MaterialCardItem
              key={material.id}
              material={material}
              onApprove={handleApprove}
              onDelete={handleDelete}
            />
          ))
        )}
      </ul>
    </div>
  );
}
