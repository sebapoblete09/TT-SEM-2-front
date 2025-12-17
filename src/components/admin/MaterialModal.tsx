"use client";

import {
  Material,
  prop_emocionales,
  prop_perceptivas,
} from "@/types/materials";
import { Badge } from "@/components/ui/badge";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Hammer,
  FlaskConical,
  Layers,
  Image as ImageIcon,
  Heart,
  Eye,
} from "lucide-react";
import Image from "next/image";

import { prop_mecanicas } from "@/types/materials";

// Helper para iniciales
const getInitials = (name: string) =>
  name ? name.substring(0, 2).toUpperCase() : "??";

export function MaterialModalContent({ material }: { material: Material }) {
  return (
    // 1. Quitamos h-[60vh]. Dejamos que el contenido defina la altura.
    <div className="flex flex-col w-full">
      {/* HEADER TABS (Sticky para que no se pierda al bajar) */}
      <div className="px-4 sm:px-6 py-2 border-b border-slate-200 sticky top-0 bg-white z-20 shadow-sm">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-slate-100/50 rounded-lg">
          <TabsTrigger value="general" className="text-xs sm:text-sm py-2">
            General
          </TabsTrigger>
          <TabsTrigger value="propiedades" className="text-xs sm:text-sm py-2">
            Propiedades
          </TabsTrigger>
          <TabsTrigger value="proceso" className="text-xs sm:text-sm py-2">
            Proceso
          </TabsTrigger>
          <TabsTrigger value="galeria" className="text-xs sm:text-sm py-2">
            Galería
          </TabsTrigger>
        </TabsList>
      </div>

      {/* CONTENIDO (Sin ScrollArea interno) */}
      <div className="p-4 sm:p-6 bg-slate-50/30 min-h-[300px]">
        {/* --- TAB 1: GENERAL --- */}
        <TabsContent
          value="general"
          className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* Autor */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border bg-slate-50">
              <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                {getInitials(material.creador.nombre)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Autor
              </h4>
              <p className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                {material.creador.nombre}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {material.creador.email}
              </p>
            </div>
          </div>

          {/* Colaboradores */}
          {material.colaboradores && material.colaboradores.length > 0 && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Colaboradores
              </h4>
              <div className="flex flex-wrap gap-2">
                {material.colaboradores.map((colab, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="bg-slate-50 text-slate-600 border-slate-200"
                  >
                    {typeof colab === "string" ? colab : colab.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Descripción */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-slate-700">
              Descripción
            </h4>
            <div className="text-sm text-slate-600 bg-white p-4 rounded-lg border border-slate-200 leading-relaxed">
              {material.descripcion}
            </div>
          </div>

          {/* Composición y Herramientas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-sm text-teal-700 flex items-center gap-2 mb-3">
                <FlaskConical className="w-4 h-4" /> Composición
              </h4>
              <div className="flex flex-wrap gap-2">
                {material.composicion?.map((c, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100"
                  >
                    {c.elemento + " " + c.cantidad}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2 mb-3">
                <Hammer className="w-4 h-4" /> Herramientas
              </h4>
              <div className="flex flex-wrap gap-2">
                {material.herramientas?.map((h, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="bg-slate-50 border-slate-200 text-slate-600"
                  >
                    {h}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- TAB 2: PROPIEDADES (Colores Preservados) --- */}
        <TabsContent
          value="propiedades"
          className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* MECÁNICAS (Azul) */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Mecánicas
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Usamos map directo porque es un Array, el '?' evita errores si es null */}
              {material.prop_mecanicas?.map(
                (prop: prop_mecanicas, index: number) => (
                  <div
                    // Usamos el nombre como key (o el index si el nombre pudiera repetirse)
                    key={`${prop.nombre}-${index}`}
                    className="bg-white p-3 rounded-lg border border-blue-100/60 shadow-sm"
                  >
                    {/* NOMBRE DE LA PROPIEDAD */}
                    <span className="text-[10px] text-blue-400 font-bold uppercase block mb-1 break-words">
                      {prop.nombre}
                    </span>

                    {/* VALOR Y UNIDAD */}
                    <span className="text-sm font-medium text-slate-800 capitalize">
                      {prop.valor}

                      {/* Lógica para mostrar la unidad solo si existe y no es 'n/a' */}
                      {prop.unidad && prop.unidad.toLowerCase() !== "n/a" && (
                        <span className="text-slate-400 ml-1 text-xs lowercase">
                          {prop.unidad}
                        </span>
                      )}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* SENSORIALES (Morado) */}
          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
            <h4 className="font-bold text-purple-700 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" /> Sensoriales
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {material.prop_perceptivas?.map(
                (prop: prop_perceptivas, index: number) => (
                  <div
                    // Usamos el nombre como key (o el index si el nombre pudiera repetirse)
                    key={`${prop.nombre}-${index}`}
                    className="bg-white p-3 rounded-lg border border-blue-100/60 shadow-sm"
                  >
                    {/* NOMBRE DE LA PROPIEDAD */}
                    <span className="text-[10px] text-blue-400 font-bold uppercase block mb-1 break-words">
                      {prop.nombre}
                    </span>

                    {/* VALOR Y UNIDAD */}
                    <span className="text-sm font-medium text-slate-800 capitalize">
                      {prop.valor}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* EMOCIONALES (Rosa) */}
          <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
            <h4 className="font-bold text-rose-700 mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4" /> Emocionales
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {material.prop_emocionales?.map(
                (prop: prop_emocionales, index: number) => (
                  <div
                    // Usamos el nombre como key (o el index si el nombre pudiera repetirse)
                    key={`${prop.nombre}-${index}`}
                    className="bg-white p-3 rounded-lg border border-blue-100/60 shadow-sm"
                  >
                    {/* NOMBRE DE LA PROPIEDAD */}
                    <span className="text-[10px] text-blue-400 font-bold uppercase block mb-1 break-words">
                      {prop.nombre}
                    </span>

                    {/* VALOR Y UNIDAD */}
                    <span className="text-sm font-medium text-slate-800 capitalize">
                      {prop.valor}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </TabsContent>

        {/* --- TAB 3: PROCESO --- */}
        <TabsContent
          value="proceso"
          className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {material.pasos
            ?.sort((a, b) => a.orden_paso - b.orden_paso)
            .map((paso, index) => (
              <div key={index} className="flex gap-4 group">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-white z-10">
                    {paso.orden_paso}
                  </div>
                  {index < (material.pasos?.length || 0) - 1 && (
                    <div className="w-0.5 flex-1 bg-slate-200 my-1 group-hover:bg-slate-300 transition-colors" />
                  )}
                </div>
                <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-2">
                  <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                    {paso.descripcion}
                  </p>
                  {paso.url_imagen && (
                    <div className="relative h-40 w-full rounded-lg overflow-hidden border border-slate-100">
                      <Image
                        src={paso.url_imagen}
                        alt={`Paso ${paso.orden_paso}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
        </TabsContent>

        {/* --- TAB 4: GALERIA --- */}
        <TabsContent
          value="galeria"
          className="mt-0 animate-in fade-in zoom-in-95 duration-300"
        >
          {!material.galeria?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
              <p className="text-sm font-medium">Sin imágenes en la galería</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {material.galeria.map((item, i) => (
                <div
                  key={i}
                  className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-zoom-in group"
                >
                  <Image
                    src={item.url_imagen}
                    alt={`Galería ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </div>
    </div>
  );
}
