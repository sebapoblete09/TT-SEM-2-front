"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Material_Card } from "@/types/materials";

interface MaterialCardProps {
  material: Material_Card;
}

export function MaterialCard({ material }: MaterialCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      <Link href={`/material/${material.id}`}>
        <div className="relative aspect-video w-full">
          <Image
            src={material.primera_imagen_galeria}
            alt={`Imagen de ${material.nombre}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false} // Cambiar a true para las primeras imágenes que se cargan en la página
          />
        </div>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {material.nombre}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {material.descripcion}
          </p>

          {material.composicion && material.composicion.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {material.composicion.slice(0, 3).map((comp, idx) => (
                <Badge key={idx} variant="secondary">
                  {comp}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
