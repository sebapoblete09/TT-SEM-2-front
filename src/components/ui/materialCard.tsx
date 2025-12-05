"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Material_Card } from "@/types/materials";
import { FlaskConical, ArrowRight, GitFork } from "lucide-react";

interface MaterialCardProps {
  material: Material_Card;
}

export function MaterialCard({ material }: MaterialCardProps) {
  const hasComposition =
    material.composicion && material.composicion.length > 0;
  const isDerived =
    material.derivado_de &&
    material.derivado_de !== "" &&
    material.derivado_de !== "00000000-0000-0000-0000-000000000000";

  return (
    <Link href={`/material/${material.id}`} className="block h-full">
      <Card className="group h-full border-2 border-primary shadow-lg shadow-slate-200/50 bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col">
        {/* 1. HEADER DE TARJETA (NOMBRE) - NUEVA POSICIÓN */}
        <div className="px-5 pt-5 pb-3 bg-white">
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-green-700 transition-colors line-clamp-1">
            {material.nombre}
          </h3>
        </div>

        {/* 2. SECCIÓN DE IMAGEN */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <Image
            src={material.primera_imagen_galeria || "/placeholder.svg"}
            alt={material.nombre}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />

          {/* Gradiente suave */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40" />

          {/* Badge de "Derivado" (Si aplica) */}
          {isDerived && (
            <Badge className="absolute top-3 right-3 bg-white/90 text-purple-700 backdrop-blur-sm hover:bg-white border-none shadow-sm gap-1.5 px-2">
              <GitFork className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wide">
                Derivado
              </span>
            </Badge>
          )}
        </div>

        {/* 3. CONTENIDO RESTANTE */}
        <CardContent className="flex-1 p-5 flex flex-col pt-4">
          {/* Descripción */}
          <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1 leading-relaxed">
            {material.descripcion}
          </p>

          {/* Separador */}
          <div className="h-px w-full bg-slate-100 mb-4" />

          {/* Composición */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <FlaskConical className="w-3 h-3" /> Composición
            </div>

            <div className="flex flex-wrap gap-2">
              {hasComposition ? (
                material.composicion.slice(0, 3).map((comp, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100"
                  >
                    {comp}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-300 italic">
                  No especificada
                </span>
              )}

              {hasComposition && material.composicion.length > 3 && (
                <span className="text-xs text-slate-400 self-center">
                  +{material.composicion.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Botón "Ver más" */}
          <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 h-0 group-hover:h-auto">
            <span className="text-xs font-bold text-green-600 flex items-center gap-1">
              Ver Detalle <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
