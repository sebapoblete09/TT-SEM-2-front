"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface PropertiesCardProps {
  title: string;
  // Aceptamos cualquier objeto con claves string y valores string/number/null
  data?: Record<string, string | number | null>;
  icon: LucideIcon;
  iconColorClass: string; // Ej: "text-blue-600 bg-blue-100"
}

export default function PropertiesCard({
  title,
  data,
  icon: Icon,
  iconColorClass,
}: PropertiesCardProps) {
  // Si no hay datos, no renderizamos nada (o podrías retornar un mensaje vacío)
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-2xl overflow-hidden h-fit">
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
          {Object.entries(data)
            // Filtramos claves internas que no queremos mostrar (como IDs o fechas)
            .filter(
              ([key]) =>
                ![
                  "material_id",
                  "id",
                  "created_at",
                  "updated_at",
                  "deleted_at",
                ].includes(key)
            )
            .map(([key, value]) => (
              <div
                key={key}
                className="bg-slate-50 p-3 rounded-lg border border-slate-100"
              >
                <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 break-words">
                  {key.replace(/_/g, " ")}
                </dt>
                <dd className="text-sm font-medium text-slate-700 capitalize leading-snug">
                  {value ? String(value) : "N/A"}
                </dd>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
