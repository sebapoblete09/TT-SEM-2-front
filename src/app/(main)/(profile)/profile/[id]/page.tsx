"use client";
import { useParams } from "next/navigation";

//importacion de tipos
import { usuario, estadisticas } from "@/types/user";
import { Material_Card, Material } from "@/types/materials";
import { ProfileStats } from "@/components/PublicProfile/ProfileStats";
import Materials_Profile from "@/components/PublicProfile/ProfileMaterials";
import { useEffect, useState } from "react";
import { ProfileHeader } from "@/components/PublicProfile/ProfileHeader";
import LoadingCard from "@/components/ui/loading";

export default function ProfilePage() {
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
        const data = await res.json();
        setUsuario(data.perfil);
        setEstadisticas(data.estadisticas);
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
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return <LoadingCard />;
  }

  // 2. SI TERMINÓ DE CARGAR PERO NO HAY USUARIO (ERROR)
  if (!usuario) {
    return (
      <div className="container py-10 text-center text-red-500">
        Usuario no encontrado
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-10 px-4 space-y-10">
      {/* SECCIÓN SUPERIOR: Banner + Stats en Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Columna Izquierda (2/3): Perfil Header */}
        <div className="lg:col-span-2 h-full">
          {/* Asegúrate de que ProfileHeader tenga 'h-full' si es necesario, o que se adapte */}
          <ProfileHeader usuario={usuario} />
        </div>

        {/* Columna Derecha (1/3): Stats Verticales */}
        <div className="lg:col-span-1 h-full">
          <ProfileStats estadisticas={estadisticas} />
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Materiales */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <Materials_Profile
          initialMaterials={materiales_creados}
          colaboraciones={materiales_colaboraciones}
        />
      </div>
    </div>
  );
}
