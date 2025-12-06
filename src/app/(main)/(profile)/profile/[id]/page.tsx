"use client";

/**
 * @file page.tsx
 * @description Página de Perfil Público de Usuario (Client Component).
 * Permite visualizar la información de un investigador, sus estadísticas
 * y su portafolio de materiales (tanto propios como colaborativos).
 * Utiliza una estrategia de carga asíncrona (useEffect) para obtener los datos.
 */
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Tipos e Interfaces
import { usuario, estadisticas } from "@/types/user";
import { Material_Card, Material } from "@/types/materials";

// Componentes de UI
import { ProfileStats } from "@/components/PublicProfile/ProfileStats";
import Materials_Profile from "@/components/PublicProfile/ProfileMaterials";
import { ProfileHeader } from "@/components/PublicProfile/ProfileHeader";
import LoadingCard from "@/components/ui/loading";

export default function ProfilePage() {
  // --- ESTADOS DE DATOS ---
  const [usuario, setUsuario] = useState<usuario | null>(null);
  const [materiales_creados, setMaterialesCreados] = useState<Material_Card[]>(
    []
  );
  const [materiales_colaboraciones, setMaterialesColaboraciones] = useState<
    Material_Card[]
  >([]);
  const [estadisticas, setEstadisticas] = useState<estadisticas>({
    materiales_creados: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  /**
   * Efecto principal de carga de datos.
   * Se ejecuta al montar el componente o cambiar el ID de usuario.
   */
  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const baseUrl =
          process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/users/${id}/public`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          // Manejar error (ej. mostrar una página de error)
          return <p>Error al cargar el perfil. Intenta de nuevo.</p>;
        }

        // Asignación de datos principales
        const data = await res.json();
        setUsuario(data.perfil);
        setEstadisticas(data.estadisticas);

        // Mapeamos los materiales creados
        setMaterialesCreados(
          data.materiales_creados.map((material: Material) => {
            return {
              id: material.id,
              nombre: material.nombre,
              descripcion: material.descripcion,
              composicion: material.composicion, // La API ya lo da como string[]
              derivado_de: material.derivado_de,

              // Lógica clave para la imagen:
              // Usamos "optional chaining" (?.) para evitar errores si 'galeria' está vacío.
              // Obtenemos la url_imagen del primer (0) item, o un string vacío si no existe.
              primera_imagen_galeria: material.galeria?.[0]?.url_imagen || "",
              estado: material.estado,
            };
          })
        );

        // Mapeamos las colaboraciones
        setMaterialesColaboraciones(
          data.materiales_colaborador.map((material: Material) => {
            return {
              id: material.id,
              nombre: material.nombre,
              descripcion: material.descripcion,
              composicion: material.composicion, // La API ya lo da como string[]
              derivado_de: material.derivado_de,
              primera_imagen_galeria: material.galeria?.[0]?.url_imagen || "",
              estado: material.estado,
            };
          })
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error desconocido";
        console.error(message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return <LoadingCard />;
  }

  if (!usuario) {
    return (
      <div className="container py-10 text-center text-red-500">
        Usuario no encontrado
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-10 px-4 space-y-10">
      {/* SECCIÓN SUPERIOR: Resumen del Investigador */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Izquierda: Identidad (Foto, Nombre, Rol) */}
        <div className="lg:col-span-2 h-full">
          <ProfileHeader usuario={usuario} />
        </div>

        {/* Derecha: Métricas de Impacto */}
        <div className="lg:col-span-1 h-full">
          <ProfileStats estadisticas={estadisticas} />
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Portafolio de Materiales */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Componente de lista con filtros integrados (Creados vs Colaboraciones) */}
        <Materials_Profile
          initialMaterials={materiales_creados}
          colaboraciones={materiales_colaboraciones}
        />
      </div>
    </div>
  );
}
