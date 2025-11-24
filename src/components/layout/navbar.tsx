"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"; // Asegúrate de tener este componente instalado
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Menu, PlusCircle } from "lucide-react";

import NotificationBell from "../ui/notificationBel";

export function Navigation() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sesión
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => listener?.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const getInitials = (name?: string, email?: string) => {
    if (name)
      return (
        name.split(" ")[0][0] + (name.split(" ")[1]?.[0] || "")
      ).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return "??";
  };

  const userName = user?.user_metadata?.full_name;
  const userEmail = user?.email;
  const userAvatar = user?.user_metadata?.avatar_url;
  const googleId = user?.identities?.find((id) => id.provider === "google")?.id;

  // Enlaces de navegación
  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Descubrir", href: "/materials" },
    { name: "Cómo Participar", href: "/#participar" },
    { name: "Nosotros", href: "/#nosotros" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b shadow-sm"
          : "bg-white border-b border-transparent"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group z-50">
            <Image
              src="/images/Utem.webp"
              alt="UTEM Logo"
              width={36}
              height={36}
              className="h-9 w-auto transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg text-slate-900">
                Biomateriales
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
                UTEM
              </span>
            </div>
          </Link>

          {/* MENU DESKTOP (Links centrales) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${
                  pathname === link.href
                    ? "text-green-600 font-semibold"
                    : "text-slate-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ACCIONES DESKTOP (Derecha) */}
          {/* CAMBIO CLAVE: 'hidden md:flex' oculta todo esto en móvil */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="text-green-700 hover:text-green-800 hover:bg-green-50 font-medium"
            >
              <Link href="/register-material">Registrar Material</Link>
            </Button>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            {user ? (
              <>
                {googleId && <NotificationBell googleId={googleId} />}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-green-100 p-0 overflow-hidden"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={userAvatar}
                          alt={userName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-green-100 text-green-700 font-bold text-xs">
                          {getInitials(userName, userEmail)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  {/* AQUI ESTA EL ARREGLO DEL FONDO BLANCO */}
                  <DropdownMenuContent
                    align="end"
                    className="w-60 p-2 bg-white border border-slate-200 shadow-xl rounded-xl z-50"
                  >
                    <DropdownMenuLabel className="font-normal p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-slate-900">
                          {userName}
                        </p>
                        <p className="text-xs leading-none text-slate-500 truncate">
                          {userEmail}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-100" />
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-md hover:bg-slate-50"
                    >
                      <Link
                        href="/user"
                        className="flex w-full items-center gap-2"
                      >
                        <User className="h-4 w-4 text-slate-500" />
                        <span>Mi Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-100" />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer rounded-md gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
              >
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            )}
          </div>

          {/* ---------------- MOBILE MENU TRIGGER ---------------- */}
          <div className="md:hidden flex items-center gap-2">
            {/* Opcional: Dejar la campana visible en móvil fuera del menú si quieres */}
            {user && googleId && (
              <div className="mr-2">
                <NotificationBell googleId={googleId} />
              </div>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-700 hover:bg-slate-100"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-white flex flex-col z-[60]"
              >
                <SheetHeader className="text-left border-b border-slate-100 pb-4 mb-4">
                  {user ? (
                    // Header del menú móvil si está logueado: Muestra el perfil aquí
                    <SheetTitle className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-slate-200">
                        <AvatarImage src={userAvatar} alt={userName} />
                        <AvatarFallback>
                          {getInitials(userName, userEmail)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden text-left">
                        {" "}
                        {/* text-left importante aquí */}
                        <span className="font-bold text-sm truncate">
                          {userName}
                        </span>
                        <span className="text-xs text-slate-500 truncate font-normal">
                          {userEmail}
                        </span>
                      </div>
                    </SheetTitle>
                  ) : (
                    <SheetTitle className="flex items-center gap-2">
                      <Image
                        src="/images/Utem.webp"
                        alt="Logo"
                        width={24}
                        height={24}
                      />
                      <span className="font-bold">Menú</span>
                    </SheetTitle>
                  )}
                </SheetHeader>

                <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={`text-base font-medium p-3 rounded-lg transition-colors ${
                          pathname === link.href
                            ? "bg-green-50 text-green-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </SheetClose>
                  ))}

                  <div className="border-t border-slate-100 my-2" />

                  {user && (
                    <>
                      <SheetClose asChild>
                        <Link
                          href="/user"
                          className="flex items-center gap-3 text-base font-medium p-3 rounded-lg text-slate-600 hover:bg-slate-50"
                        >
                          <User className="h-5 w-5" />
                          Mi Perfil
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/register-material"
                          className="flex items-center gap-3 text-base font-medium p-3 rounded-lg text-green-700 bg-green-50/50 hover:bg-green-50"
                        >
                          <PlusCircle className="h-5 w-5" />
                          Registrar Material
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </div>

                <div className="mt-auto border-t border-slate-100 pt-4">
                  {user ? (
                    <SheetClose asChild>
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3"
                      >
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                      </Button>
                    </SheetClose>
                  ) : (
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="w-full bg-green-600 hover:bg-green-700 text-lg h-12"
                      >
                        <Link href="/login">Iniciar Sesión</Link>
                      </Button>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
