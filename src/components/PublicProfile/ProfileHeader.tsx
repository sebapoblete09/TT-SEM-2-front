import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { usuario } from "@/types/user";

interface ProfileHeaderProps {
  usuario: usuario;
}

const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function ProfileHeader({ usuario }: ProfileHeaderProps) {
  if (!usuario) return null;

  const userName = usuario?.nombre || "Usuario";
  const isAdmin = usuario?.rol?.toLowerCase() === "administrador";

  if (!usuario) return null;
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      {/* 1. BANNER DE FONDO */}
      {/* Usamos un gradiente bonito relacionado con biomateriales (verdes/azules) */}
      <div className="h-32 md:h-48 w-full bg-gradient-to-r from-emerald-500 to-teal-600 relative"></div>

      <div className="px-6 md:px-10 pb-8">
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
          {/* 2. AVATAR SUPERPUESTO */}
          <div className="relative">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md bg-white">
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl md:text-4xl font-bold">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* 3. INFORMACIÓN DE TEXTO */}
          <div className="flex-1 mt-2 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {userName}
              </h1>
              <Badge
                variant={isAdmin ? "default" : "secondary"}
                className={`w-fit ${
                  isAdmin ? "bg-blue-600 hover:bg-blue-700" : ""
                }`}
              >
                {usuario.rol}
              </Badge>
            </div>
            <p className="text-slate-500 text-base">{usuario.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
