// app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server"; // ¡El cliente de SERVIDOR!
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Si hay un error, redirigir a una página de error
  const error = searchParams.get("error");
  if (error) {
    return NextResponse.redirect(`${origin}/auth/error`);
  }

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // *** ¡AQUÍ ESTÁ LA MAGIA! ***
      // En este punto, el usuario está autenticado en Supabase
      // y la cookie httpOnly está guardada.
      // Ahora, registramos en nuestro backend de Go.

      const { user, access_token } = data.session;
      const googleIdentity = user.identities?.find(
        (i) => i.provider === "google"
      );
      const googleId = googleIdentity?.id || "";
      const nombre = user.user_metadata?.full_name || user.email?.split("@")[0];

      console.log("---------- SESIÓN COMPLETA ----------");
      // 1. Muestra el objeto de sesión entero
      console.log(JSON.stringify(data.session, null, 2));

      console.log("\n---------- DATOS DEL USUARIO (session.user) ----------");
      // 2. Muestra solo el objeto 'user'
      console.log(JSON.stringify(data.session.user, null, 2));

      console.log("\n---------- DATOS ESPECÍFICOS ----------");
      console.log("Email:", user.email);
      console.log("Nombre:", user.user_metadata?.full_name);
      console.log("ID de Google (googleIdentity.id):", googleIdentity?.id);
      console.log(
        "Access Token (largo):",
        data.session.access_token.length,
        "caracteres"
      );

      try {
        const response = await fetch("http://localhost:8080/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: access_token, // Token de Supabase
            google_id: googleId,
            nombre: nombre,
            email: user.email,
          }),
        });

        if (!response.ok) {
          // Manejar error del backend de Go
          console.error(
            "Error registrando en backend Go:",
            await response.text()
          );
          // Podrías redirigir a una página de error
        }
      } catch (e) {
        console.error("Error de red llamando a backend Go:", e);
      }

      // Redirigir al usuario a la página principal o dashboard
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // Redirigir a una página de error si no hay código
  return NextResponse.redirect(`${origin}/auth/error`);
}
