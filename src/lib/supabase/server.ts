// lib/supabase/server.ts

// ¡ELIMINA LA LÍNEA "use server"; DE AQUÍ!

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  // Crea un cliente de Supabase PARA EL LADO DEL SERVIDOR
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (cookieStore as any).get(name)?.value;
          } catch (error) {
            return undefined;
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (cookieStore as any).set({ name, value, ...options });
          } catch (error) {
            // Ocurre si se llama desde un Server Component estático
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (cookieStore as any).set({ name, value: "", ...options });
          } catch (error) {
            // Ocurre si se llama desde un Server Component estático
          }
        },
      },
    }
  );
}
