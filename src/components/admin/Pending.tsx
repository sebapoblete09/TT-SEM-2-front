import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPendingMaterialsService } from "@/services/materialServices";
import { MaterialClientList } from "./MaterialClientList";
import { Material } from "@/types/materials";

export default async function MaterialPending() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Inicializamos la variable segura
  let Pending_Materials: Material[] = [];
  let errorMsg: string | null = null;

  try {
    // Intentamos obtener los datos
    const data = await getPendingMaterialsService(session.access_token);
    // Asignación defensiva
    Pending_Materials = data?.materiales || [];
  } catch (error) {
    console.error("Fallo crítico al cargar pendientes:", error);
    errorMsg = "No se pudo conectar con el servidor de materiales.";
  }

  return (
    <div className="mt-4">
      <p className="text-muted-foreground mb-4 px-4">
        Aprueba o elimina los materiales enviados por la comunidad.
      </p>

      {/* Si no hay error pero la lista está vacía */}
      {!errorMsg && Pending_Materials.length === 0 ? (
        <div className="p-8 text-center text-slate-500 border rounded-lg bg-slate-50 mx-4">
          No hay materiales pendientes de revisión.
        </div>
      ) : null}

      {/* Si hay materiales, mostramos la lista */}
      {Pending_Materials.length > 0 && (
        <MaterialClientList
          initialMaterials={Pending_Materials}
          filterType="pending"
        />
      )}
    </div>
  );
}
