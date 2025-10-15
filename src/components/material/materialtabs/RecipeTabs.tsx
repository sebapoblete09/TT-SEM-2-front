"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Step } from "@/components/register-material/Recipe";
import Image from "next/image";

type StepLike = Omit<Step, "id" | "url_imagen" | "url_video"> & {
  id?: number | string;
  url_imagen?: string | File | null;
  url_video?: string | File | null;
};

export default function RecipeTab({ pasos }: { pasos: StepLike[] }) {
  if (!pasos?.length)
    return <p className="text-muted-foreground">No hay pasos registrados.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receta / Proceso</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {pasos.map((p, i) => (
          <div key={p.id || i} className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg">Paso {p.orden_paso}</h3>
            <p className="text-muted-foreground">{p.descripcion}</p>

            <div className="grid grid-cols-2 gap-4">
              {p.url_imagen && (
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={
                      typeof p.url_imagen === "string"
                        ? p.url_imagen
                        : URL.createObjectURL(p.url_imagen)
                    }
                    alt={`Imagen paso ${p.orden_paso}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {p.url_video && (
                <video
                  controls
                  className="rounded-lg w-full h-auto max-h-60 object-cover"
                  src={
                    typeof p.url_video === "string"
                      ? p.url_video
                      : URL.createObjectURL(p.url_video)
                  }
                />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
