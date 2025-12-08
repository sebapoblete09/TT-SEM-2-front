// components/forms/EditSuccess.tsx
"use client";

import { CheckCircle2, Home } from "lucide-react";
import { Card } from "@/components/ui/card"; // Ajuste de import
import { Button } from "@/components/ui/button"; // Ajuste de import
import { useRouter } from "next/navigation";

interface EditSuccessProps {
  onClose: () => void;
}

export function EditSuccess({ onClose }: EditSuccessProps) {
  const router = useRouter();

  const handleBack = () => {
    // Navegar al perfil
    router.push("/user");
    // Cerrar el modal padre si es necesario
    onClose();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 animate-in fade-in zoom-in-95 duration-300">
      {" "}
      <Card className="w-full max-w-md p-8 shadow-2xl border-none bg-white text-center relative overflow-hidden">
        {/* Decoración superior */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-teal-500" />

        <div className="flex flex-col items-center">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            ¡Edición Exitosa!
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Tu material ha sido editado correctamente y está pendiente de
            aprobación.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={handleBack}
              size="lg"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Home className="mr-2 h-4 w-4" />
              Volver al Perfil
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
