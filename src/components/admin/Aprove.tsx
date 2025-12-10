// components/admin/MaterialAprove.tsx (Nombre correcto del archivo)

import { Material } from "@/types/materials";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MaterialClientList } from "./MaterialClientList";
import { getAllMaterialsService } from "@/services/materialServices";

export default async function MaterialAprove() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // 1. Manejo de Errores (Try/Catch)
  // Inicializamos como array vacío por seguridad
  let Aprove_Material: Material[] = [];

  try {
    const data = await getAllMaterialsService();

    Aprove_Material = Array.isArray(data) ? data : data.materiales || [];
  } catch (error) {
    console.error("Error cargando materiales aprobados:", error);
  }

  return (
    <div className="mt-4">
      <p className="text-muted-foreground mb-4 px-4">
        Lista de materiales actualmente visibles en el catálogo público.
      </p>

      {Aprove_Material.length === 0 ? (
        <div className="p-8 text-center text-slate-500 border rounded-lg bg-slate-50 mx-4">
          No hay materiales aprobados aún.
        </div>
      ) : (
        <MaterialClientList
          initialMaterials={Aprove_Material}
          filterType="approved"
        />
      )}
    </div>
  );
}
