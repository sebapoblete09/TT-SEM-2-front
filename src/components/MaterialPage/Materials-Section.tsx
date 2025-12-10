"use client";

import { useState, useEffect, useMemo } from "react";
import FilterSection, { FilterOptions } from "./Filter-Section"; // Asegúrate de exportar la interfaz en FilterSection
import { MaterialCard } from "@/components/ui/materialCard";
import { SearchX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Material_Card } from "@/types/materials";
import { getFilterServices } from "@/services/materialServices";

type Props = {
  initialMaterials: Material_Card[];
};

export default function Materials_Section({ initialMaterials }: Props) {
  // --- ESTADOS DE FILTRO ---
  const [searchTerm, setSearchTerm] = useState("");
  const [isDerivados, setIsDerivados] = useState(false);
  const [selectedHerramientas, setSelectedHerramientas] = useState<string[]>(
    []
  );
  const [selectedComposicion, setSelectedComposicion] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("newest");

  // Estado para las opciones del Sidebar (que vienen del endpoint)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    herramientas: [],
    composicion: [],
  });

  // 1. CARGAR OPCIONES DEL SIDEBAR AL MONTAR
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const options = await getFilterServices();
        // Ordenamos alfabéticamente para mejor UX
        if (options.herramientas) options.herramientas.sort();
        if (options.composicion) options.composicion.sort();

        setFilterOptions(options);
      } catch (error) {
        console.error("Error cargando filtros:", error);
      }
    };
    loadOptions();
  }, []);

  // 2. LÓGICA DE FILTRADO (CLIENT SIDE - useMemo)
  const filteredMaterials = useMemo(() => {
    // A. Filtrado
    const result = initialMaterials.filter((mat) => {
      // 1. Búsqueda Texto
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        mat.nombre.toLowerCase().includes(term) ||
        mat.descripcion.toLowerCase().includes(term);

      // 2. Filtro Derivados
      // Verificamos si tiene un UUID válido (no vacío ni ceros)
      const emptyUUID = "00000000-0000-0000-0000-000000000000";
      let matchesDerivado = true;
      if (isDerivados) {
        matchesDerivado = !!mat.derivado_de && mat.derivado_de !== emptyUUID;
      }

      // 3. Filtro Herramientas (Lógica OR: Si tiene ALGUNA de las seleccionadas)

      // 4. Filtro Composición (Lógica OR)
      let matchesComposicion = true;
      if (selectedComposicion.length > 0) {
        if (!mat.composicion || mat.composicion.length === 0) {
          matchesComposicion = false;
        } else {
          matchesComposicion = selectedComposicion.some((selected) => {
            const selectedLower = selected.toLowerCase();

            // Aquí está la magia: convertimos ambos a minúsculas antes de comparar
            return mat.composicion?.some((matComp) =>
              matComp.toLowerCase().includes(selectedLower)
            );
          });
        }
      }

      return matchesSearch && matchesDerivado && matchesComposicion;
    });

    // B. Ordenamiento
    return result.sort((a, b) => {
      if (sortOrder === "a-z") return a.nombre.localeCompare(b.nombre);
      if (sortOrder === "z-a") return b.nombre.localeCompare(a.nombre);
      // Para 'newest' necesitarías un campo de fecha en el objeto Material_Card.
      // Si no lo tienes en el type, el sort original del backend se mantiene (0)
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
    <div className="min-h-screen bg-slate-50/50 animate-in fade-in duration-500">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* ENCABEZADO */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Catálogo de <span className="text-green-600">Materiales</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Explora nuestra colección de biomateriales innovadores.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-72 flex-shrink-0 relative top-24 z-10">
            <FilterSection
              // Pasamos estados
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isDerivados={isDerivados}
              setIsDerivados={setIsDerivados}
              selectedHerramientas={selectedHerramientas}
              setSelectedHerramientas={setSelectedHerramientas}
              selectedComposicion={selectedComposicion}
              setSelectedComposicion={setSelectedComposicion}
              // Pasamos las opciones cargadas del back
              options={filterOptions}
            />
          </aside>

          {/* RESULTADOS */}
          <main className="flex-1 w-full">
            {/* BARRA DE CONTROL */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-slate-200 gap-4">
              <span className="text-sm font-medium text-slate-500">
                Mostrando <strong>{filteredMaterials.length}</strong> resultados
              </span>

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

            {/* LISTA DE RESULTADOS */}
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
