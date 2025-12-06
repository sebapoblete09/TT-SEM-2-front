"use client";

/**
 * @file page.tsx
 * @description Página de inicio de sesión (Login) principal.
 * Implementa autenticación OAuth con Google mediante Supabase Auth.
 * Diseño optimizado para mostrar la propuesta de valor y roles de usuario antes del acceso.
 */

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Image from "next/image";
import { ArrowRight, BookOpen, FlaskConical } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function Page() {
  // Estado local para feedback visual durante el proceso de autenticación
  const [loading, setLoading] = useState(false);

  // Instancia del cliente Supabase para el navegador
  const supabase = createClient();

  /**
   * Maneja el flujo de inicio de sesión con Google.
   * Redirige al endpoint /auth/callback para procesar el código de intercambio.
   */
  const loginWithGoogle = async () => {
    try {
      setLoading(true);

      // Construimos la URL de callback dinámicamente basada en el origen actual.
      // Esto asegura que funcione tanto en localhost como en producción (Vercel).
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo,
          // Forzamos el prompt de consentimiento para asegurar que Google entregue
          // un refresh token si es necesario en el futuro.
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("Error iniciando OAuth:", error.message);
        // Aquí se podría implementar un Toast de error
      }
    } catch (error) {
      console.error("Error inesperado en login:", error);
    } finally {
      // Nota: No reseteamos setLoading(false) aquí porque la redirección
      // de OAuth navegará fuera de la página, y queremos mantener el estado de carga.
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ==================================================================
          SECCIÓN IZQUIERDA: Formulario y Propuesta de Valor
          Diseño: Fondo claro con elementos decorativos sutiles
      ================================================================== */}
      <div className="flex items-center justify-center p-8 relative overflow-hidden bg-slate-50">
        {/* Elementos decorativos de fondo (Blobs) para dar profundidad visual */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-100/40 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Tarjeta Principal con efecto Glassmorphism */}
        <Card className="w-full max-w-md shadow-2xl shadow-slate-200/50 border-none bg-white/80 backdrop-blur-xl relative z-10">
          <CardHeader className="space-y-2 text-center pb-2">
            {/* Logo Institucional */}
            <div className="mx-auto mb-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 w-fit">
              <Image
                src="/images/Utem.webp"
                alt="UTEM Logo"
                width={56}
                height={56}
                className="h-14 w-auto"
                priority // Carga prioritaria para evitar layout shift (LCP)
              />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Bienvenido a la Comunidad
            </CardTitle>
            <p className="text-slate-500 text-sm">
              Plataforma de Innovación en Biomateriales
            </p>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            {/* --- Explicación de Roles y Permisos --- */}
            {/* Se muestra explícitamente para gestionar las expectativas del usuario nuevo */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Tu nivel de acceso
              </p>

              {/* Rol 1: Lector (Default) */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 text-green-700 rounded-lg mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Acceso Lector (Inmediato)
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Podrás explorar todo el catálogo, ver recetas detalladas
                    ademas de sus propiedades.
                  </p>
                </div>
              </div>

              {/* Separador visual sutil */}
              <div className="w-full h-px bg-slate-200/50 my-2" />

              {/* Rol 2: Colaborador (Requiere solicitud) */}
              <div className="flex items-start gap-3 opacity-75">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-0.5">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    Ser Colaborador
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                      Solicitable
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    ¿Quieres aportar tus recetas? Podrás solicitar permisos de
                    creación desde tu perfil.
                  </p>
                </div>
              </div>
            </div>

            {/* --- Botón de Acción Principal (CTA) --- */}
            <div className="space-y-4">
              <Button
                className="w-full h-12 text-base font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm group"
                size="lg"
                onClick={loginWithGoogle}
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-pulse">Conectando...</span>
                ) : (
                  <>
                    {/* Icono Google (SVG inline para rendimiento) */}
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
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
                    Ingresar con Gmail
                    <ArrowRight className="ml-auto w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </>
                )}
              </Button>

              {/* Etiqueta de acceso restringido */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-white px-3 text-slate-400">
                    Acceso Institucional
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ==================================================================
          SECCIÓN DERECHA: Imagen Inspiracional (Solo Desktop)
          Diseño: Imagen full-height con overlay oscuro y copy persuasivo
      ================================================================== */}
      <div className="hidden lg:block relative bg-slate-900">
        <Image
          src="/images/Innova.webp"
          alt="Laboratorio de Biomateriales"
          fill
          className="object-cover opacity-90"
          priority
        />
        {/* Degradado cinematográfico para mejorar legibilidad del texto blanco */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-16 text-white">
          {/* Línea decorativa de marca */}
          <div className="w-16 h-1 bg-green-500 mb-6 rounded-full" />

          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Donde la ciencia
            <br />
            encuentra la naturaleza
          </h2>

          <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
            Forma parte del repositorio vivo de conocimiento en biomateriales
            más grande de la universidad.
          </p>
        </div>
      </div>
    </div>
  );
}
