"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Material, galeriaItem } from "@/types/materials";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

export default function MaterialGallery({ material }: { material: Material }) {
  const [selectedImage, setSelectedImage] = useState<galeriaItem | null>(null);
  // Estado para manejar la transición de opacidad al cambiar imagen
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (material.galeria && material.galeria.length > 0) {
      setSelectedImage(material.galeria[0]);
    }
  }, [material.galeria]);

  const handleImageSelect = (item: galeriaItem) => {
    if (selectedImage?.ID === item.ID) return;
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedImage(item);
      setIsAnimating(false);
    }, 200); // Pequeño delay para el efecto fade-out/fade-in
  };

  // Caso vacío: Diseño Placeholder más bonito
  if (!material.galeria || material.galeria.length === 0) {
    return (
      <Card className="border-none shadow-sm bg-slate-50 rounded-2xl overflow-hidden">
        <div className="relative aspect-video flex flex-col items-center justify-center text-slate-400 gap-2">
          <ImageIcon className="w-12 h-12 opacity-50" />
          <p className="text-sm font-medium">No hay imágenes disponibles</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none  bg-white rounded-2xl overflow-hidden">
      {/* 1. VISOR PRINCIPAL */}
      <div className="relative aspect-[4/3] md:aspect-video bg-slate-100 overflow-hidden group rounded-2xl">
        {selectedImage ? (
          <>
            <Image
              key={selectedImage.ID}
              src={selectedImage.url_imagen}
              alt={selectedImage.caption || material.nombre}
              fill
              className={cn(
                "object-cover transition-opacity duration-300 ease-in-out",
                isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100"
              )}
              priority
            />
            {/* Caption flotante (si existe) */}
            {selectedImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium">
                  {selectedImage.caption}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <ImageIcon className="w-10 h-10" />
          </div>
        )}
      </div>

      {/* 2. CARRUSEL DE MINIATURAS */}
      {material.galeria.length > 1 && (
        <div className="p-8 bg-white ">
          <div className="flex gap-5 p-2 overflow-x-auto pb-2 scrollbar-hide">
            {material.galeria.map((item) => (
              <button
                key={item.ID}
                onClick={() => handleImageSelect(item)}
                className={cn(
                  "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ease-out",
                  "hover:ring-2 hover:ring-green-200 hover:scale-105", // Efecto Hover
                  selectedImage?.ID === item.ID
                    ? "ring-2 ring-green-500 ring-offset-2 shadow-md scale-100 opacity-100" // Estado Activo
                    : "opacity-70 hover:opacity-100 ring-1 ring-slate-200" // Estado Inactivo
                )}
              >
                <Image
                  src={item.url_imagen}
                  alt={item.caption || `Miniatura`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
