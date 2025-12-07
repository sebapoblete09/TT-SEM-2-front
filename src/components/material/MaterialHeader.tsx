"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Share2, Leaf, Users, GitFork } from "lucide-react";
import { Material } from "@/types/materials";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

export default function MaterialHeader({ material }: { material: Material }) {
  const emptyUUID = "00000000-0000-0000-0000-000000000000";

  return (
    <div className="mb-8 lg:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-full overflow-hidden">
      {/* 1. BARRA SUPERIOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {material.derivado_de && material.derivado_de !== emptyUUID && (
            <Link href={`/material/${material.derivado_de}`}>
              <Badge
                variant="outline"
                className="bg-white text-purple-700 hover:bg-purple-50 border-purple-200 cursor-pointer px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium flex gap-1.5 items-center transition-colors"
              >
                <GitFork className="w-3 h-3" /> Derivado
              </Badge>
            </Link>
          )}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto flex-1 sm:flex-none text-slate-600 border-slate-200 hover:bg-slate-50 text-xs sm:text-sm"
          >
            <Share2 className="h-3.5 w-3.5 mr-2" /> Compartir
          </Button>
        </div>
      </div>

      {/* 2. TÍTULO Y DESCRIPCIÓN 
          Cambio: text-3xl bajado a text-2xl en móvil para evitar palabras cortadas
      */}
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 sm:mb-6 tracking-tight leading-tight break-words hyphens-auto">
        {material.nombre}
      </h1>

      <p className="text-sm sm:text-base md:text-xl text-slate-600 leading-relaxed max-w-4xl mb-6 sm:mb-8 border-l-4 border-green-500 pl-4 sm:pl-6 italic">
        {material.descripcion}
      </p>

      {/* 3. TARJETA DE METADATOS (SÚPER COMPACTA) */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm w-full lg:w-fit max-w-full">
        {/* Contenedor Flex: Vertical en móvil/tablet, Fila en Desktop (lg) */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-center">
          {/* BLOQUE CREADOR */}
          <div className="flex items-center gap-3 pb-3 lg:pb-0 border-b lg:border-b-0 lg:border-r border-slate-100 lg:pr-6 min-w-0">
            <div className="flex flex-col min-w-0 w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Creado por
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/profile/${material.creador.google_id}`}
                  className="font-semibold text-slate-800 text-sm hover:underline hover:text-green-700 truncate max-w-[150px] sm:max-w-[200px]"
                >
                  {material.creador.nombre}
                </Link>
                {/* Badge de Rol: Oculto en 320px (hidden), visible en xs (min-[375px]:inline-flex) */}
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 h-5 bg-green-50 text-green-700 border-0 hidden min-[375px]:inline-flex whitespace-nowrap"
                >
                  {material.creador.rol}
                </Badge>
              </div>
            </div>
          </div>

          {/* BLOQUE FECHA */}
          <div className="flex items-center gap-3 pb-3 lg:pb-0 border-b lg:border-b-0 lg:border-r border-slate-100 lg:pr-6 shrink-0">
            <div className="p-1.5 bg-slate-50 rounded-md text-slate-500 shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
                Publicado el
              </p>
              <p className="text-sm font-medium text-slate-700 whitespace-nowrap">
                {format(new Date(material.created_at), "d MMM, yyyy", {
                  locale: es,
                })}
              </p>
            </div>
          </div>

          {/* BLOQUE COLABORADORES */}
          {material.colaboradores && material.colaboradores.length > 0 && (
            <div className="flex flex-col gap-1 min-w-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                <Users className="w-3 h-3" /> Colaboradores
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {material.colaboradores.map((colab) => (
                  <Link
                    href={`/profile/${colab.google_id}`}
                    key={colab.ID}
                    className="min-w-0 max-w-full"
                  >
                    <Badge
                      variant="outline"
                      // max-w-[100px] en móvil previene que un nombre largo rompa el layout
                      className="bg-slate-50 text-slate-600 border-slate-200 text-xs font-normal hover:bg-slate-100 transition-colors truncate max-w-[100px] sm:max-w-[150px] block"
                    >
                      {colab.nombre}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
