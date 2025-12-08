"use client";

import { useState } from "react";
import { MaterialCard } from "@/components/ui/materialCard";
import { Material_Card } from "@/types/materials";
import { Search, FlaskConical, Users, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";

type MaterialsProfileProps = {
  initialMaterials: Material_Card[]; // Lista 1: Creados por mí
  colaboraciones?: Material_Card[]; // Lista 2: Donde soy colaborador
};

export default function Materials_Profile({
  initialMaterials = [],
  colaboraciones = [],
}: MaterialsProfileProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "todos" | "creados" | "colaboraciones"
  >("todos");

  // 1. SELECCIÓN DE LISTA BASE
  // Dependiendo del Tab, elegimos qué array vamos a filtrar
  let listaBase: Material_Card[] = [];

  if (activeTab === "todos") {
    listaBase = [...initialMaterials, ...colaboraciones];
  } else if (activeTab === "creados") {
    listaBase = initialMaterials;
  } else if (activeTab === "colaboraciones") {
    listaBase = colaboraciones;
  }

  // 2. FILTRADO POR BÚSQUEDA (Sobre la lista base seleccionada)
  const materialsFiltrados = listaBase.filter((material) => {
    const term = searchTerm.toLowerCase();
    return (
      material.nombre.toLowerCase().includes(term) ||
      material.descripcion.toLowerCase().includes(term)
    );
  });

  return (
    <section
      id="mis-materiales"
      className="py-8 animate-in fade-in duration-500"
    >
      <div className="container mx-auto max-w-7xl">
        {/* --- HEADER Y CONTROLES --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          {/* Título Dinámico */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              {activeTab === "todos" && "Todos mis Materiales"}
              {activeTab === "creados" && "Materiales Creados"}
              {activeTab === "colaboraciones" && "Colaboraciones"}

              <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-1">
                {materialsFiltrados.length}
              </span>
            </h2>
          </div>

          {/* Barra de Herramientas */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar..."
                className="pl-9 h-10 bg-white border-slate-200 focus-visible:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tabs (Segmented Control) */}
            <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200 overflow-x-auto w-fit mx-auto">
              <button
                onClick={() => setActiveTab("todos")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "todos"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Todos</span>
              </button>
              <button
                onClick={() => setActiveTab("creados")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "creados"
                    ? "bg-white text-green-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span className="hidden sm:inline">Creados</span>
              </button>
              <button
                onClick={() => setActiveTab("colaboraciones")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "colaboraciones"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Colaboraciones</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- GRID DE RESULTADOS --- */}
        {materialsFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-slate-900 font-medium">
              No se encontraron materiales
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {searchTerm
                ? "Intenta con otra búsqueda."
                : "Esta lista está vacía."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materialsFiltrados.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                from="public"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
