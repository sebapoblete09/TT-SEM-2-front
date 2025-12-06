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
import { Check, X, Eye, Calendar, Image as ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs } from "@/components/ui/tabs";

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
  // Obtener primera imagen con seguridad
  const firstImage = material.galeria?.[0]?.url_imagen;

  return (
    <Dialog>
      {/* --- TARJETA DE LA LISTA  --- */}
      <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-amber-400 overflow-hidden mb-4">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
            {/* IZQUIERDA: Avatar + Info */}
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-16 w-16 border border-slate-200 shadow-sm rounded-lg bg-slate-50">
                <AvatarImage
                  src={firstImage}
                  alt={material.nombre}
                  className="object-cover w-full h-full"
                />
                <AvatarFallback className="bg-slate-100 text-slate-400 rounded-lg">
                  <ImageIcon className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-lg text-slate-800 leading-tight">
                    {material.nombre}
                  </h3>
                  {material.estado === false ? (
                    <Badge
                      variant="outline"
                      className="text-[10px] text-amber-700 bg-amber-50 border-amber-200"
                    >
                      Pendiente
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] text-blue-700 bg-blue-50 border-blue-200"
                    >
                      Aprobado
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-slate-500 line-clamp-1 max-w-lg">
                  {material.descripcion}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-slate-600">
                      {material.creador.nombre}
                    </span>
                    <p>{material.creador.email}</p>
                  </span>
                  <span className="hidden sm:inline">•</span>
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

            {/* DERECHA: Botones Rápidos */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0 border-slate-100">
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100"
                >
                  <Eye className="mr-2 h-4 w-4" /> Revisar
                </Button>
              </DialogTrigger>

              <div className="h-4 w-px bg-slate-200 mx-1 hidden md:block" />

              {material.estado === false ? (
                <>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => onDelete(material.id)}
                  >
                    <X className="h-4 w-4" /> Rechazar
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onApprove(material.id)}
                  >
                    <Check className="h-4 w-4" /> Aprobar
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onDelete(material.id)}
                >
                  Avisar Edicion
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- EL MODAL  --- */}
      <DialogContent className="sm:max-w-[800px] w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
        {/* 1. HEADER FIJO */}
        <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-white shrink-0 z-10">
          <div className="flex items-center gap-2 mb-2">
            {material.estado === false ? (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                Revisión Pendiente
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Material Aprobado
              </Badge>
            )}
            <span className="text-xs text-slate-400 font-mono">
              ID: {material.id.split("-")[0]}
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900 line-clamp-1">
            {material.nombre}
          </DialogTitle>
        </DialogHeader>

        {/* 2. CUERPO SCROLLABLE */}
        <div className="flex-1 overflow-hidden bg-slate-50/50 relative">
          <Tabs defaultValue="general" className="h-full flex flex-col">
            <MaterialModalContent material={material} />
          </Tabs>
        </div>

        {/* 3. FOOTER FIJO */}
        <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-white shrink-0 flex flex-col sm:flex-row justify-between items-center gap-3">
          <DialogClose asChild>
            <Button variant="ghost" className="text-slate-500 w-full sm:w-auto">
              Cancelar
            </Button>
          </DialogClose>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline-primary"
              className="text-red-600 border-red-100 hover:bg-red-50 flex-1 sm:flex-none"
              onClick={() => onDelete(material.id)}
            >
              <X className="mr-2 h-4 w-4" /> Rechazar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
              onClick={() => onApprove(material.id)}
            >
              <Check className="mr-2 h-4 w-4" /> Aprobar y Publicar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
