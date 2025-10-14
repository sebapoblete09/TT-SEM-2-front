"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Material } from "@/components/ui/materialCard";

export default function MaterialGallery({ material }: { material: Material }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative aspect-video bg-muted">
          {material.Galeria[0]?.url_imagen && (
            <Image
              src={material.Galeria[0].url_imagen}
              alt={material.nombre}
              fill
              className="object-cover rounded-t-lg"
              priority
            />
          )}
        </div>
        <div className="grid grid-cols-5 gap-2 p-4">
          {material.Galeria.map((item) => (
            <div
              key={item.ID}
              className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image
                src={item.url_imagen}
                alt={item.caption || `Vista de ${material.nombre}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
