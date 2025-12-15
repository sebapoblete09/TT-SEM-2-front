/**
 * @file page.tsx
 * @description Página de Perfil de Usuario con lógica condicional por Rol.
 */
import { getUserDataService } from "@/services/userServices";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
// Asegúrate de que la ruta sea correcta (ej: "@/actions/user-actions")
import { requestCollaboratorAction } from "@/actions/user";

import { usuario, estadisticas } from "@/types/user";
import { Material_Card, Material } from "@/types/materials";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import Materials_Profile from "@/components/profile/ProfileMaterials";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Verificación de Sesión
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const userAvatar = session?.user?.user_metadata?.avatar_url;

  // 2. Procesamiento de Datos
  let data;
  try {
    data = await getUserDataService(session.access_token);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return (
      <div className="container py-20 text-center text-red-500">
        Hubo un problema al cargar tu perfil. Intenta recargar.
      </div>
    );
  }

  const usuario: usuario = data.usuario;
  const estadisticas: estadisticas = data.estadisticas;

  // Normalizamos el rol
  const isLector = usuario.rol?.toLowerCase() === "lector";

  // Mapeo de datos (Tu lógica actual)
  const materiales_data: Material[] = data.materiales_creados.concat(
    data.materiales_colaborador
  );

  const materiales_creados: Material_Card[] = data.materiales_creados.map(
    (material: Material) => ({
      id: material.id,
      nombre: material.nombre,
      descripcion: material.descripcion,
      composicion: material.composicion,
      derivado_de: material.derivado_de,
      primera_imagen_galeria: material.galeria?.[0]?.url_imagen || "",
      estado: material.estado,
    })
  );

  const materiales_colaboraciones: Material_Card[] =
    data.materiales_colaborador?.map((material: Material) => ({
      id: material.id,
      nombre: material.nombre,
      descripcion: material.descripcion,
      composicion: material.composicion,
      derivado_de: material.derivado_de,
      primera_imagen_galeria: material.galeria?.[0]?.url_imagen || "",
      estado: material.estado,
    }));

  // 3. Renderizado
  return (
    <div className="container mx-auto max-w-7xl py-10 px-4 space-y-10">
      {/* --- GRID SUPERIOR --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 h-full">
          <ProfileHeader usuario={usuario} userAvatar={userAvatar} />
        </div>
        <div className="lg:col-span-1 h-full">
          <ProfileStats estadisticas={estadisticas} />
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR --- */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {isLector ? (
          // VISTA BLOQUEADA (LECTOR)
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-4 rounded-full shadow-sm mb-6">
              <Lock className="w-10 h-10 text-slate-400" />
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              Desbloquea tu potencial de Creador
            </h3>

            <p className="text-slate-500 max-w-lg mb-8 text-lg leading-relaxed">
              Actualmente tienes perfil de <strong>Lector</strong>. Para
              registrar nuevas recetas, editar materiales y colaborar en
              investigaciones, necesitas solicitar el rol de Colaborador.
            </p>

            <form
              action={async () => {
                "use server";
                await requestCollaboratorAction();
              }}
            >
              <Button
                type="submit"
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg gap-2 pl-6 pr-6"
              >
                Solicitar Rol de Colaborador
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <p className="text-xs text-slate-400 mt-4">
              La solicitud será revisada por un administrador.
            </p>
          </div>
        ) : (
          // VISTA PERMITIDA (COLABORADOR/ADMIN)
          <Materials_Profile
            initialMaterials={materiales_creados}
            initialMaterialsData={materiales_data}
            colaboraciones={materiales_colaboraciones}
          />
        )}
      </div>
    </div>
  );
}
