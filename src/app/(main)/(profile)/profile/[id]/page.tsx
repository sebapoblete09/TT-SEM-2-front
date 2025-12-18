// src/app/(public)/profile/[id]/page.tsx (o tu ruta correspondiente)

import { notFound } from "next/navigation";
import { Metadata } from "next";

// Servicios y Tipos
import { getPublicUserProfileService } from "@/services/userServices";
import { usuario, estadisticas } from "@/types/user";
import { Material_Card, Material } from "@/types/materials";

// Componentes UI
import { ProfileStats } from "@/components/PublicProfile/ProfileStats";
import Materials_Profile from "@/components/PublicProfile/ProfileMaterials";
import { ProfileHeader } from "@/components/PublicProfile/ProfileHeader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getPublicUserProfileService(id);
    return {
      title: `${data.perfil.nombre} | Perfil Investigador`,
      description:
        data.perfil.biografia || "Perfil público en el catálogo de materiales.",
    };
  } catch (e) {
    return { title: "Perfil no encontrado" };
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  // 1. Obtener ID (Next.js 15)
  const { id } = await params;

  let perfilData = null;

  try {
    // 2. Llamada al Servicio (Server Side)
    perfilData = await getPublicUserProfileService(id);
  } catch (error) {
    console.error("Error cargando perfil público:", error);
    // Si falla el fetch, mostramos 404
    notFound();
  }

  // 3. Extracción y Mapeo de Datos
  // Realizamos la transformación de datos aquí en el servidor para enviar
  // al cliente solo lo que necesita (Material_Card).

  const usuario: usuario = perfilData.perfil;
  const estadisticas: estadisticas = perfilData.estadisticas;

  // Función helper para mapear (DRY - Don't Repeat Yourself)
  const mapToCard = (m: Material): Material_Card => ({
    id: m.id,
    nombre: m.nombre,
    descripcion: m.descripcion,
    composicion: m.composicion,
    derivado_de: m.derivado_de,
    herramientas: m.herramientas,
    primera_imagen_galeria: m.galeria?.[0]?.url_imagen || "",
    estado: m.estado,
  });

  const materiales_creados: Material_Card[] =
    perfilData.materiales_creados.map(mapToCard);
  const materiales_colaboraciones: Material_Card[] =
    perfilData.materiales_colaborador.map(mapToCard);

  // 4. Renderizado
  return (
    <div className="container mx-auto max-w-7xl py-10 px-4 space-y-10">
      {/* SECCIÓN SUPERIOR: Resumen del Investigador */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Izquierda: Identidad */}
        <div className="lg:col-span-2 h-full">
          <ProfileHeader usuario={usuario} />
        </div>

        {/* Derecha: Métricas */}
        <div className="lg:col-span-1 h-full">
          <ProfileStats estadisticas={estadisticas} />
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Portafolio */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Componente Cliente que recibe los datos listos */}
        <Materials_Profile
          initialMaterials={materiales_creados}
          colaboraciones={materiales_colaboraciones}
        />
      </div>
    </div>
  );
}
