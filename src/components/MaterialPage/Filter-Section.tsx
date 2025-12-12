"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Definimos la estructura de las opciones que vienen del backend
export interface FilterOptions {
  herramientas: string[];
  composicion: string[];
}

interface FilterSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Nuevos Estados de Filtros
  isDerivados: boolean;
  setIsDerivados: (v: boolean) => void;

  selectedHerramientas: string[];
  setSelectedHerramientas: (v: string[]) => void;

  selectedComposicion: string[];
  setSelectedComposicion: (v: string[]) => void;

  // Las opciones que vienen del endpoint
  options: FilterOptions;
}

export default function FilterSection({
  searchTerm,
  setSearchTerm,
  isDerivados,
  setIsDerivados,
  selectedHerramientas,
  setSelectedHerramientas,
  selectedComposicion,
  setSelectedComposicion,
  options,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(false); // Para móvil

  // Estado para colapsar/expandir las listas en el sidebar
  const [expandHerramientas, setExpandHerramientas] = useState(false);
  const [expandComposicion, setExpandComposicion] = useState(false);

  // Bloqueo de scroll en móvil
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Limpiar todo
  const clearFilters = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSearchTerm("");
    setIsDerivados(false);
    setSelectedHerramientas([]);
    setSelectedComposicion([]);
  };

  // Helper para manejar la lógica de checkboxes (agregar/quitar del array)
  const toggleItem = (
    item: string,
    currentList: string[],
    setList: (l: string[]) => void
  ) => {
    if (currentList.includes(item)) {
      setList(currentList.filter((i) => i !== item));
    } else {
      setList([...currentList, item]);
    }
  };

  const applyFilters = () => {
    setIsOpen(false);
    // Como los filtros ya se aplicaron en tiempo real al estado del padre,
    // solo necesitamos cerrar la visualización.
  };

  return (
    <>
      {/* OVERLAY MÓVIL */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* CONTENEDOR PRINCIPAL */}
      <div
        className={`
          bg-white transition-all duration-300 border border-slate-200 shadow-sm
          ${
            isOpen
              ? "fixed inset-x-0 bottom-0 top-20 z-50 rounded-t-2xl border-b-0 overflow-y-auto shadow-2xl"
              : "rounded-2xl relative"
          }
          lg:static lg:inset-auto lg:h-auto lg:z-auto lg:rounded-2xl lg:border lg:shadow-sm lg:overflow-visible
        `}
      >
        {/* HEADER */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between p-5 cursor-pointer lg:cursor-default  bg-white z-10 border-b lg:border-none rounded-t-2xl hover:bg-slate-50 lg:hover:bg-white"
        >
          <div className="flex items-center gap-2 text-slate-800">
            <Filter className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-lg">Filtros</h3>
          </div>

          <div className="flex items-center gap-2">
            {(searchTerm ||
              isDerivados ||
              selectedHerramientas.length > 0 ||
              selectedComposicion.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto p-0 text-xs text-red-500 hover:text-red-700 hover:bg-transparent mr-2"
              >
                Limpiar todo
              </Button>
            )}
            <div className="lg:hidden text-slate-400">
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </div>
        </div>

        {/* CONTENIDO DEL FILTRO */}
        <div
          className={`px-5 pb-5 pt-2 ${
            isOpen ? "block" : "hidden"
          } lg:block space-y-6`}
        >
          {/* 1. BUSCADOR */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Búsqueda
            </label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-green-600" />
              <Input
                placeholder="Nombre, descripción..."
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* 2. CATEGORÍAS */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
              Categorías
            </label>
            <div className="flex flex-col gap-1">
              {/* Opción: TODOS (Botón para limpiar filtros específicos) */}
              <button
                onClick={clearFilters}
                className={`flex items-center justify-between p-2 rounded-lg text-sm transition-all text-left hover:bg-slate-50 ${
                  !isDerivados &&
                  selectedHerramientas.length === 0 &&
                  selectedComposicion.length === 0
                    ? "text-green-700 font-bold bg-green-50"
                    : "text-slate-600"
                }`}
              >
                Todos
              </button>

              {/* Opción: DERIVADOS (Toggle Booleano) */}
              <button
                onClick={() => setIsDerivados(!isDerivados)}
                className={`flex items-center justify-between p-2 rounded-lg text-sm transition-all text-left hover:bg-slate-50 ${
                  isDerivados
                    ? "text-green-700 font-bold bg-green-50"
                    : "text-slate-600"
                }`}
              >
                <span>Derivados</span>
                {isDerivados ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4 text-slate-300" />
                )}
              </button>

              {/* Opción: HERRAMIENTAS (Lista Desplegable)
              <div>
                <button
                  onClick={() => setExpandHerramientas(!expandHerramientas)}
                  className="flex w-full items-center justify-between p-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all"
                >
                  <span className="flex items-center gap-2">
                    Herramientas
                    {selectedHerramientas.length > 0 && (
                      <Badge className="h-5 px-1.5 bg-green-600 text-[10px] hover:bg-green-700">
                        {selectedHerramientas.length}
                      </Badge>
                    )}
                  </span>
                  {expandHerramientas ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Lista de Checkboxes 
                {expandHerramientas && (
                  <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-100 ml-2 animate-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto custom-scrollbar">
                    {options.herramientas?.length > 0 ? (
                      options.herramientas.map((tool) => {
                        const isSelected = selectedHerramientas.includes(tool);
                        return (
                          <button
                            key={tool}
                            onClick={() =>
                              toggleItem(
                                tool,
                                selectedHerramientas,
                                setSelectedHerramientas
                              )
                            }
                            className="flex items-center gap-2 w-full p-1.5 text-sm text-slate-500 hover:text-slate-800 text-left"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-green-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 shrink-0" />
                            )}
                            <span
                              className={`truncate ${
                                isSelected ? "font-medium text-green-700" : ""
                              }`}
                            >
                              {tool}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 p-2 italic">
                        No hay herramientas disponibles
                      </p>
                    )}
                  </div>
                )}
              </div>*/}

              {/* Opción: COMPOSICIÓN (Lista Desplegable) */}
              <div>
                <button
                  onClick={() => setExpandComposicion(!expandComposicion)}
                  className="flex w-full items-center justify-between p-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all"
                >
                  <span className="flex items-center gap-2">
                    Composición
                    {selectedComposicion.length > 0 && (
                      <Badge className="h-5 px-1.5 bg-purple-600 text-[10px] hover:bg-purple-700">
                        {selectedComposicion.length}
                      </Badge>
                    )}
                  </span>
                  {expandComposicion ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Lista de Checkboxes */}
                {expandComposicion && (
                  <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-100 ml-2 animate-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto custom-scrollbar">
                    {options.composicion?.length > 0 ? (
                      options.composicion.map((comp) => {
                        const isSelected = selectedComposicion.includes(comp);
                        return (
                          <button
                            key={comp}
                            onClick={() =>
                              toggleItem(
                                comp,
                                selectedComposicion,
                                setSelectedComposicion
                              )
                            }
                            className="flex items-center gap-2 w-full p-1.5 text-sm text-slate-500 hover:text-slate-800 text-left"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-purple-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 shrink-0" />
                            )}
                            <span
                              className={`truncate ${
                                isSelected ? "font-medium text-purple-700" : ""
                              }`}
                            >
                              {comp}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 p-2 italic">
                        No hay componentes disponibles
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="p-4 border-t border-slate-100 bg-white absolute bottom-0 left-0 right-0 lg:hidden rounded-b-none">
            <Button
              onClick={applyFilters}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-6 text-lg shadow-lg"
            >
              Ver Resultados
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
