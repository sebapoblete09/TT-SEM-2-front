// src/actions/notifications.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { markNotificationReadService } from "@/services/notificationServices";
import { revalidatePath } from "next/cache";

export async function markAsReadAction(notificationId: string) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return { success: false };

  try {
    // 1. Llamar al backend
    await markNotificationReadService(notificationId, session.access_token);

    // 2. Revalidar rutas para actualizar contadores o estilos visuales
    revalidatePath("/profile");
    // Si tienes una campanita en el navbar que sale en todas las páginas:
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Action Error:", error);
    return { success: false };
  }
}
