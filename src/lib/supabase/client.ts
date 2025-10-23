// lib/supabase/client.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Crea un cliente de Supabase PARA EL LADO DEL CLIENTE
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
