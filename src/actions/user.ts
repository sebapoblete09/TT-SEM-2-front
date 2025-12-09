// app/actions/users.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRoleAction(userId: number, newRole: string) {
  const supabase = await createClient();

  // 1. Obtenemos la sesión fresca directamente de las cookies
  // No necesitamos pasar nada por parámetro
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No autorizado: No hay sesión activa");
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";

  // 2. Hacemos la llamada a tu Backend en GO desde el servidor de Next.js
  const res = await fetch(`${baseUrl}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // Usamos el token de la sesión actual (siempre fresco)
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ rol: newRole }),
  });

  if (!res.ok) {
    console.error("Error en backend Go:", await res.text());
    throw new Error("Error al actualizar el rol en el servidor");
  }

  // 3. Importante: Le decimos a Next.js que los datos han cambiado
  // Esto hará que tu componente UsersSection se vuelva a ejecutar y traiga la lista actualizada
  revalidatePath("/admin/users"); // Ajusta esta ruta a donde esté tu página

  return { success: true };
}
