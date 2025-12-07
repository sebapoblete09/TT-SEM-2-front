// components/Materials_Profile.tsx
"use client";

import { useState } from "react";
import { MaterialCard } from "@/components/ui/materialCard";
import { Material_Card } from "@/types/materials";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, LayoutGrid, Search, Users } from "lucide-react";

type MaterialsProfileProps = {
  initialMaterials: Material_Card[];
  colaboraciones: Material_Card[]; // Lista 2: Donde soy colaborador
};

export default function Materials_Profile({
  initialMaterials,
  colaboraciones, // Lista 2: Donde soy colaborador
}: MaterialsProfileProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [activeTab, setActiveTab] = useState<
    "todos" | "aprobados" | "pendientes" | "colaboraciones"
  >("todos");

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
    <section id="explore" className="py-8 animate-in fade-in duration-500">
      <div className="container mx-auto max-w-7xl">
        {/* --- HEADER Y CONTROLES --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          {/* Título Dinámico */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              {activeTab === "todos" && "Todos mis Materiales"}
              {activeTab === "aprobados" && "Materiales Aprobados"}
              {activeTab === "pendientes" && "Materiales Pendientes"}
              {activeTab === "colaboraciones" && "Colaboraciones"}

              <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-1">
                {materialsFiltrados.length}
              </span>
            </h2>
          </div>
          {/* Barra de Herramientas */}
          {/* Contenedor Principal: Cambiado de Grid a Flex vertical para centrar elementos */}
          <div className="flex flex-col gap-4 w-full m-auto items-center">
            {/* Buscador: Le di un max-width para que no se vea gigante */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar..."
                className="pl-9 h-10 bg-white border-slate-200 focus-visible:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* TABS DE ESTADO */}
            {/* Cambios clave aquí: 
      1. w-fit: Hace que el contenedor gris se encoja al tamaño de los botones.
      2. mx-auto: Asegura el centrado horizontal.
  */}
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
                onClick={() => setActiveTab("aprobados")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "aprobados"
                    ? "bg-white text-green-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Aprobados</span>
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

              <button
                onClick={() => setActiveTab("pendientes")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "pendientes"
                    ? "bg-white text-amber-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Pendientes</span>
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
                : `No tienes materiales ${
                    activeTab !== "todos" ? activeTab : ""
                  }.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materialsFiltrados.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
