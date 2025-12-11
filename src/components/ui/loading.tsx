import { Loader2 } from "lucide-react";
import { Card } from "./card";

export default function LoadingCard() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-64 p-6 shadow-2xl border-none bg-white/90 text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
        </div>
        <h3 className="font-semibold text-slate-800">Cargando Material...</h3>
        <p className="text-xs text-slate-500 mt-1">
          Preparando imágenes y datos
        </p>
      </Card>
    </div>
  );
}

export function LoadingCatalog() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-64 p-6 shadow-2xl border-none bg-white/90 text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
        </div>
        <h3 className="font-semibold text-slate-800">Cargando Catalogo...</h3>
      </Card>
    </div>
  );
}

export function LoadingProfile() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-64 p-6 shadow-2xl border-none bg-white/90 text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
        </div>
        <h3 className="font-semibold text-slate-800">Cargando perfil...</h3>
      </Card>
    </div>
  );
}

export function LoadingAdmin() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-64 p-6 shadow-2xl border-none bg-white/90 text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
        </div>
        <h3 className="font-semibold text-slate-800">Cargando Dashboard...</h3>
      </Card>
    </div>
  );
}

export function LoadingNotification() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-64 p-6 shadow-2xl border-none bg-white/90 text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
        </div>
        <h3 className="font-semibold text-slate-800">
          Cargando Notificaciones...
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Preparando las ultimas novedades de tu perfil.
        </p>
      </Card>
    </div>
  );
}
