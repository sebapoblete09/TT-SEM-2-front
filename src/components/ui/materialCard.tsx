"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Material_Card, Material } from "@/types/materials";
import { FlaskConical, ArrowRight, GitFork, Lock, Beaker } from "lucide-react";
import { EditMaterialDialog } from "../profile/EditMaterialDialog"; // <--- Importamos el modal

interface MaterialCardProps {
  material: Material_Card;
  material_data?: Material;
  from: "private" | "public";
}

export function MaterialCard({
  material,
  from,
  material_data,
}: MaterialCardProps) {
  const hasComposition =
    material.composicion && material.composicion.length > 0;

  const hasTools = material.herramientas && material.herramientas.length > 0;

  const isDerived =
    material.derivado_de &&
    material.derivado_de !== "" &&
    material.derivado_de !== "00000000-0000-0000-0000-000000000000";

  // --- CUERPO DE LA TARJETA ---
  const CardContentBody = (
    <Card
      id={material.id}
      className={`group h-full border-none shadow-lg bg-white rounded-2xl overflow-hidden flex flex-col relative transition-all duration-300 ${
        material.estado
          ? "hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-1"
          : "opacity-90" // Quitamos hover effect si está pendiente para diferenciarlo
      }`}
    >
      {/* 0. CAPA DE BLOQUEO (Solo visual, para el usuario público) */}
      {!material.estado && from === "private" && (
        <div className="absolute inset-0 z-20 bg-slate-100/50 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 font-medium text-sm">
            <Lock className="w-4 h-4" />
            Pendiente de Aprobación
          </div>
        </div>
      )}

      {/* 1. HEADER (NOMBRE) */}
      <div className="px-5 pt-5 pb-3 bg-white">
        <h3
          className={`text-xl font-bold text-slate-800 line-clamp-1 ${
            material.estado
              ? "group-hover:text-green-700 transition-colors"
              : ""
          }`}
        >
          {material.nombre}
        </h3>
      </div>

      {/* 2. IMAGEN */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          src={material.primera_imagen_galeria || "/placeholder.svg"}
          alt={material.nombre}
          fill
          className={`object-cover transition-transform duration-700 ${
            material.estado ? "group-hover:scale-110" : ""
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40" />

        {/* Badge Derivado (Ajustado si estamos en modo privado para no chocar con editar) */}
        {isDerived && (
          <Badge
            className={`absolute top-3 right-3
            } bg-white/90 text-purple-700 backdrop-blur-sm border-none shadow-sm gap-1.5 px-2`}
          >
            <GitFork className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wide">
              Derivado
            </span>
          </Badge>
        )}

        {/* Badge Pendiente */}
        {!material.estado && (
          <Badge className="absolute top-3 left-3 bg-amber-500 text-white border-none shadow-sm gap-1.5 px-2">
            <Lock className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wide">
              Pendiente
            </span>
          </Badge>
        )}
      </div>

      {/* 3. CONTENIDO */}
      <CardContent className="flex-1 p-5 flex flex-col pt-4">
        <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1 leading-relaxed">
          {material.descripcion}
        </p>

        <div className="h-px w-full bg-slate-100 mb-4" />

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <FlaskConical className="w-3 h-3" /> Composición
          </div>

          <div className="flex flex-wrap gap-2 pb-4">
            {hasComposition ? (
              material.composicion.slice(0, 3).map((comp, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100"
                >
                  {comp.elemento}: {comp.cantidad}
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

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Beaker className="w-3 h-3" /> Herramientas
          </div>

          <div className="flex flex-wrap gap-2">
            {hasTools ? (
              material.herramientas.slice(0, 3).map((tool, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-400 border border-teal-100"
                >
                  {tool}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-300 italic">
                No especificada
              </span>
            )}
            {hasTools && material.herramientas.length > 3 && (
              <span className="text-xs text-slate-400 self-center">
                +{material.herramientas.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Botón Ver Detalle (Solo visible si es enlace funcional) */}
        {material.estado && from === "public" && (
          <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 h-0 group-hover:h-auto">
            <span className="text-xs font-bold text-green-600 flex items-center gap-1">
              Ver Detalle <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // --- LOGICA DE RENDERIZADO (WRAPPER) ---

  // 1. MODO PRIVADO: Wrapper relativo para posicionar botón de editar
  if (from === "private") {
    return (
      <div className="relative h-full block group/private">
        {/* El enlace a detalle solo funciona si está aprobado */}
        {material.estado ? (
          <Link href={`/material/${material.id}`} className="block h-full">
            {CardContentBody}
          </Link>
        ) : (
          <div className="block h-full cursor-default">{CardContentBody}</div>
        )}

        {/* BOTÓN EDITAR (Posicionamiento Absoluto Z-30 para estar encima de todo) */}
        {material_data && (
          <div className="absolute top-3 right-3 z-30">
            <EditMaterialDialog material={material_data} />
          </div>
        )}
      </div>
    );
  }

  // 2. MODO PÚBLICO: Lógica estándar
  if (material.estado) {
    return (
      <Link href={`/material/${material.id}`} className="block h-full">
        {CardContentBody}
      </Link>
    );
  } else {
    return (
      <div className="block h-full cursor-not-allowed">{CardContentBody}</div>
    );
  }
}
