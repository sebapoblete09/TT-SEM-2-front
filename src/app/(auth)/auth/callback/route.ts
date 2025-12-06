// app/auth/callback/route.ts

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// ⚠️ CRÍTICO: Forzamos que esta ruta sea dinámica.
// Next.js intenta cachear rutas GET por defecto. Como esta ruta depende de
// parámetros URL únicos (?code=...) y cookies, debe ser dinámica para evitar errores.
export const dynamic = "force-dynamic";

/**
 * Manejador de la redirección (Callback) de OAuth.
 *
 * Flujo principal:
 * 1. Recibe el `code` temporal de Google.
 * 2. Lo intercambia por una Sesión de Supabase (Access/Refresh Tokens).
 * 3. Sincroniza los datos del usuario con nuestro Backend propio (Go).
 * 4. Redirige al usuario a la página de inicio o a error.
 */

export async function GET(request: Request) {
  // 1. Extracción de parámetros de la URL
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Si el proveedor (Google) devuelve un error, abortamos el flujo.
  if (error) {
    return NextResponse.redirect(`${origin}/auth/error`);
  }

  if (code) {
    // 2. Inicialización del cliente Supabase (Contexto Servidor)
    const supabase = await createClient();

    // 3. Intercambio de Código por Sesión
    // Esta función valida el código con Supabase y, si es válido,
    // SETEA AUTOMÁTICAMENTE las cookies de sesión en el navegador del usuario.
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const { user, access_token } = data.session;

      // 4. Preparación de datos para el Backend
      // Buscamos específicamente el ID de Google dentro de las identidades del usuario.
      const googleIdentity = user.identities?.find(
        (i) => i.provider === "google"
      );
      const googleId = googleIdentity?.id || "";

      // Fallback para el nombre: Si no viene en metadata, usamos la parte local del email.
      const nombre = user.user_metadata?.full_name || user.email?.split("@")[0];
      console.log(JSON.stringify(data.session, null, 2));
      console.log(
        "✅ Inicio de sesión exitoso en Supabase. Sincronizando con Backend..."
      );

      // 5. Sincronización con Backend
      // Registramos o actualizamos el usuario en nuestra base de datos propia.
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
        const response = await fetch(`${baseUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: access_token, // Enviamos el token para que el Backend pueda validarlo
            google_id: googleId,
            nombre: nombre,
            email: user.email,
          }),
        });

        if (!response.ok) {
          // Logueamos el error pero NO bloqueamos el acceso al usuario.
          // Estrategia "Fail Open": Si nuestro backend falla, el usuario aún puede entrar
          // porque ya tiene sesión en Supabase (aunque su perfil local podría no estar actualizado).
          const errorText = await response.text();
          console.error("⚠️ Error registrando en backend Go:", errorText);
        } else {
          console.log("✅ Usuario sincronizado correctamente con Backend Go.");
        }
      } catch (e) {
        console.error("❌ Error de red crítico llamando a backend Go:", e);
      }

      // 6. Redirección Final (Éxito)
      // El usuario ya tiene cookies de sesión y fue procesado.
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // 7. Fallback de Error
  // Si no hubo código o falló el intercambio de sesión.
  return NextResponse.redirect(`${origin}/auth/error`);
}
