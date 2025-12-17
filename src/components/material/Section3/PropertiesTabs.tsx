"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

// 1. Definimos un tipo genérico que cubra tus 3 tipos de propiedades
interface PropertyItem {
  nombre: string;
  valor: string | number;
  unidad?: string; // Opcional, solo para mecánicas
}

interface PropertiesCardProps {
  title: string;
  data?: PropertyItem[] | null;
  icon: LucideIcon;
  iconColorClass: string;
  borderColorClass: string;
}

export default function PropertiesCard({
  title,
  data,
  icon: Icon,
  iconColorClass,
  borderColorClass,
}: PropertiesCardProps) {
  // Verificamos si es un array y tiene longitud
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <Card className="border-2 border-slate-500/50 shadow-xl shadow-slate-200/50 bg-white rounded-2xl overflow-hidden h-fit">
      {/* HEADER */}
      <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/30 pt-6 px-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconColorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-800">
            {title}
          </CardTitle>
        </div>
      </CardHeader>

      {/* CONTENIDO DINÁMICO */}
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* 3. Mapeamos el array directamente */}
          {data.map((item, index) => (
            <div
              // Usamos el nombre como key, o el index si el nombre se repite
              key={`${item.nombre}-${index}`}
              className={`bg-slate-50 p-3 rounded-lg border-2 ${borderColorClass}`}
            >
              {/* NOMBRE DE LA PROPIEDAD */}
              <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 break-words">
                {item.nombre}
              </dt>

              {/* VALOR (+ UNIDAD SI EXISTE) */}
              <dd className="text-sm font-medium text-slate-700 capitalize leading-snug">
                {item.valor !== null && item.valor !== undefined ? (
                  <span>
                    {item.valor}
                    {item.unidad && item.unidad.toLowerCase() !== "n/a" && (
                      <span className="text-slate-400 ml-1 text-xs lowercase">
                        {item.unidad}
                      </span>
                    )}
                  </span>
                ) : (
                  "N/A"
                )}
              </dd>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
