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
  const firstImage = material.galeria?.[0]?.url_imagen;

  return (
    <Dialog>
      {/* --- TARJETA DE LA LISTA --- */}
      <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-amber-400 overflow-hidden mb-4">
        {/* Padding reducido en móvil (p-3) y normal en desktop (sm:p-5) */}
        <CardContent className="p-3 sm:p-5">
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-start md:items-center justify-between">
            {/* IZQUIERDA: Avatar + Info */}
            {/* min-w-0 previene desbordamientos de texto flex */}
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full">
              {/* Avatar más pequeño en móvil (h-12) */}
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border border-slate-200 shadow-sm rounded-lg bg-slate-50 shrink-0">
                <AvatarImage
                  src={firstImage}
                  alt={material.nombre}
                  className="object-cover w-full h-full"
                />
                <AvatarFallback className="bg-slate-100 text-slate-400 rounded-lg">
                  <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 leading-tight truncate">
                    {material.nombre}
                  </h3>
                  {material.estado === false ? (
                    <Badge
                      variant="outline"
                      className="text-[10px] text-amber-700 bg-amber-50 border-amber-200 whitespace-nowrap"
                    >
                      Pendiente
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] text-blue-700 bg-blue-50 border-blue-200 whitespace-nowrap"
                    >
                      Aprobado
                    </Badge>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 max-w-lg">
                  {material.descripcion}
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1 truncate">
                    <span className="font-medium text-slate-600 truncate max-w-[100px] sm:max-w-[150px]">
                      {material.creador.nombre}
                    </span>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1 whitespace-nowrap">
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
            {/* Estrategia Responsive para Botones:
                - Mobile: Grid (se adapta mejor que flex wrap).
                - Desktop: Flex normal.
            */}
            <div className="w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 mt-1 md:mt-0 border-slate-100">
              <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full">
                {/* Botón Revisar: Full width en grid móvil si es impar, o auto en flex */}
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="col-span-2 sm:col-span-1 w-full sm:w-auto text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100"
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
                      className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 truncate"
                      onClick={() => onDelete(material.id)}
                    >
                      <X className="h-4 w-4 mr-1" /> Rechazar
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white truncate"
                      onClick={() => onApprove(material.id)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Aprobar
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="default"
                    className="col-span-2 sm:col-span-1 w-full sm:w-auto"
                    onClick={() => onDelete(material.id)}
                  >
                    Avisar Edicion
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- EL MODAL --- */}
      <DialogContent className="sm:max-w-[800px] w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
        {/* 1. HEADER FIJO */}
        <DialogHeader className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 bg-white shrink-0 z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
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
          <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 line-clamp-1">
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
        {/* Cambiado a flex-col-reverse en móvil para apilar botones verticalmente */}
        <DialogFooter className="px-4 sm:px-6 py-4 border-t border-slate-100 bg-white shrink-0 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
          <DialogClose asChild>
            <Button variant="ghost" className="text-slate-500 w-full sm:w-auto">
              Cancelar
            </Button>
          </DialogClose>

          {/* Grupo de acciones: Columna en móvil (para textos largos), Fila en desktop */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline-primary"
              className="text-red-600 border-red-100 hover:bg-red-50 w-full sm:w-auto justify-center"
              onClick={() => onDelete(material.id)}
            >
              <X className="mr-2 h-4 w-4" /> Rechazar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto justify-center"
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
