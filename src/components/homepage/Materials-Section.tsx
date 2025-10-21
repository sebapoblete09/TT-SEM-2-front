"use client";

import { useEffect, useState } from "react";
import { MaterialCard } from "@/components/ui/materialCard";
import { Material_Card } from "@/types/materials";

export default function Materials_Section({
  setMaterialCountAction,
}: {
  setMaterialCountAction: (count: number) => void;
}) {
  const [materials, setMaterials] = useState<Material_Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch("http://localhost:8080/materials-summary", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok)
          throw new Error(`Error al obtener materiales (${res.status})`);

        const data = await res.json();

        // Asumiendo que la API ya devuelve el formato correcto
        setMaterials(Array.isArray(data) ? data : []);
        setMaterialCountAction(data.length);
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
            <h2 className="text-3xl font-bold mb-2">Materiales Destacados</h2>
            <p className="text-muted-foreground">
              Explora nuestra colección de biomateriales innovadores
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
