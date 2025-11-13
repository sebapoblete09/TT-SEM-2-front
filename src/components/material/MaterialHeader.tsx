"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Download, Share2 } from "lucide-react";
import { Material } from "@/types/materials";

export default function MaterialHeader({ material }: { material: Material }) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{material.nombre}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {material.descripcion}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="default" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Creador Info */}
      <div className="flex items-center gap-6 text-md  ">
        <div className="flex items-center gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {material.creador.nombre?.[0] ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{material.creador.nombre}</p>
            <p className="text-muted-foreground">{material.creador.rol}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Publicado:{" "}
            {new Date(material.created_at).toLocaleDateString("es-MX", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {material.colaboradores.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Colaboradores:</p>
          <div className="flex flex-wrap gap-2">
            {material.colaboradores.map((colab) => (
              <Badge key={colab.ID} variant="outline">
                {colab.nombre}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
