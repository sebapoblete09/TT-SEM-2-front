// app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server"; // ¡El cliente de SERVIDOR!
import { NextResponse } from "next/server";
// ✅ AÑADE ESTA LÍNEA
export const dynamic = "force-dynamic";

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
      const { user, access_token } = data.session;
      const googleIdentity = user.identities?.find(
        (i) => i.provider === "google"
      );
      const googleId = googleIdentity?.id || "";
      const nombre = user.user_metadata?.full_name || user.email?.split("@")[0];
      console.log(JSON.stringify(data.session, null, 2));
      console.log("Inicio de sesion exitoso");

      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
        const response = await fetch(`${baseUrl}/auth/register`, {
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
        }
      } catch (e) {
        console.error("Error de red llamando a backend Go:", e);
      }

      // Redirigir al usuario a la página principal
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // Redirigir a una página de error si no hay código
  return NextResponse.redirect(`${origin}/auth/error`);
}
