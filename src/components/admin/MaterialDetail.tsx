// components/admin/MaterialCardItem.tsx
"use client";

import { Material } from "@/types/materials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";

// 1. Definimos las props que recibirá este componente
type MaterialCardItemProps = {
  material: Material;
  // Le pedimos que nos pasen las funciones de aprobar y eliminar
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
};

export function MaterialCardItem({
  material,
  onApprove,
  onDelete,
}: MaterialCardItemProps) {
  // Este componente no tiene estado ni lógica de API,
  // solo muestra la info y llama a las funciones que le pasaron.

  return (
    // El 'key' se lo pondremos en el .map() del componente padre
    <Dialog>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              {/*aCA va la imagen */}
              <div className="space-y-1">
                <h3 className="font-semibold">{material.nombre}</h3>
                <p className="text-sm text-muted-foreground">
                  {material.descripcion}
                </p>
                <p className="text-sm text-muted-foreground">
                  Creado por: {material.creador.nombre}
                </p>
                <span className="text-sm text-muted-foreground">
                  {material.creador.email}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {/* --- BOTÓN DE MODAL --- */}
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost">
                  Ver Detalles
                </Button>
              </DialogTrigger>

              {/* --- BOTONES DE ACCIÓN --- */}
              {/* Llama a la función 'onApprove' que recibió por props */}
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={() => onApprove(material.id)}
              >
                <Check className="mr-2 h-4 w-4" />
                Aprobar
              </Button>
              {/* Llama a la función 'onDelete' que recibió por props */}
              <Button
                size="sm"
                variant="default"
                className="text-destructive hover:bg-destructive/50 bg-transparent"
                onClick={() => onDelete(material.id)}
              >
                <X className="mr-2 h-4 w-4" />
                Rechazar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- CONTENIDO DEL MODAL --- */}
      {/* Esto está todo encapsulado dentro de este componente */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{material.nombre}</DialogTitle>
          <DialogDescription>{material.descripcion}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Detalles del Creador</h4>
            <p className="text-sm text-muted-foreground">
              <strong>Nombre:</strong> {material.creador.nombre}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Email:</strong> {material.creador.email}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Información Adicional</h4>
            {/* ... más campos ... */}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
