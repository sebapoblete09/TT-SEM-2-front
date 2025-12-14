"use client";

import { useState, useEffect, useMemo } from "react";
import FilterSection, { FilterOptions } from "./Filter-Section";
import { MaterialCard } from "@/components/ui/materialCard";
import { SearchX, Sparkles } from "lucide-react"; // Nuevos iconos
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Material_Card } from "@/types/materials";
import { getFilterServices } from "@/services/materialServices";
import ScrollReveal from "@/components/ui/scrollReveal"; // <--- 1. Importamos la animación
import HeroMaterial from "./Header";

type Props = {
  initialMaterials: Material_Card[];
};

export default function Materials_Section({ initialMaterials }: Props) {
  // --- ESTADOS DE FILTRO (Igual que antes) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [isDerivados, setIsDerivados] = useState(false);
  const [selectedHerramientas, setSelectedHerramientas] = useState<string[]>(
    []
  );
  const [selectedComposicion, setSelectedComposicion] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("newest");

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    herramientas: [],
    composicion: [],
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const options = await getFilterServices();
        if (options.herramientas) options.herramientas.sort();
        if (options.composicion) options.composicion.sort();
        setFilterOptions(options);
      } catch (error) {
        console.error("Error cargando filtros:", error);
      }
    };
    loadOptions();
  }, []);

  const filteredMaterials = useMemo(() => {
    const result = initialMaterials.filter((mat) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        mat.nombre.toLowerCase().includes(term) ||
        mat.descripcion.toLowerCase().includes(term);

      const emptyUUID = "00000000-0000-0000-0000-000000000000";
      let matchesDerivado = true;
      if (isDerivados) {
        matchesDerivado = !!mat.derivado_de && mat.derivado_de !== emptyUUID;
      }

      let matchesComposicion = true;
      if (selectedComposicion.length > 0) {
        if (!mat.composicion || mat.composicion.length === 0) {
          matchesComposicion = false;
        } else {
          matchesComposicion = selectedComposicion.some((selected) => {
            const selectedLower = selected.toLowerCase();
            return mat.composicion?.some((matComp) =>
              matComp.toLowerCase().includes(selectedLower)
            );
          });
        }
      }

      return matchesSearch && matchesDerivado && matchesComposicion;
    });

    return result.sort((a, b) => {
      if (sortOrder === "a-z") return a.nombre.localeCompare(b.nombre);
      if (sortOrder === "z-a") return b.nombre.localeCompare(a.nombre);
      return 0; // Backend default (newest)
    });
  }, [
    initialMaterials,
    searchTerm,
    isDerivados,
    selectedHerramientas,
    selectedComposicion,
    sortOrder,
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto  px-12 py-8">
        {/* 2. NUEVO ENCABEZADO "HERO"*/}
        <HeroMaterial totalMaterials={initialMaterials.length} />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-72 flex-shrink-0 relative lg:sticky lg:top-24 z-10">
            <ScrollReveal className="delay-100">
              <FilterSection
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isDerivados={isDerivados}
                setIsDerivados={setIsDerivados}
                selectedHerramientas={selectedHerramientas}
                setSelectedHerramientas={setSelectedHerramientas}
                selectedComposicion={selectedComposicion}
                setSelectedComposicion={setSelectedComposicion}
                options={filterOptions}
              />
            </ScrollReveal>
          </aside>

          {/* RESULTADOS */}
          <main className="flex-1 w-full">
            {/* BARRA DE CONTROL */}
            <ScrollReveal className="delay-200">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-slate-200 gap-4">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Mostrando <strong>{filteredMaterials.length}</strong>{" "}
                  resultados
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Ordenar por:</span>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[180px] bg-white border-slate-200 shadow-sm">
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
            </ScrollReveal>

            {/* LISTA DE RESULTADOS */}
            {filteredMaterials.length === 0 ? (
              <ScrollReveal>
                <div className="py-20 text-center flex flex-col items-center bg-white rounded-2xl border border-dashed border-slate-200">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <SearchX className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    No se encontraron materiales
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Intenta ajustar tus filtros de búsqueda o limpia los filtros
                    actuales.
                  </p>
                </div>
              </ScrollReveal>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMaterials.map((material, index) => (
                  <ScrollReveal key={material.id} className="h-full">
                    <MaterialCard material={material} from="public" />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
