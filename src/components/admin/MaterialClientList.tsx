// components/admin/MaterialClientList.tsx
"use client"; // <-- ¡CLAVE!

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { Material } from "@/types/materials";

// 1. Define las props que recibe
type MaterialListProps = {
  initialMaterials: Material[];
  access_token: string;
};
export function MaterialClientList({
  initialMaterials,
  access_token, // <-- Ahora es parte del primer argumento
}: MaterialListProps) {
  // 2. Estado para que la lista sea interactiva (desaparezcan al borrarlos)
  const [materials, setMaterials] = useState(initialMaterials);

  // 3. Lógica para llamar a tu API de "Aprobar"
  const handleApprove = async (id: string) => {
    console.log("Aprobando material:", id);
    // Aquí harías tu fetch POST/PATCH para aprobar
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
        // Manejar error del backend de Go
        console.error("Error aprobando material", await response.text());
      }
    } catch (e) {
      console.error("Error al aprobar material", e);
    }

    window.alert("Material aprobado exitosamente");
    // Actualiza la UI para que el material desaparezca de la lista
    setMaterials(materials.filter((m) => m.id !== id));
  };

  // 4. Lógica para llamar a tu API de "Eliminar"
  const handleDelete = async (id: string) => {
    console.log("Eliminando material:", id);
    // Aquí harías tu fetch DELETE
    // await fetch(`${baseUrl}/materials/${id}`, { method: 'DELETE', ... });

    // Actualiza la UI
    setMaterials(materials.filter((m) => m.id !== id));
  };

  return (
    <div className="border rounded-lg p-4">
      <ul className="space-y-4">
        {materials.length === 0 ? (
          <li className="text-center text-muted-foreground p-4">
            No hay materiales pendientes.
          </li>
        ) : (
          materials.map((material) => (
            <li
              key={material.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg gap-4"
            >
              <div>
                <p className="font-bold">{material.nombre}</p>
                <p className="text-sm text-muted-foreground">
                  {material.descripcion}
                </p>
                <span>Material id: {material.id}</span>
              </div>
              <div className="flex gap-x-2 flex-shrink-0">
                {/* 5. Botones con onClick funcionales */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleApprove(material.id)}
                >
                  <Check className="mr-2 h-4 w-4" /> Aprobar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(material.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
