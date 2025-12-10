// components/ui/FilterSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import categories from "@/const/Categories";

interface FilterSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export default function FilterSection({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // EFECTO: Bloquear el scroll del body cuando el filtro está abierto en móvil
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const clearFilters = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSearchTerm("");
    setSelectedCategory(null);
  };

  return (
    <>
      {/* OVERLAY OSCURO (Solo móvil, cuando está abierto)*/}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)} // Click afuera cierra
        />
      )}

      {/* CONTENEDOR PRINCIPAL*/}
      <div
        className={`
          bg-white transition-all duration-300
          border border-slate-200 shadow-sm
          
          /* ESTILOS MÓVIL (cuando abierto): Fijo, pantalla completa, scroll propio */
          ${
            isOpen
              ? "fixed inset-x-0 bottom-0 top-20 z-50 rounded-t-2xl border-b-0 overflow-y-auto shadow-2xl"
              : "rounded-2xl relative" // Estado cerrado normal
          }

          /* ESTILOS DESKTOP (lg): Siempre estático, sin fixed */
          lg:static lg:inset-auto lg:h-auto lg:z-auto lg:rounded-2xl lg:border lg:shadow-sm lg:overflow-visible
        `}
      >
        {/* HEADER */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between p-5 cursor-pointer lg:cursor-default sticky top-0 bg-white z-10 border-b border-transparent lg:border-none hover:bg-slate-50 lg:hover:bg-white rounded-t-2xl"
        >
          <div className="flex items-center gap-2 text-slate-800">
            <Filter className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-lg">Filtros</h3>
          </div>

          <div className="flex items-center gap-2">
            {(searchTerm || selectedCategory) && (
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

        {/* CONTENIDO (Cuerpo) */}
        <div
          className={`px-5 pb-5 pt-2 ${isOpen ? "block" : "hidden"} lg:block`}
        >
          {/* Buscador */}
          <div className="mb-8">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Búsqueda
            </label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
              <Input
                placeholder="Nombre, material..."
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-green-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Categorías */}
          <div className="pb-10 lg:pb-0">
            {" "}
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
              Categorías
            </label>
            <div className="flex flex-col gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCategory(null);
                  setIsOpen(false); // Opcional: Cerrar al seleccionar
                }}
                className={`flex items-center justify-between p-2 rounded-lg text-sm transition-all ${
                  !selectedCategory
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>Todas</span>
                {!selectedCategory && <Check className="w-4 h-4" />}
              </button>

              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(isActive ? null : cat);
                      setIsOpen(false); // Opcional: Cerrar al seleccionar
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-sm transition-all text-left ${
                      isActive
                        ? "bg-green-50 text-green-700 font-medium ring-1 ring-green-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{cat}</span>
                    {isActive && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
