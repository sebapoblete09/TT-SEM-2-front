import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaterialPending from "@/components/admin/Pending";
import UsersSection from "@/components/admin/Users";
import { ShieldCheck } from "lucide-react";
import Stats from "@/components/admin/Stats";
import { DashboardCounts } from "@/types/dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MaterialAprove from "@/components/admin/Aprove";

async function getDashboardStats(): Promise<DashboardCounts> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const baseUrl = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";

  // ¡AHORA SOLO ES UNA LLAMADA!
  const res = await fetch(`${baseUrl}/users/stats`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    // Si falla, retornamos ceros para que no rompa la UI
    return { pendientes: 0, aprobados: 0, usuarios: 0 };
  }

  return await res.json();
}

export default async function AdminPage() {
  const stats = await getDashboardStats();
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header con fondo blanco para separar del contenido */}
      <div className="bg-white border-b border-slate-200 mb-8">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Panel de Administración
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                Gestiona la plataforma, aprueba contenido y administra usuarios.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {/* Pasamos los datos limpios */}
        <Stats
          pendientes={stats.pendientes}
          aprobados={stats.aprobados}
          usuarios={stats.usuarios}
        />

        {/* Tabs Mejorados */}
        <Tabs defaultValue="pending" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-3 h-12 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
              <TabsTrigger
                value="pending"
                className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none h-10"
              >
                Materiales Pendientes
              </TabsTrigger>
              <TabsTrigger
                value="aprove"
                className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none h-10"
              >
                Materiales Aprobados
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none h-10"
              >
                Gestionar Usuarios
              </TabsTrigger>
            </TabsList>
          </div>

          {/* --- Contenido: Materiales --- */}
          <TabsContent
            value="pending"
            className="animate-in fade-in-50 duration-300 slide-in-from-bottom-2"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
              <MaterialPending />
            </div>
          </TabsContent>

          <TabsContent
            value="aprove"
            className="animate-in fade-in-50 duration-300 slide-in-from-bottom-2"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
              <MaterialAprove />
            </div>
          </TabsContent>

          {/* --- Contenido: Usuarios --- */}
          <TabsContent
            value="users"
            className="animate-in fade-in-50 duration-300 slide-in-from-bottom-2"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <UsersSection />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
