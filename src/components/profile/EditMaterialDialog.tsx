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

// Aquí importarías tu formulario real, por ejemplo:
import EditMaterialForm from "./EditMaterialForm";

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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Material: {material.nombre}</DialogTitle>
          <DialogDescription>
            Realiza cambios en la información de tu material.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* AQUÍ VA TU COMPONENTE DE FORMULARIO DE EDICIÓN */}
          {/* <EditMaterialForm material={material} onSuccess={() => setOpen(false)} /> */}
          <div className="p-10 text-center border-2 border-dashed rounded-xl bg-slate-50">
            <p className="text-slate-500">
              <EditMaterialForm
                material={material}
                onSuccess={() => setOpen(false)}
              />
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
