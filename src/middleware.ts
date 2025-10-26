// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Crea un cliente de Supabase solo para el middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Refresca la sesión
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- ¡AQUÍ ESTÁ LA LÓGICA DE PROTECCIÓN! ---

  // 1. Definnir rutas protegidas
  const protectedRoutes = [
    "/register-material",
    "/admin",
    "/pending-approval",
    // "/perfil",
  ];

  // 2. Comprueba si la ruta actual está en las rutas protegidas
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 3. Si no hay usuario Y es una ruta protegida -> Redirige a /login
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. (Opcional) Si hay usuario Y va a /login -> Redirige al inicio
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // --- FIN DE LA LÓGICA DE PROTECCIÓN ---

  return response;
}

//Rutas protegidas
export const config = {
  matcher: ["/register-material", "/admin", "/pending-approval"],
};
