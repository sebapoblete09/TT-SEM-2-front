"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import FilterSection, { FilterOptions } from "./Filter-Section";
import { MaterialCard } from "@/components/ui/materialCard";
import { SearchX, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Material_Card } from "@/types/materials";
import { getFilterServices } from "@/services/materialServices";
import ScrollReveal from "@/components/ui/scrollReveal";
import HeroMaterial from "./Header";

type Props = {
  initialMaterials: Material_Card[];
  initialDerivados?: boolean; // Opcional
};

export default function Materials_Section({
  initialMaterials,
  initialDerivados = false,
}: Props) {
  // --- ESTADOS DE FILTRO ---
  const [searchTerm, setSearchTerm] = useState("");
  const [isDerivados, setIsDerivados] = useState(initialDerivados);
  const [selectedHerramientas, setSelectedHerramientas] = useState<string[]>(
    []
  );
  const [selectedComposicion, setSelectedComposicion] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("newest");

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    herramientas: [],
    composicion: [],
  });

  // 1. Creamos una referencia para el contenedor de los resultados
  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (initialDerivados && resultsRef.current) {
      // Un pequeño timeout asegura que el DOM esté listo
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [initialDerivados]);

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
      // 1. Filtro Texto (Nombre y Descripción)
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        mat.nombre.toLowerCase().includes(term) ||
        mat.descripcion.toLowerCase().includes(term);

      // 2. Filtro Derivados
      const emptyUUID = "00000000-0000-0000-0000-000000000000";
      let matchesDerivado = true;
      if (isDerivados) {
        matchesDerivado = !!mat.derivado_de && mat.derivado_de !== emptyUUID;
      }

      // 3. Filtro Composición (CORREGIDO)
      let matchesComposicion = true;
      if (selectedComposicion.length > 0) {
        // Si el material no tiene composición, descartarlo
        if (!mat.composicion || mat.composicion.length === 0) {
          matchesComposicion = false;
        } else {
          // Revisamos si ALGUN item seleccionado está presente en el material
          matchesComposicion = selectedComposicion.every((selected) => {
            const selectedLower = selected.toLowerCase();

            // Buscamos dentro del array de composición del material
            return mat.composicion?.some((matComp: any) => {
              // Verificamos si es un string (dato viejo) o un objeto (dato nuevo)
              const elementoNombre =
                typeof matComp === "string" ? matComp : matComp.elemento; // Accedemos a la propiedad .elemento

              return elementoNombre?.toLowerCase().includes(selectedLower);
            });
          });
        }
      }

      let matchesHerramientas = true;
      if (selectedHerramientas.length > 0) {
        if (!mat.herramientas || mat.herramientas.length === 0) {
          matchesHerramientas = false;
        } else {
          matchesHerramientas = selectedHerramientas.some((selected) => {
            const selectedLower = selected.toLowerCase();
            return mat.herramientas?.some((matTool) =>
              String(matTool).toLowerCase().includes(selectedLower)
            );
          });
        }
      }

      return (
        matchesSearch &&
        matchesDerivado &&
        matchesComposicion &&
        matchesHerramientas
      );
    });

    // Ordenamiento
    return result.sort((a, b) => {
      if (sortOrder === "a-z") return a.nombre.localeCompare(b.nombre);
      if (sortOrder === "z-a") return b.nombre.localeCompare(a.nombre);
      return 0;
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
      <div className="container mx-auto px-4 md:px-12 py-8">
        {/* HERO HEADER */}
        <HeroMaterial totalMaterials={initialMaterials.length} />

        <div
          ref={resultsRef}
          className="flex flex-col lg:flex-row gap-8 items-start mt-8"
        >
          {/* SIDEBAR FILTROS */}
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

          {/* AREA PRINCIPAL */}
          <main className="flex-1 w-full min-w-0">
            {/* BARRA DE CONTROL (Ordenamiento) */}
            <ScrollReveal className="delay-200">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-slate-200 gap-4">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Mostrando <strong>{filteredMaterials.length}</strong>{" "}
                  resultados
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-sm text-slate-400 whitespace-nowrap">
                    Ordenar por:
                  </span>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-white border-slate-200 shadow-sm">
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

            {/* GRID DE MATERIALES */}
            {filteredMaterials.length === 0 ? (
              <ScrollReveal>
                <div className="py-20 text-center flex flex-col items-center bg-white rounded-2xl border border-dashed border-slate-200">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <SearchX className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    No se encontraron materiales
                  </h3>
                  <p className="text-slate-500 mt-1 max-w-xs mx-auto">
                    Intenta ajustar tus términos de búsqueda o limpia los
                    filtros activos.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedComposicion([]);
                      setSelectedHerramientas([]);
                      setIsDerivados(false);
                    }}
                    className="mt-4 text-sm text-green-600 font-medium hover:text-green-700 hover:underline"
                  >
                    Limpiar todos los filtros
                  </button>
                </div>
              </ScrollReveal>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMaterials.map((material) => (
                  <ScrollReveal key={material.id} className="h-full">
                    {/* Pasamos el objeto material completo según tu nuevo tipo */}
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
