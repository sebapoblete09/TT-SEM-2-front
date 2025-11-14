import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

//import tipos
import { usuario } from "@/types/user";

// 1. Define un tipo para TODAS las props que el componente necesita
interface ProfileHeaderProps {
  usuario: usuario;
  userAvatar: string; // Lo llamo 'avatar' para que coincida con tu JSX
}

// Función helper para las iniciales (puedes moverla afuera si prefieres)
const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function ProfileHeader({ usuario, userAvatar }: ProfileHeaderProps) {
  // Obtenemos el avatar de Supabase (si existe) o usamos el nombre de usuario
  const userName = usuario.nombre || "Usuario";

  return (
    <section className="flex items-center gap-6 mb-10">
      {/* AVATAR */}
      <Avatar className="h-24 w-24">
        <AvatarImage
          src={userAvatar || ""} // Dato dinámico
          alt={userName || "Usuario"}
        />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {getInitials(userName)} {/* Dato dinámico */}
        </AvatarFallback>
      </Avatar>

      {/* INFO */}
      <div>
        <h1 className="text-2xl font-bold">{userName}</h1>
        <p className="text-lg text-muted-foreground">{usuario.email}</p>
        <Badge className="mt-2 capitalize">{usuario.rol}</Badge>
      </div>
    </section>
  );
}
