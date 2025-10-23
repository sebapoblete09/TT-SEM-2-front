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
      {/* ... Tu JSX ... */}
      <div className="flex items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-blue-50/30">
        <Card className="w-full max-w-md shadow-xl border-border/50 backdrop-blur-sm bg-white/95 relative z-10">
          <CardHeader className="space-y-4">
            {/* ... */}
            <CardTitle className="text-3xl">Bienvenido</CardTitle>
            {/* ... */}
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full h-12 text-base" // Quité bg-transparent y variant-ghost para que use el estilo default
              size="lg"
              onClick={loginWithGoogle}
              disabled={loading} // Deshabilita el botón mientras carga
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                {/* ... path ... */}
              </svg>
              Continuar con Google
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Right side - Hero Image */}
      <div className="hidden lg:block relative bg-muted">
        {/* ... Tu JSX de la imagen ... */}
      </div>
    </div>
  );
}
