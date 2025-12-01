"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { MaterialCard } from "@/components/ui/materialCard";
import { Material_Card } from "@/types/materials";
import FilterSection from "./Filter-Section"; // Tu nuevo sidebar
import { Loader2, SearchX } from "lucide-react";

export default function Materials_Section() {
  const [materials, setMaterials] = useState<Material_Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ESTADOS LOCALES PARA FILTRADO INSTANTÁNEO
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // Hook para leer la URL (ej: ?search=algas&category=bioplastico)
  const searchParams = useSearchParams();

  // 1. Cargar TODOS los materiales al inicio
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/materials-summary`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json();
        setMaterials(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const filteredMaterials = useMemo(() => {
    return materials.filter((mat) => {
      const term = searchTerm.toLowerCase();

      // 1. Filtro de Texto
      const matchesSearch =
        mat.nombre.toLowerCase().includes(term) ||
        mat.descripcion.toLowerCase().includes(term);

      // 2. Filtro de Categoría
      // Ajusta esta lógica según tus datos reales. Ejemplo: buscando en composición
      const matchesCategory = selectedCategory
        ? mat.composicion.some((c) =>
            c.toLowerCase().includes(selectedCategory.toLowerCase())
          )
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [materials, searchTerm, selectedCategory]); // Se recalcula instantáneamente al escribir

  return (
    <div className="min-h-screen bg-slate-50/50 animate-in fade-in duration-500">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* ENCABEZADO DE PÁGINA */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Catálogo de <span className="text-green-600">Materiales</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Explora nuestra colección de biomateriales innovadores,
            desarrollados por la comunidad de la UTEM.
          </p>
        </div>

        {/* LAYOUT PRINCIPAL (Sidebar + Grid) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* COLUMNA IZQ: Sidebar de Filtros (Sticky) */}
          <aside className="w-full lg:w-72 flex-shrink-0 sticky top-24 z-10">
            {/* Pasamos los estados y setters al hijo */}
            <FilterSection
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </aside>

          {/* COLUMNA DER: Resultados */}
          <main className="flex-1 w-full">
            {/* Barra de estado de resultados */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
              <span className="text-sm font-medium text-slate-500">
                Mostrando <strong>{filteredMaterials.length}</strong> resultados
              </span>
              {/* Aquí podrías poner un <Select> para ordenar por fecha */}
            </div>

            {/* ESTADOS DE CARGA / ERROR / VACÍO */}
            {loading ? (
              <div className="py-32 text-center flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-4" />
                <p className="text-slate-500">Cargando catálogo...</p>
              </div>
            ) : error ? (
              <div className="py-10 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
                Error: {error}
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <SearchX className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  No se encontraron materiales
                </h3>
                <p className="text-slate-500 mt-1">
                  Intenta ajustar tus filtros de búsqueda.
                </p>
              </div>
            ) : (
              /* GRID DE TARJETAS */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMaterials.map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
