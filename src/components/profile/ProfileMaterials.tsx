// components/Materials_Profile.tsx
"use client";

import { useState } from "react";
import { MaterialCard } from "@/components/ui/materialCard";
import { Material_Card } from "@/types/materials";
import { LuSearch } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

type MaterialsProfileProps = {
  initialMaterials: Material_Card[];
};

export default function Materials_Profile({
  initialMaterials,
}: MaterialsProfileProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Cambiamos el estado para manejar TRES opciones
  const [status, setStatus] = useState<"todos" | "aprobados" | "pendientes">(
    "todos" // <-- "Todos" es el estado por defecto
  );

  // 2. Lógica de filtrado ENCADENADA
  const materialsFiltrados = initialMaterials
    .filter((material) => {
      // --- PRIMER FILTRO: Por Estado ---
      if (status === "todos") {
        return true; // Mantiene todos
      }
      if (status === "aprobados") {
        return material.estado === true;
      }
      if (status === "pendientes") {
        return material.estado === false;
      }
      return true; // Fallback por si acaso
    })
    .filter((material) => {
      // --- SEGUNDO FILTRO: Por Búsqueda (sobre la lista ya filtrada) ---
      const busqueda = searchTerm.toLowerCase();
      return (
        material.nombre.toLowerCase().includes(busqueda) ||
        material.descripcion.toLowerCase().includes(busqueda) ||
        material.composicion.some((comp) =>
          comp.toLowerCase().includes(busqueda)
        )
      );
    });

  // 3. Función para obtener el texto del placeholder
  const getPlaceholder = () => {
    if (status === "todos") return "Buscar en todos mis materiales...";
    if (status === "aprobados") return "Buscar en Aprobados...";
    if (status === "pendientes") return "Buscar en Pendientes...";
  };

  return (
    <section id="explore" className="py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Mis Materiales: {materialsFiltrados.length}
            </h2>
            <p className="text-muted-foreground">
              {/* Texto dinámico según el filtro */}
              {status === "todos" && "Todos mis materiales"}
              {status === "aprobados" && "Materiales Aprobados"}
              {status === "pendientes" && "Materiales Pendientes"}
            </p>
          </div>

          {/* El Input funcional */}
          <div className="flex-1 relative w-full md:max-w-md">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={getPlaceholder()}
              className="pl-10 h-12 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 4. TRES Botones, uno para cada estado */}
          <div className="flex gap-x-4">
            <Button
              asChild
              size="lg"
              variant={status === "todos" ? "default" : "outline-primary"}
              onClick={() => setStatus("todos")}
            >
              <p>Todos</p>
            </Button>
            <Button
              asChild
              size="lg"
              variant={status === "aprobados" ? "default" : "outline-primary"}
              onClick={() => setStatus("aprobados")}
            >
              <p>Aprobados</p>
            </Button>
            <Button
              asChild
              size="lg"
              variant={status === "pendientes" ? "default" : "outline-primary"}
              onClick={() => setStatus("pendientes")}
            >
              <p>Pendientes</p>
            </Button>
          </div>
        </div>

        {/* 5. El bloque de renderizado (ahora con mensajes más claros) */}
        {materialsFiltrados.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No se encontraron materiales con ese término."
                : `No tienes materiales ${status !== "todos" ? status : ""}.`}
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
