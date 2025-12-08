"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { Step } from "@/components/register-material/Recipe";

type StepLike = Omit<Step, "id" | "url_imagen" | "url_video"> & {
  id?: number | string;
  url_imagen?: string | File | null;
  url_video?: string | File | null;
};

export default function MaterialSteps({ pasos }: { pasos: StepLike[] }) {
  if (!pasos?.length) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p className="text-slate-400">
          No hay pasos registrados para este material.
        </p>
      </div>
    );
  }

  // Helper para manejar URLs (ya sea string de Supabase o File local)
  const getMediaUrl = (media: string | File | null | undefined) => {
    if (!media) return null;
    return typeof media === "string" ? media : URL.createObjectURL(media);
  };

  return (
    <section className="space-y-8 relative py-4 ">
      <div className="absolute left-[19px] top-4 bottom-10 w-0.5 bg-slate-200 hidden md:block" />

      {pasos.map((p, i) => {
        const imgUrl = getMediaUrl(p.url_imagen);
        const videoUrl = getMediaUrl(p.url_video);

        return (
          <div
            key={p.id || i}
            className="relative flex flex-col md:flex-row gap-6 group"
          >
            {/* 1. NÚMERO DEL PASO (Badge Flotante) */}
            <div className="flex-shrink-0 z-10 hidden md:block">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-md ring-4 ring-white transition-transform group-hover:scale-110">
                {p.orden_paso}
              </div>
            </div>

            {/* Versión Móvil del número (Inline) */}
            <div className="md:hidden flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {p.orden_paso}
              </div>
              <span className="font-bold text-slate-800">
                Paso {p.orden_paso}
              </span>
            </div>

            {/* 2. TARJETA DE CONTENIDO */}
            <Card className="flex-1 border-2 shadow-md shadow-slate-200/50 bg-white hover:shadow-lg transition-shadow rounded-3xl lg:rounded-tl-none overflow-hidden">
              <CardContent className="p-6">
                {/* Descripción */}
                <div className="mb-6">
                  <p className="text-slate-700 text-lg leading-relaxed bg-gray-200 p-4 border border-slate-100 rounded-2xl rounded-tl-none">
                    {p.descripcion}
                  </p>
                </div>

                {/* Galería Multimedia del Paso */}
                {(imgUrl || videoUrl) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* IMAGEN */}
                    {imgUrl && (
                      <div className="relative h-56 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 group/media">
                        <Image
                          src={imgUrl}
                          alt={`Paso ${p.orden_paso}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover/media:scale-105"
                        />
                        <Badge className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 backdrop-blur-md border-none text-white gap-1.5 px-2 py-1">
                          <ImageIcon className="w-3 h-3" /> Imagen
                        </Badge>
                      </div>
                    )}

                    {/* VIDEO */}
                    {videoUrl && (
                      <div className="relative h-56 rounded-xl overflow-hidden border border-slate-100 bg-black flex items-center justify-center group/media">
                        <video
                          controls
                          className="w-full h-full object-contain"
                          src={videoUrl}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </section>
  );
}
