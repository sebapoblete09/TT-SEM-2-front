"use client";

import { Material } from "@/types/materials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs } from "@/components/ui/tabs";
import { Image as ImageIcon } from "lucide-react";
import { MaterialModalContent } from "./MaterialModal";

type MaterialCardItemProps = {
  material: Material;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
};

export function MaterialCardItem({
  material,
  onApprove,
  onDelete,
}: MaterialCardItemProps) {
  // Helper para iniciales

  // Obtenemos la primera imagen de forma segura
  // Asegúrate de que tu tipo 'Material' tenga la propiedad 'galeria' definida correctamente
  const firstImage = material.galeria?.[0]?.url_imagen;

  return (
    <Dialog>
      {/* --- LA TARJETA VISIBLE (Igual que tu diseño bonito de antes) --- */}
      <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-amber-400 overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            {/* SECCIÓN IZQUIERDA: Info Principal */}
            <div className="flex items-start gap-4 flex-1">
              {/* Avatar del Creador (Visualmente atractivo) */}
              <Avatar className="h-16 w-16 border border-slate-200 shadow-sm rounded-lg overflow-hidden bg-slate-50">
                <AvatarImage
                  src={firstImage}
                  alt={material.nombre}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                {/* Fallback: Si no hay imagen, mostramos un icono o las iniciales */}
                <AvatarFallback className="bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-slate-800">
                    {material.nombre}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-xs text-amber-600 bg-amber-50 border-amber-200"
                  >
                    Pendiente
                  </Badge>
                </div>

                <p className="text-sm text-slate-500 line-clamp-1 max-w-md">
                  {material.descripcion}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    Por:{" "}
                    <span className="font-medium text-slate-600">
                      {material.creador.nombre}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDistanceToNow(
                      new Date(material.created_at || new Date()),
                      { addSuffix: true, locale: es }
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* SECCIÓN DERECHA: Acciones */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0 border-slate-100">
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-500 hover:text-slate-900"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Revisar
                </Button>
              </DialogTrigger>

              <div className="h-4 w-px bg-slate-200 mx-1 hidden md:block" />

              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => onDelete(material.id)}
              >
                <X className="mr-2 h-4 w-4" />
                Rechazar
              </Button>

              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                onClick={() => onApprove(material.id)}
              >
                <Check className="mr-2 h-4 w-4" />
                Aprobar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- EL MODAL LIMPIO --- */}
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl">
        {" "}
        {/* p-0 quita paddings raros */}
        <DialogHeader className="px-6 pt-6 pb-2 bg-white z-10">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200"
            >
              Pendiente
            </Badge>
            <span className="text-xs text-slate-400">
              ID: {material.id.split("-")[0]}
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            {material.nombre}
          </DialogTitle>
        </DialogHeader>
        {/* TABS WRAPPER */}
        <Tabs defaultValue="general" className="w-full">
          {/* Aquí inyectamos el contenido complejo */}
          <MaterialModalContent material={material} />
        </Tabs>
        {/* FOOTER FIJO */}
        <DialogFooter className="p-4 border-t border-slate-100 bg-white flex justify-between items-center sm:justify-between">
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-red-600 border-red-100 hover:bg-red-50"
              onClick={() => onDelete(material.id)}
            >
              <X className="mr-2 h-4 w-4" /> Rechazar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onApprove(material.id)}
            >
              <Check className="mr-2 h-4 w-4" /> Aprobar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
