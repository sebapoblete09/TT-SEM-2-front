// components/ui/FilterSection.tsx
"use client";

import { Search, Filter, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import categories from "@/const/Categories";

// Definimos las props
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
  // Limpiar todo
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-slate-800">
          <Filter className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-lg">Filtros</h3>
        </div>

        {(searchTerm || selectedCategory) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto p-0 text-xs text-red-500 hover:text-red-700 hover:bg-transparent"
          >
            Limpiar todo
          </Button>
        )}
      </div>

      {/* Buscador INSTANTÁNEO */}
      <div className="mb-8">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
          Búsqueda
        </label>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
          <Input
            placeholder="Nombre, material..."
            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-green-500 transition-all"
            value={searchTerm} // Controlado por el estado del padre
            onChange={(e) => setSearchTerm(e.target.value)} // Actualización instantánea
          />
        </div>
      </div>

      {/* Categorías */}
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
          Categorías
        </label>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
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
                onClick={() => setSelectedCategory(isActive ? null : cat)}
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
  );
}
