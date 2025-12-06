"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Share2, Leaf, Users, GitFork } from "lucide-react";
import { Material } from "@/types/materials";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
export default function MaterialHeader({ material }: { material: Material }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Categoría y Acciones */}
      <div className="flex items-center justify-between mb-4">
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors px-3 py-1 text-sm font-medium flex gap-2 items-center w-fit"
        >
          <Leaf className="w-3 h-3" />
          Biomaterial
        </Badge>

        {material.derivado_de != "00000000-0000-0000-0000-000000000000" && (
          <Badge
            variant="secondary"
            className="bg-white cursor-pointer text-purple-700 hover:bg-purple-200 transition-colors px-3 py-1 text-sm font-medium flex gap-2 items-center w-fit border-purple-200"
          >
            <GitFork className="w-3 h-3" />
            <Link href={`/material/${material.derivado_de}`}>
              {" "}
              Material Derivado:
            </Link>
          </Badge>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-slate-600 hover:text-green-700 hover:bg-green-50 border-slate-200"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-slate-600 hover:text-blue-700 hover:bg-blue-50 border-slate-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Ficha Técnica
          </Button>
        </div>
      </div>

      {/* 2. Título y Descripción */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
        {material.nombre}
      </h1>

      <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-4xl mb-8 border-l-4 border-green-500 pl-6 italic">
        {material.descripcion}
      </p>

      {/* 3. Meta Información  */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-white p-3 pr-6 rounded-xl border border-slate-200 shadow-sm w-fit">
        {/* Creador */}
        <div className="flex items-center gap-3 pr-4 md:border-r border-slate-100 w-full md:w-auto">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
              Creado por
            </p>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-800 text-sm">
                <Link href={`/profile/${material.creador.google_id}`}>
                  {material.creador.nombre}
                </Link>
              </p>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 h-5 bg-green-50 text-green-700 hover:bg-green-100 border-0"
              >
                {material.creador.rol}
              </Badge>
            </div>
          </div>
        </div>

        {/* Fecha */}
        <div className="flex items-center gap-3 px-2 pr-4 md:border-r border-slate-100 min-w-fit">
          <div className="p-1.5 bg-slate-50 rounded-md text-slate-500">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
              Publicado el
            </p>
            <p className="text-sm font-medium text-slate-700">
              {format(new Date(material.created_at), "d 'de' MMMM, yyyy", {
                locale: es,
              })}
            </p>
          </div>
        </div>

        {/* Colaboradores */}
        {material.colaboradores && material.colaboradores.length > 0 && (
          <div className="flex flex-col gap-1 px-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              <Users className="w-3 h-3" /> Colaboradores
            </div>
            <div className="flex flex-wrap gap-2">
              {material.colaboradores.map((colab) => (
                <Badge
                  key={colab.ID}
                  variant="outline"
                  className="bg-slate-50 text-slate-600 border-slate-200 text-xs font-normal"
                >
                  {colab.nombre}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
