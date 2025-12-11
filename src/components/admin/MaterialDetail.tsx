"use client";

import { useState } from "react";
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
import {
  Check,
  X,
  Eye,
  Calendar,
  Image as ImageIcon,
  ZoomIn,
  Send,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Importamos el contenido del modal y el diálogo de rechazo
import { MaterialModalContent } from "./MaterialModal";
import { RejectionDialog } from "./RejectionMaterial";
type MaterialCardItemProps = {
  material: Material;
  onApprove: (id: string) => void;
  onRejectWithReason: (id: string, reason: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>; // <--- NUEVA PROP
  isCorrectionSent?: boolean;
};

export function MaterialCardItem({
  material,
  onApprove,
  onRejectWithReason,
  isCorrectionSent,
  onDelete,
}: MaterialCardItemProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const firstImage = material.galeria?.[0]?.url_imagen;

  // Manejador para confirmar el rechazo desde el modal
  const handleConfirmReject = async (reason: string) => {
    setIsSubmitting(true);
    await onRejectWithReason(material.id, reason);
    setIsSubmitting(false);
    setShowRejectModal(false);
  };
  // Manejador para eliminar
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await onDelete(material.id);
    setIsDeleting(false);
  };

  return (
    <>
      <Dialog>
        {/* --- TARJETA DE LA LISTA --- */}
        <Card
          className={`group hover:shadow-md transition-all duration-200 border-l-4 overflow-hidden mb-3 sm:mb-4 ${
            isCorrectionSent
              ? "border-l-orange-500 bg-orange-50/30"
              : "border-l-amber-400"
          }`}
        >
          {/* Padding reducido en móvil: p-3 */}
          <CardContent className="p-3 sm:p-5">
            <div className="flex flex-col md:flex-row gap-3 md:gap-5 justify-between">
              {/* --- ZONA SUPERIOR: INFO --- */}
              <div className="flex items-start gap-3 w-full min-w-0">
                {/* ... (Avatar y Diálogo de imagen - Se mantienen igual) ... */}
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative group/avatar cursor-zoom-in shrink-0">
                      <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border border-slate-200 rounded-lg bg-slate-50 transition-transform hover:scale-105">
                        <AvatarImage
                          src={firstImage}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-slate-100 text-slate-400 rounded-lg">
                          <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/0 group-hover/avatar:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                        <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover/avatar:opacity-100 drop-shadow-md" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 bg-transparent border-none shadow-none flex items-center justify-center outline-none">
                    <div className="relative w-full h-full flex items-center justify-center">
                      {firstImage && (
                        <img
                          src={firstImage}
                          alt={material.nombre}
                          className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex-1 min-w-0 space-y-1">
                  {/* Título y Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-tight truncate max-w-full">
                      {material.nombre}
                    </h3>
                    {isCorrectionSent ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 h-5 text-orange-700 bg-orange-100 border-orange-200"
                      >
                        Corrección Solicitada
                      </Badge>
                    ) : material.estado === false ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 h-5 text-amber-700 bg-amber-50 border-amber-200"
                      >
                        Pendiente
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 h-5 text-blue-700 bg-blue-50 border-blue-200"
                      >
                        Aprobado
                      </Badge>
                    )}
                  </div>

                  {/* Descripción oculta en móvil (<640px) */}
                  <p className="hidden sm:block text-sm text-slate-500 line-clamp-1">
                    {material.descripcion}
                  </p>

                  {/* Metadatos compactos */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 pt-0.5">
                    <span className="font-medium text-slate-600 truncate max-w-[100px] sm:max-w-none">
                      {material.creador.nombre}
                    </span>
                    <span>•</span>
                    <span className="whitespace-nowrap flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDistanceToNow(
                        new Date(material.created_at || new Date()),
                        { locale: es }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* --- ZONA ACCIONES (Responsive Grid) --- */}
              <div className="mt-1 md:mt-0 md:border-l md:border-slate-100 md:pl-4 flex shrink-0">
                {/* Ajustamos el grid para acomodar el botón extra */}
                <div className="grid grid-cols-[auto_1fr_1fr_auto] md:flex items-center gap-2 w-full">
                  {/* Botón REVISAR (Abre el modal grande) */}
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="md:w-auto text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-100 md:border-transparent"
                    >
                      <Eye className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">Revisar</span>
                    </Button>
                  </DialogTrigger>

                  {/* Botones de Decisión */}
                  {material.estado === false ? (
                    <>
                      {isCorrectionSent ? (
                        // Estado: Ya se envió corrección
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="col-span-2 md:w-auto text-orange-600 border-orange-200 bg-orange-50"
                        >
                          <Send className="h-4 w-4 md:mr-2" />
                          <span className="hidden md:inline">Enviado</span>
                          <span className="md:hidden">Enviado</span>
                        </Button>
                      ) : (
                        // Estado: Pendiente normal
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => setShowRejectModal(true)}
                          >
                            <X className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Corrección</span>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => onApprove(material.id)}
                          >
                            <Check className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Aprobar</span>
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    // Estado: Ya aprobado
                    <Button
                      size="sm"
                      className="col-span-2 md:w-auto"
                      onClick={() => setShowRejectModal(true)}
                    >
                      Avisar Edición
                    </Button>
                  )}

                  {/* --- BOTÓN ELIMINAR CON CONFIRMACIÓN --- */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 px-2 ml-1"
                        disabled={isDeleting}
                        title="Eliminar material"
                      >
                        {isDeleting ? (
                          <span className="animate-spin text-lg leading-none">
                            ⟳
                          </span>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ¿Estás completamente seguro?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará
                          permanentemente el material{" "}
                          <strong>{material.nombre}</strong> y todos sus datos
                          asociados de la base de datos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleConfirmDelete}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {isDeleting ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- MODAL DE DETALLE (Full Responsive) --- */}
        <DialogContent className="w-[95vw] max-w-[800px] max-h-[90dvh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-white shrink-0 z-10">
            <DialogTitle className="line-clamp-1">
              {material.nombre}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50/50 relative">
            <div className="p-4 sm:p-6">
              <Tabs defaultValue="general" className="w-full">
                <MaterialModalContent material={material} />
              </Tabs>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-white shrink-0 flex flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button variant="ghost" className="w-full sm:w-auto">
                Cerrar
              </Button>
            </DialogClose>
            {/* Botones duplicados en el modal para facilitar la acción tras revisar */}
            {!material.estado && !isCorrectionSent && (
              <>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                  onClick={() => setShowRejectModal(true)}
                >
                  Solicitar Corrección
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                  onClick={() => onApprove(material.id)}
                >
                  Aprobar y Publicar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL DE RECHAZO (Independiente) --- */}
      <RejectionDialog
        open={showRejectModal}
        onOpenChange={setShowRejectModal}
        onConfirm={handleConfirmReject}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
