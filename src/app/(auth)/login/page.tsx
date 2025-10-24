"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client"; // ¡El cliente de CLIENTE!
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function Page() {
  const [loading, setLoading] = useState(false);
  // ¡Importante! Usamos el nuevo cliente del PASO 1
  const supabase = createClient();

  // Función para manejar el login
  const loginWithGoogle = async () => {
    setLoading(true);

    // Obtenemos la URL base (http://localhost:3000)
    const redirectTo = `${window.location.origin}/auth/callback`;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo, // ¡Clave! Apunta a tu nueva ruta de callback
      },
    });
    // No necesitamos setLoading(false) porque el usuario será redirigido
  };

  // (El JSX de return sigue igual... no es necesario repetirlo)
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Login Form */}
      <div className="flex items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-blue-50/30">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large circle - top left */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-green-100/40 to-transparent blur-3xl" />
          {/* Medium circle - bottom right */}
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-tl from-blue-100/40 to-transparent blur-3xl" />
          {/* Geometric shapes */}
          <div className="absolute top-1/4 right-12 w-32 h-32 border-2 border-green-200/30 rounded-lg rotate-12" />
          <div className="absolute bottom-1/3 left-12 w-24 h-24 border-2 border-blue-200/30 rounded-full" />
          {/* Small accent dots */}
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-green-300/40 rounded-full" />
          <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-blue-300/40 rounded-full" />
          <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-green-400/30 rounded-full" />
        </div>

        <Card className="w-full max-w-md shadow-xl border-border/50 backdrop-blur-sm bg-white/95 relative z-10">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/Utem.webp"
                alt="UTEM Logo"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
              <span className="font-bold text-xl">UTEM Biomateriales</span>
            </div>
            <CardTitle className="text-3xl">Bienvenido</CardTitle>
            <CardDescription className="text-base">
              Inicia sesión para acceder a la plataforma de biomateriales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full h-12 text-base bg-transparent"
              size="lg"
              variant="ghost"
              onClick={loginWithGoogle}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Acceso institucional
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Nota:</strong> El acceso a
                la plataforma requiere aprobación administrativa. Después de
                iniciar sesión con tu cuenta institucional, tu solicitud será
                revisada por el equipo de administración.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:block relative bg-muted">
        <Image
          src="/images/Innova.webp"
          alt="Laboratorio de Biomateriales"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Innovación en Biomateriales
          </h2>
          <p className="text-lg text-white/90 max-w-lg leading-relaxed">
            Únete a la comunidad de investigadores de la UTEM trabajando en el
            desarrollo de materiales sostenibles para un futuro más verde.
          </p>
        </div>
      </div>
    </div>
  );
}
