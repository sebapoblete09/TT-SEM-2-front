// components/Materials_Profile.tsx
"use client";

import { useEffect, useState } from "react";
import { MaterialCard } from "@/components/ui/materialCard";
import { useSearchParams } from "next/navigation";
import { Material, Material_Card } from "@/types/materials";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, LayoutGrid, Search, Users } from "lucide-react";

type MaterialsProfileProps = {
  initialMaterials: Material_Card[];
  initialMaterialsData: Material[];
  colaboraciones: Material_Card[]; // Lista 2: Donde soy colaborador
};

export default function Materials_Profile({
  initialMaterials,
  initialMaterialsData,
  colaboraciones,
}: // Lista 2: Donde soy colaborador
MaterialsProfileProps) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const initialTab =
    (searchParams.get("filter") as
      | "todos"
      | "aprobados"
      | "pendientes"
      | "colaboraciones") || "todos";
  const highlightId = searchParams.get("highlight");
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (highlightId) {
      // Damos un pequeño timeout para asegurar que el DOM se renderizó
      setTimeout(() => {
        const element = document.getElementById(`card-${highlightId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Opcional: Agregar una clase temporal para resaltar
          element.classList.add("ring-4", "ring-amber-400", "ring-offset-4");
          setTimeout(() => {
            element.classList.remove(
              "ring-4",
              "ring-amber-400",
              "ring-offset-4"
            );
          }, 3000);
        }
      }, 500);
    }
  }, [highlightId, activeTab]);

  useEffect(() => {
    const currentFilter = searchParams.get("filter") as any;
    if (
      currentFilter &&
      ["todos", "aprobados", "pendientes", "colaboraciones"].includes(
        currentFilter
      )
    ) {
      setActiveTab(currentFilter);
    }
  }, [searchParams]);
  // 1. SELECCIÓN DE LISTA BASE
  // Dependiendo del Tab, elegimos qué array vamos a filtrar
  let listaBase: Material_Card[] = [];

  if (activeTab === "todos") {
    listaBase = [...initialMaterials, ...colaboraciones];
  } else if (activeTab === "aprobados") {
    listaBase = initialMaterials.filter((mat) => mat.estado);
  } else if (activeTab === "pendientes") {
    listaBase = initialMaterials.filter((mat) => !mat.estado);
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
    <section id="explore" className="animate-in fade-in duration-500">
      {/* 1. TÍTULO Y CONTADOR MEJORADOS */}
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          {activeTab === "todos" && "Todos mis Materiales"}
          {activeTab === "aprobados" && "Materiales Aprobados"}
          {activeTab === "pendientes" && "En Revisión"}
          {activeTab === "colaboraciones" && "Colaboraciones"}
        </h2>
        {/* El número ahora es un Badge más visible */}
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-bold border border-slate-200 shadow-sm">
          {materialsFiltrados.length}
        </span>
      </div>

      {/* 2. TOOLBAR UNIFICADA (Tabs + Search) */}
      {/* Caja contenedora blanca que agrupa los controles */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row justify-between gap-3 sticky top-4 z-20">
        {/* IZQUIERDA: TABS DE FILTRO (Estilo Segmented Control) */}
        <div className="flex p-1 bg-slate-100/50 rounded-lg overflow-x-auto no-scrollbar w-full md:w-auto gap-1">
          <button
            onClick={() => setActiveTab("todos")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap flex-1 md:flex-none justify-center ${
              activeTab === "todos"
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Todos</span>
          </button>

          <button
            onClick={() => setActiveTab("aprobados")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap flex-1 md:flex-none justify-center ${
              activeTab === "aprobados"
                ? "bg-white text-green-700 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">Aprobados</span>
          </button>

          <button
            onClick={() => setActiveTab("pendientes")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap flex-1 md:flex-none justify-center ${
              activeTab === "pendientes"
                ? "bg-white text-amber-700 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Pendientes</span>
          </button>

          <button
            onClick={() => setActiveTab("colaboraciones")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap flex-1 md:flex-none justify-center ${
              activeTab === "colaboraciones"
                ? "bg-white text-purple-700 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Colab.</span>
          </button>
        </div>

        {/* DERECHA: BUSCADOR INTEGRADO */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar material..."
            className="pl-9 h-full bg-transparent md:bg-slate-50 border-transparent md:border-slate-100 focus:bg-white focus:border-slate-300 transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 3. GRID DE RESULTADOS */}
      {materialsFiltrados.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-slate-900 font-medium text-lg">
            No encontramos materiales
          </h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
            {searchTerm
              ? `No hay resultados para "${searchTerm}"`
              : `Aún no tienes materiales en la categoría "${activeTab}".`}
          </p>
          {/* Botón opcional para limpiar filtros si está vacío */}
          {(searchTerm || activeTab !== "todos") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveTab("todos");
              }}
              className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {materialsFiltrados.map((material) => (
            <div
              key={material.id}
              id={`card-${material.id}`}
              className="transition-all duration-500 hover:translate-y-[-4px]"
            >
              <MaterialCard
                material={material}
                material_data={initialMaterialsData.find(
                  (m) => m.id === material.id
                )}
                from="private"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
