"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Material, galeriaItem } from "@/types/materials";
import { cn } from "@/lib/utils";

export default function MaterialGallery({ material }: { material: Material }) {
  const [selectedImage, setSelectedImage] = useState<galeriaItem | null>(null);

  useEffect(() => {
    if (material.galeria && material.galeria.length > 0) {
      setSelectedImage(material.galeria[0]);
    }
  }, [material.galeria]);

  if (!material.galeria || material.galeria.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">
              No hay imágenes disponibles.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {selectedImage && (
          <div className="relative aspect-video bg-muted">
            <Image
              key={selectedImage.ID}
              src={selectedImage.url_imagen}
              alt={selectedImage.caption || material.nombre}
              fill
              className="object-cover rounded-t-lg"
              priority
            />
          </div>
        )}
        <div className="grid grid-cols-5 gap-2 p-4">
          {material.galeria.map((item) => (
            <button
              key={item.ID}
              className={cn(
                "relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                selectedImage?.ID === item.ID &&
                  "ring-2 ring-primary ring-offset-2"
              )}
              onClick={() => setSelectedImage(item)}
            >
              <Image
                src={item.url_imagen}
                alt={item.caption || `Vista de ${material.nombre}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
