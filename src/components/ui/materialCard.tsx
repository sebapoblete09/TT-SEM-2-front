"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export type Creador = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  google_id: string;
  nombre: string;
  email: string;
};

export type Paso = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  material_id: string;
  orden_paso: number;
  descripcion: string;
  url_imagen: string;
  url_video: string;
};

export type GaleriaItem = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  material_id: string;
  url_imagen: string;
  caption: string;
};

export type PropiedadesMecanicas = {
  material_id: string;
  resistencia: string;
  dureza: string;
  elasticidad: string;
  ductilidad: string;
  fragilidad: string;
};

export type PropiedadesPerceptivas = {
  material_id: string;
  color: string;
  brillo: string;
  textura: string;
  transparencia: string;
  sensacion_termica: string;
};

export type PropiedadesEmocionales = {
  material_id: string;
  calidez_emocional: string;
  inspiracion: string;
  sostenibilidad_percibida: string;
  armonia: string;
  innovacion_emocional: string;
};

export type Material = {
  id: string; // uuid
  nombre: string;
  descripcion: string;
  herramientas: string[];
  composicion: string[];
  derivado_de: string;
  creador_id: number;
  creado_en: string;
  actualizado_en: string;
  Creador: Creador;
  Colaboradores: Creador[];
  Pasos: Paso[];
  Galeria: GaleriaItem[];
  PropiedadesMecanicas: PropiedadesMecanicas;
  PropiedadesPerceptivas: PropiedadesPerceptivas;
  PropiedadesEmocionales: PropiedadesEmocionales;
};

interface MaterialCardProps {
  material: Material;
}

export function MaterialCard({ material }: MaterialCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      <Link href={`/material/${material.id}`}>
      {material.Galeria?.[0]?.url_imagen && (
        <div className="relative aspect-video w-full">
          <Image
            src={material.Galeria[0].url_imagen}
            alt={`Imagen de ${material.nombre}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false} // Cambiar a true para las primeras imágenes que se cargan en la página
          />
        </div>
      )}
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
