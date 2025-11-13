"use client";

import { useEffect, useState } from "react";
import { MaterialCard } from "@/components/ui/materialCard";
import { Material_Card } from "@/types/materials";
import { createClient } from "@/lib/supabase/client";

export default function Materials_Profile() {
  const [materials, setMaterials] = useState<Material_Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [materialCount, setMaterialCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchMaterials = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      // Valida que tengas el token
      if (sessionError || !session?.access_token) {
        throw new Error(
          sessionError?.message || "No se encontró sesión. Inicia sesión."
        );
      }

      const accessToken = session.access_token;
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        });

        if (!res.ok)
          throw new Error(`Error al obtener materiales (${res.status})`);

        const data = await res.json();

        // Asumiendo que la API ya devuelve el formato correcto
        setMaterials(Array.isArray(data) ? data : []);
        setMaterialCount(data.length);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
          setError(err.message);
        } else {
          console.error("Error desconocido:", err);
          setError("Error desconocido al cargar materiales");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  if (loading) {
    return (
      <section id="explore" className="py-12 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-muted-foreground">Cargando materiales...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="explore" className="py-12 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </section>
    );
  }

  if (materials.length === 0) {
    return (
      <section id="explore" className="py-12 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-muted-foreground">
            No hay materiales registrados aún.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="explore" className="py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Mis Materiales: {materialCount}
            </h2>
            <p className="text-muted-foreground">
              Todos mis materiales creados
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      </div>
    </section>
  );
}
