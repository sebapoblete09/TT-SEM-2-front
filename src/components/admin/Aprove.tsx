// components/admin/MaterialPending.tsx

import { TabsContent } from "@/components/ui/tabs";
import { Material } from "@/types/materials";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MaterialClientList } from "./MaterialClientList";

export default async function MaterialAprove() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/materials`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return <p>Error al cargar los materiales pendientes.</p>;
  }

  const data = await res.json();
  const Aprove_Material: Material[] = Array.isArray(data)
    ? data
    : data.materiales || [];

  // 2. Renderiza el wrapper y pasa los datos al cliente
  return (
    <TabsContent value="aprove" className="mt-4">
      <p className="text-muted-foreground mb-4 px-4">
        Aprueba o elimina los materiales enviados por la comunidad.
      </p>
      <MaterialClientList
        initialMaterials={Aprove_Material}
        access_token={session.access_token}
        filterType="approved" // <--- Esto hace que si lo rechazas, desaparezca de aquí
      />
    </TabsContent>
  );
}
