"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // Importamos el cliente
import type { User as SupabaseUser } from "@supabase/supabase-js"; // Importamos el TIPO
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings } from "lucide-react"; // Se quitó 'Shield'

export function Navigation() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  // 1. Obtener la sesión y escuchar cambios
  useEffect(() => {
    // Función async para obtener la sesión inicial
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listener para cambios (login, logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Limpiar el listener al desmontar el componente
    return () => listener?.subscription.unsubscribe();
  }, [supabase]);

  // 2. Función para manejar el Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirigimos al inicio y refrescamos para limpiar el estado del servidor
    router.push("/");
    router.refresh();
  };

  // 3. Lógica para el Avatar (iniciales)
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.split(" ");
      if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "??";
  };

  // 4. Lógica de Admin

  // Datos dinámicos para el perfil
  const userName = user?.user_metadata?.full_name;
  const userEmail = user?.email;
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <nav className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo (sin cambios) */}
          <Link href="/" className="flex items-center gap-3 font-bold text-xl">
            <Image
              src="/images/Utem.webp"
              alt="UTEM Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="hidden sm:inline">UTEM Biomateriales</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Descubrir
            </Link>
            <Link
              href="/register-material"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Registrar Material
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Comunidad
            </Link>
          </div>

          {/* User Menu o Botón de Login */}
          <div className="flex items-center gap-4">
            {loading ? (
              // Esqueleto mientras carga
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              // --- ESTADO LOGUEADO ---
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage
                        src={userAvatar || ""} // Dato dinámico
                        alt={userName || userEmail || "Usuario"}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(userName, userEmail)} {/* Dato dinámico */}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {userName || "Usuario"} {/* Dato dinámico */}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userEmail} {/* Dato dinámico */}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  {/* --- ¡BOTÓN DE LOGOUT FUNCIONAL! --- */}
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // --- ESTADO NO LOGUEADO ---
              <Button asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
