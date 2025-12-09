// components/MaterialPage/Materials-Section.tsx
"use client";

import { useState, useMemo } from "react";
import FilterSection from "./Filter-Section";
import { MaterialCard } from "@/components/ui/materialCard";
import { SearchX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Importante: Asegúrate de importar tu tipo correcto
import { Material_Card } from "@/types/materials";

type Props = {
  initialMaterials: Material_Card[];
};

export default function Materials_Section({ initialMaterials }: Props) {
  // 1. Recibimos los datos del servidor.
  const [materials] = useState<Material_Card[]>(initialMaterials);

  // ESTADOS PARA FILTRADO Y ORDENAMIENTO
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("newest");

  // 2. LÓGICA DE FILTRADO + ORDENAMIENTO (Se mantiene igual)
  const filteredMaterials = useMemo(() => {
    // A. Primero Filtramos
    const result = materials.filter((mat) => {
      const term = searchTerm.toLowerCase();

      // Filtro de Texto
      const matchesSearch =
        mat.nombre.toLowerCase().includes(term) ||
        mat.descripcion.toLowerCase().includes(term);

      // Filtro de Categoría
      let matchesCategory = true;
      if (selectedCategory) {
        if (selectedCategory === "Derivados") {
          const emptyUUID = "00000000-0000-0000-0000-000000000000";
          matchesCategory =
            mat.derivado_de !== emptyUUID && Boolean(mat.derivado_de);
        } else {
          // Aseguramos que composicion exista antes de usar some
          matchesCategory =
            mat.composicion?.some((c: string) =>
              c.toLowerCase().includes(selectedCategory.toLowerCase())
            ) ?? false;
        }
      }

      return matchesSearch && matchesCategory;
    });

    // B. Luego Ordenamos
    return result.sort((a, b) => {
      if (sortOrder === "a-z") {
        return a.nombre.localeCompare(b.nombre);
      }
      if (sortOrder === "z-a") {
        return b.nombre.localeCompare(a.nombre);
      }
      return 0;
    });
  }, [materials, searchTerm, selectedCategory, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-50/50 animate-in fade-in duration-500">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* ENCABEZADO */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Catálogo de <span className="text-green-600">Materiales</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Explora nuestra colección de biomateriales innovadores,
            desarrollados por la comunidad de la UTEM.
          </p>
        </div>

        {/* LAYOUT PRINCIPAL */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* SIDEBAR DE FILTROS */}
          <aside className="w-full lg:w-72 flex-shrink-0 sticky top-24 z-10">
            <FilterSection
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </aside>

          {/* COLUMNA DE RESULTADOS */}
          <main className="flex-1 w-full">
            {/* BARRA DE CONTROL */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-slate-200 gap-4">
              <span className="text-sm font-medium text-slate-500">
                Mostrando <strong>{filteredMaterials.length}</strong> resultados
              </span>

              {/* SELECTOR DE ORDENAMIENTO */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Ordenar por:</span>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[180px] bg-white border-slate-200">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Más recientes</SelectItem>
                    <SelectItem value="a-z">Nombre (A-Z)</SelectItem>
                    <SelectItem value="z-a">Nombre (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* LISTA DE RESULTADOS (Sin loading state visual) */}
            {filteredMaterials.length === 0 ? (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMaterials.map((material) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    from="public"
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
