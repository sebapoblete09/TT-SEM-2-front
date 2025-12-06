"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FlaskConical, Dna } from "lucide-react";

export default function CompositionCard({
  composicion,
}: {
  composicion?: string[];
}) {
  return (
    <Card className=" bg-white rounded-2xl overflow-hidden h-fit">
      {/* HEADER */}
      <CardHeader className="pb-4 border-b border-slate-100 bg-white pt-6 px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FlaskConical className="w-6 h-6 text-teal-600" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          <CardTitle className="text-xl font-bold text-teal-700">
            Composición
          </CardTitle>
        </div>
      </CardHeader>

      {/* CONTENIDO */}
      <CardContent className="p-6">
        {composicion && composicion.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {composicion.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 group p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {/* Icono decorativo */}
                <div className="w-10 h-10 shrink-0 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                  <Dna className="w-5 h-5 opacity-80" />
                </div>

                {/* Texto completo sin separar */}
                <span className="font-medium text-slate-700 text-sm capitalize leading-tight">
                  {item}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400">
            <p className="text-sm">No se registró composición.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
