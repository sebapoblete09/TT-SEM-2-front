"use client";

import { Material } from "@/types/materials";
import { Badge } from "@/components/ui/badge";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Hammer, FlaskConical, Layers, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

// Helper para iniciales
const getInitials = (name: string) =>
  name ? name.substring(0, 2).toUpperCase() : "??";

export function MaterialModalContent({ material }: { material: Material }) {
  return (
    <div className="flex flex-col h-[60vh] sm:h-[500px]">
      {" "}
      {/* Altura fija controlada */}
      {/* Tabs Header */}
      <div className="px-6 border-b border-slate-200">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="propiedades">Propiedades</TabsTrigger>
          <TabsTrigger value="proceso">Proceso</TabsTrigger>
          <TabsTrigger value="galeria">Galería</TabsTrigger>
        </TabsList>
      </div>
      {/* Scrollable Content */}
      <ScrollArea className="flex-1 bg-slate-50/50 p-6">
        {/* --- TAB 1: GENERAL --- */}
        <TabsContent value="general" className="mt-0 space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <Avatar className="h-12 w-12 border">
              <AvatarFallback>
                {getInitials(material.creador.nombre)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-bold text-slate-700">Autor</h4>
              <p className="text-base text-slate-900">
                {material.creador.nombre}
              </p>
              <p className="text-xs text-slate-500">{material.creador.email}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700">Colaboradores:</h4>

            <p className="text-base text-slate-900">asdass</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-slate-700">
              Descripción
            </h4>
            <p className="text-sm text-slate-600 bg-white p-4 rounded-lg border border-slate-200">
              {material.descripcion}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                <FlaskConical className="w-4 h-4" /> Composición
              </h4>
              <div className="flex flex-wrap gap-2">
                {material.composicion?.map((c, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-white border border-slate-200 text-slate-600"
                  >
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                <Hammer className="w-4 h-4" /> Herramientas
              </h4>
              <div className="flex flex-wrap gap-2">
                {material.herramientas?.map((h, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="bg-slate-100 border-transparent text-slate-600"
                  >
                    {h}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- TAB 2: PROPIEDADES --- */}
        <TabsContent value="propiedades" className="mt-0 grid gap-6">
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Mecánicas
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(material.prop_mecanicas || {}).map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs uppercase text-blue-400 font-bold">
                    {k}
                  </p>
                  <p className="text-sm text-slate-700">{v as string}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Perceptivas
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(material.prop_perceptivas || {}).map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs uppercase text-blue-400 font-bold">
                    {k}
                  </p>
                  <p className="text-sm text-slate-700">{v as string}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Emocionales
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(material.prop_emocionales || {}).map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs uppercase text-blue-400 font-bold">
                    {k}
                  </p>
                  <p className="text-sm text-slate-700">{v as string}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* --- TAB 3: PROCESO --- */}
        <TabsContent value="proceso" className="mt-0 space-y-6">
          {material.pasos?.map((paso, index: number) => (
            <div key={index} className="flex gap-4 relative">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm border border-teal-200">
                {index + 1}
              </div>
              <div className="flex-1 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-sm text-slate-700 mb-3">
                  {paso.descripcion}
                </p>
                {paso.url_imagen && (
                  <div className="relative h-32 w-full rounded-md overflow-hidden border">
                    <Image
                      src={paso.url_imagen}
                      alt="Paso"
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
        <TabsContent value="galeria" className="mt-0">
          {!material.galeria?.length ? (
            <div className="text-center py-10 text-slate-400">
              <ImageIcon className="w-10 h-10 mb-2 opacity-50 mx-auto" />
              <p>Sin imágenes</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {material.galeria.map((item, i: number) => (
                <div
                  key={i}
                  className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden border"
                >
                  <Image
                    src={item.url_imagen}
                    alt="Galería"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </ScrollArea>
    </div>
  );
}
