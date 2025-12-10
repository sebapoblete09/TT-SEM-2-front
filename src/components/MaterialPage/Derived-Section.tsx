import Link from "next/link";
import Image from "next/image";
import { getDerivedMaterialsService } from "@/services/materialServices";
import { ArrowRight, GitFork } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DerivedSection({
  parentId,
}: {
  parentId: string;
}) {
  // 1. Fetch de datos
  const derivedMaterials = await getDerivedMaterialsService(parentId);

  // 2. Si no hay derivados, no renderizamos nada (Sección invisible)
  if (!derivedMaterials || derivedMaterials.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Título de la sección */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
          <GitFork className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">
            Iteraciones y Derivados
          </h3>
          <p className="text-sm text-slate-500">
            Materiales creados por la comunidad basándose en esta receta.
          </p>
        </div>
      </div>

      {/* Grid de Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {derivedMaterials.map((material: any) => (
          <Link
            href={`/material/${material.id}`}
            key={material.id}
            className="group"
          >
            <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 border-slate-200 group-hover:border-purple-300">
              {/* Imagen pequeña (Aspect ratio panorámico) */}
              <div className="relative w-full h-32 bg-slate-100">
                {material.galeria?.[0]?.url_imagen ? (
                  <Image
                    src={material.galeria[0].url_imagen}
                    alt={material.nombre}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300">
                    Sin imagen
                  </div>
                )}
                {/* Badge flotante */}
                <Badge className="absolute top-2 right-2 bg-white/90 text-purple-700 hover:bg-white text-[10px] shadow-sm backdrop-blur-sm">
                  Derivado
                </Badge>
              </div>

              <CardContent className="p-4">
                <h4 className="font-bold text-slate-800 truncate group-hover:text-purple-700 transition-colors">
                  {material.nombre}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {material.descripcion}
                </p>

                <div className="mt-3 flex items-center text-xs text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  Ver ficha técnica <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
