"use server";

import { createClient } from "@/lib/supabase/server";
import {
  updateMaterialService,
  approveMaterialService,
  rejectedMaterialService,
  createMaterialService,
} from "@/services/materialServices"; // Ajusta la ruta si es necesario
import { revalidatePath } from "next/cache";

//CREAR MATERIAL
export async function createMaterialAction(formData: FormData) {
  const supabase = await createClient();

  // 1. Obtener sesión del servidor
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, message: "No hay sesión activa. Inicia sesión." };
  }

  try {
    // 2. SEGURIDAD: Sobrescribir el creador_id con el de la sesión real
    // Esto evita que un usuario malintencionado mande el ID de otro.
    formData.delete("creador_id"); // Borramos si venía del cliente
    formData.append("creador_id", JSON.stringify(session.user.id));

    // 3. Llamar al servicio
    await createMaterialService(formData, session.access_token);

    // 4. Revalidar rutas afectadas
    revalidatePath("/materials"); // Catálogo
    revalidatePath("/profile"); // Perfil del usuario
    revalidatePath("/admin"); // Panel de administración (pendientes)

    return { success: true, message: "Material registrado exitosamente" };
  } catch (error) {
    console.error("Error en createMaterialAction:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error al crear material",
    };
  }
}

//ACTUALIZAR MATERIAL
export async function updateMaterialAction(id: string, formData: FormData) {
  // 1. INICIALIZAR SUPABASE Y OBTENER SESIÓN
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 2. VALIDACIÓN DE SEGURIDAD
  if (!session) {
    return {
      success: false,
      message: "No tienes permiso para realizar esta acción.",
    };
  }

  try {
    // 3. LLAMADA AL SERVICIO (Service)
    // Aquí pasamos el token seguro del servidor al servicio
    await updateMaterialService(id, formData, session.access_token);

    // 4. REVALIDACIÓN DE CACHÉ (Refresh de datos)
    // Esto es clave: le dice a Next.js que borre el caché de estas rutas
    // para que el usuario vea los cambios inmediatamente.

    revalidatePath("/materials"); // Catálogo público
    revalidatePath(`/material/${id}`); // Ficha técnica del material editado
    revalidatePath("/profile"); // Perfil del usuario (donde gestiona sus materiales)

    return { success: true, message: "Material actualizado correctamente" };
  } catch (error) {
    console.error("Error en updateMaterialAction:", error);

    // Retornamos un objeto de error controlado para que el frontend lo muestre
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al actualizar el material",
    };
  }
}

//APROBAR MATERIAL
export async function approveMaterialAction(id: string) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 1. Validación
  if (!session) {
    return { success: false, message: "No autorizado" };
  }

  try {
    // 2. Llamada al servicio
    await approveMaterialService(session.access_token, id);

    // 3. Revalidación (CRÍTICO)
    // Esto hace que Next.js actualice las listas en el servidor.
    // Al aprobar, el material debe salir de "Pendientes" y aparecer en "Aprobados".
    revalidatePath("/admin"); // Actualiza todo el panel admin
    revalidatePath("/materials"); // Actualiza el catálogo público

    return { success: true, message: "Material aprobado correctamente" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

//RECHAZAR MATERIAL
export async function rejectedMaterialAction(id: string, reason: string) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 1. Validación
  if (!session) {
    return { success: false, message: "No autorizado" };
  }

  try {
    // 2. Llamada al servicio
    await rejectedMaterialService(session.access_token, id, reason);

    // 3. Revalidación (CRÍTICO)
    // Esto hace que Next.js actualice las listas en el servidor.
    // Al aprobar, el material debe salir de "Pendientes" y aparecer en "Aprobados".
    revalidatePath("/admin"); // Actualiza todo el panel admin
    revalidatePath("/materials"); // Actualiza el catálogo público
    revalidatePath("/profile");

    return { success: true, message: "Material rechazado correctamente" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
