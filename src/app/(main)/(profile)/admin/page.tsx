/**
 * @file page.tsx
 * @description Dashboard de Administración (Server Component).
 * Este es el centro de control para los administradores de la plataforma.
 * Permite visualizar métricas clave, moderar materiales pendientes y gestionar usuarios.
 *
 * Características Técnicas:
 * - Server-Side Rendering: Los datos iniciales se cargan en el servidor para mejorar el rendimiento y SEO.
 * - Protección de Ruta: Redirección automática si no hay sesión válida.
 * - Optimización de Datos: Utiliza un endpoint unificado de estadísticas para minimizar el tráfico de red.
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

// Componentes UI y Layout
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Componentes de Módulos
import UsersSection from "@/components/admin/Users";
import MaterialPending from "@/components/admin/Pending";
import MaterialAprove from "@/components/admin/Aprove";
import Stats from "@/components/admin/Stats";

// Importamos el Servicio
import { getUsersStatsService } from "@/services/userServices";
import { DashboardCounts } from "@/types/dashboard";

export default async function AdminPage() {
  // 1. Inicializar Auth
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  // 2. Carga de Datos
  // Inicializamos con valores seguros por si acaso
  let stats: DashboardCounts = { pendientes: 0, aprobados: 0, usuarios: 0 };

  try {
    // Llamada limpia al servicio
    stats = await getUsersStatsService(session.access_token);
  } catch (error) {
    console.error("Error cargando estadísticas del dashboard:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header con fondo blanco */}
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

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="container mx-auto max-w-7xl px-4">
        {/* 1. Tarjetas de Estadísticas (KPIs) */}
        <Stats
          pendientes={stats.pendientes}
          aprobados={stats.aprobados}
          usuarios={stats.usuarios}
        />

        {/* 2. Pestañas de Gestión (Sin cambios) */}
        <Tabs defaultValue="pending" className="space-y-6">
          <div className="flex flex-col justify-between gap-4">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-12 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
              <TabsTrigger
                value="pending"
                className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 h-10 px-2"
              >
                Materiales Pendientes
              </TabsTrigger>
              <TabsTrigger
                value="aprove"
                className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 h-10 px-2"
              >
                Materiales Aprobados
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 h-10 px-2"
              >
                Gestionar Usuarios
              </TabsTrigger>
            </TabsList>
          </div>

          {/* CONTENIDOS DE LAS TABS */}
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
