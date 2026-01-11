"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname, redirect } from "next/navigation";
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
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  LogOut,
  Menu,
  PlusCircle,
  Bell,
  LogIn,
  ShieldCheck,
} from "lucide-react";

import NotificationBell from "../ui/notificationBel";
import { navLinks } from "@/const/Categories";

import { useAuth } from "@/lib/hooks/useAuth";
import { signOutAction } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";

export function Navigation() {
  const { user, role, dbUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      // 1. Cierre LOCAL (Cliente):
      await supabase.auth.signOut();

      // 2. Cierre SERVIDOR (Cookies):
      // Asegura que las cookies httpOnly se borren
      await signOutAction();
      router.refresh();
      redirect("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Fallback de emergencia por si algo falla
      window.location.href = "/login";
    }
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

  // Normalizamos el rol para evitar problemas de mayúsculas
  const isAdmin = role?.toLowerCase() === "administrador";

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
          {/* 1. LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 group z-50 shrink-0"
          >
            <Image
              src="/images/UtemLogo.webp"
              alt="UTEM Logo"
              width={36}
              height={36}
              className="h-9 w-auto transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg text-slate-900 whitespace-nowrap">
                Biomateriales
              </span>
            </div>
          </Link>

          {/* 2. LINKS CENTRALES (Desktop) */}
          <div className="hidden lg:flex items-center gap-8">
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

          {/* 3. ZONA DE ACCIONES (Derecha) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón Registrar (Desktop) */}
            <div className="hidden lg:block">
              <Button
                asChild
                variant="ghost"
                className="text-green-700 hover:text-green-800 hover:bg-green-50 font-medium"
              >
                <Link href="/register-material">Registrar Material</Link>
              </Button>
            </div>

            {/* Separador (Desktop) */}
            <div className="hidden lg:block h-5 w-px bg-slate-200 mx-1" />

            {user ? (
              <>
                {googleId && (
                  <div className="shrink-0">
                    <NotificationBell googleId={googleId} />
                  </div>
                )}

                {/* PERFIL DROPDOWN (Desktop) */}
                <div className="hidden lg:block">
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
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer rounded-md hover:bg-slate-50"
                      >
                        <Link
                          href="/notification"
                          className="flex w-full items-center gap-2"
                        >
                          <Bell className="h-4 w-4 text-slate-500" />
                          <span>Notificaciones</span>
                        </Link>
                      </DropdownMenuItem>
                      {user && isAdmin && (
                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer rounded-md hover:bg-slate-50 "
                        >
                          <Link href="/admin">
                            <ShieldCheck className="h-4 w-4" />
                            Panel Admin
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer rounded-md gap-2"
                        onClick={(e) => {
                          e.preventDefault(); // Evita que el menú cierre la interacción antes de tiempo
                          handleLogout();
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* MENÚ MÓVIL (Logueado) */}
                <div className="lg:hidden">
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
                        <SheetTitle className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-200">
                            <AvatarImage src={userAvatar} alt={userName} />
                            <AvatarFallback>
                              {getInitials(userName, userEmail)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col overflow-hidden text-left">
                            <span className="font-bold text-sm truncate">
                              {userName}
                            </span>
                            <span className="text-xs text-slate-500 truncate font-normal">
                              {userEmail}
                            </span>
                          </div>
                        </SheetTitle>
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
                        <SheetClose asChild>
                          <Link
                            href="/user"
                            className="flex items-center gap-3 text-base font-medium p-3 rounded-lg text-slate-600 hover:bg-slate-50"
                          >
                            <User className="h-5 w-5" /> Mi Perfil
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/notification"
                            className="flex items-center gap-3 text-base font-medium p-3 rounded-lg text-slate-600 hover:bg-slate-50"
                          >
                            <Bell className="h-4 w-4 text-slate-500" />{" "}
                            Notificacones
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/register-material"
                            className="flex items-center gap-3 text-base font-medium p-3 rounded-lg text-green-700 bg-green-50/50 hover:bg-green-50"
                          >
                            <PlusCircle className="h-5 w-5" /> Registrar
                            Material
                          </Link>
                        </SheetClose>
                        {user && isAdmin && (
                          <SheetClose asChild>
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 text-base font-medium p-3  text-amber-700 mt-2  "
                            >
                              <ShieldCheck className="h-5 w-5" />
                              Panel Admin
                            </Link>
                          </SheetClose>
                        )}
                      </div>
                      <div className="mt-auto border-t border-slate-100 pt-4">
                        <SheetClose asChild>
                          <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3"
                          >
                            <LogOut className="h-5 w-5" /> Cerrar Sesión
                          </Button>
                        </SheetClose>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            ) : (
              // NO LOGUEADO
              <div className="flex items-center gap-2">
                <div className="hidden lg:block">
                  <Button
                    asChild
                    className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                  >
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                </div>
                {/* Menú Móvil No Logueado (sin cambios significativos) */}
                <div className="lg:hidden">
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
                        <SheetTitle className="flex items-center gap-3">
                          <div className="p-2 bg-green-50 rounded-lg">
                            <Image
                              src="/images/Utem.webp"
                              alt="Logo"
                              width={24}
                              height={24}
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-slate-900">
                              Biomateriales
                            </span>
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                              Menú Principal
                            </span>
                          </div>
                        </SheetTitle>
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
                        <SheetClose asChild>
                          <Link
                            href="/register-material"
                            className="flex items-center gap-3 text-base font-medium p-3 rounded-lg text-green-700 bg-green-50/50 hover:bg-green-50"
                          >
                            <PlusCircle className="h-5 w-5" /> Registrar
                            Material
                          </Link>
                        </SheetClose>
                      </div>
                      <div className="mt-auto border-t border-slate-100 pt-4">
                        <SheetClose asChild>
                          <Button
                            asChild
                            className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
                          >
                            <Link href="/login">
                              <LogIn className="h-4 w-4" /> Iniciar Sesión
                            </Link>
                          </Button>
                        </SheetClose>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
