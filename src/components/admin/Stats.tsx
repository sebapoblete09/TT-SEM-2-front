import { Clock, FileCheck, Users, AlertCircle } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* TARJETA 1: PENDIENTES (Lo más importante para el admin) */}
      <Card className="border-2 border-amber-60 shadow-md shadow-amber-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardContent className="p-6 flex items-center gap-4 relative z-10">
          <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              Recetas Pendientes
            </p>
            <h3 className="text-3xl font-bold text-slate-900">4</h3>
            <p className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> Requieren revisión
            </p>
          </div>
        </CardContent>
      </Card>

      {/* TARJETA 2: APROBADAS (Éxito) */}
      <Card className="border-2 border-green-60 shadow-md shadow-green-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardContent className="p-6 flex items-center gap-4 relative z-10">
          <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
            <FileCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              Recetas Aprobadas
            </p>
            <h3 className="text-3xl font-bold text-slate-900">3</h3>
            <p className="text-xs text-green-600 font-medium mt-1">
              Publicadas en catálogo
            </p>
          </div>
        </CardContent>
      </Card>

      {/* TARJETA 3: USUARIOS (Informativo) */}
      <Card className="border-2 border-blue-60 shadow-md shadow-blue-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardContent className="p-6 flex items-center gap-4 relative z-10">
          <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Comunidad</p>
            <h3 className="text-3xl font-bold text-slate-900">7</h3>
            <p className="text-xs text-blue-600 font-medium mt-1">
              Usuarios registrados
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
