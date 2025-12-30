"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Material } from "@/types/materials";

import EditMaterialForm from "./editMaterial/EditMaterialForm";

export function EditMaterialDialog({ material }: { material: Material }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/90 text-slate-700 hover:text-green-700 hover:bg-white shadow-sm backdrop-blur-sm transition-all"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar material</span>
        </Button>
      </DialogTrigger>

      {/* Contenido del Modal */}
      <DialogContent className="w-[95vw] max-w-[800px] max-h-[90dvh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-white shrink-0 z-10">
          <DialogTitle className="text-lg sm:text-xl break-words leading-tight pr-4">
            Editar Material: {material.nombre}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Realiza cambios en la información de tu material.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50/50 relative">
          <EditMaterialForm
            material={material}
            onSuccessClose={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
