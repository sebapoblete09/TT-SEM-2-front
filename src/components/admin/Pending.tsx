// components/admin/MaterialPending.tsx
// (Sigue siendo un Server Component, sin "use client")

import { TabsContent } from "@/components/ui/tabs";
import { Material } from "@/types/materials";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MaterialClientList } from "./MaterialClientList"; // <-- 1. Importa el nuevo componente

export default async function MaterialPending() {
  const supabase = createClient();

  // ... (Tu lógica de getSession y redirect es perfecta) ...
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // ... (Tu lógica de fetch es perfecta) ...
  const baseUrl = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/materials/pending`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return <p>Error al cargar los materiales pendientes.</p>;
  }

  const data = await res.json();
  const Pending_Materials: Material[] = data.materiales || [];

  // 2. Renderiza el wrapper y pasa los datos al cliente
  return (
    <TabsContent value="pending" className="mt-4">
      <p className="text-muted-foreground mb-4 px-4">
        Aprueba o elimina los materiales enviados por la comunidad.
      </p>

      {/* 3. Pasa los datos al componente cliente */}
      <MaterialClientList
        initialMaterials={Pending_Materials}
        access_token={session.access_token}
      />
    </TabsContent>
  );
}
