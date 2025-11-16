"use client";

import { MaterialCard } from "@/components/ui/materialCard";
import { Material_Card } from "@/types/materials";
import { LuSearch } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function Materials_Section({
  setMaterialCountAction,
}: {
  setMaterialCountAction: (count: number) => void;
}) {
  const [materials, setMaterials] = useState<Material_Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 2. SOLO necesitas el estado para el filtro
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/materials-summary`, {
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

  // 4. Lógica de filtrado
  const materialsFiltrados = materials.filter((material) => {
    const busqueda = searchTerm.toLowerCase();
    return (
      material.nombre.toLowerCase().includes(busqueda) ||
      material.descripcion.toLowerCase().includes(busqueda) ||
      material.composicion.some((comp) => comp.toLowerCase().includes(busqueda))
    );
  });

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
        <div className="flex-1 relative w-full md:max-w-md">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar en mis materiales..."
            className="pl-10 h-12 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {materialsFiltrados.length === 0 ? (
          <div className="text-center py-10 ">
            <p className="text-muted-foreground">
              {materials.length > 0
                ? "No se encontraron materiales con ese término."
                : "No has creado materiales aún."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  pt-5">
            {materialsFiltrados.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
