"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOutAction() {
  const supabase = await createClient();

  // 1. Cerrar sesión en Supabase (Limpia cookies en el servidor)
  await supabase.auth.signOut();

  // 2. Limpiar caché de toda la app (Layout principal)
  revalidatePath("/", "layout");
  return true;
}
