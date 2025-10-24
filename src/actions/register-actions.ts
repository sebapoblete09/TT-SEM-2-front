// app/(main)/register-material/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server"; // ¡Cliente de SERVIDOR!
import { revalidatePath } from "next/cache";

// Definimos los tipos de la respuesta
type ActionResult = {
  success: boolean;
  error?: string;
};

// Esta es la acción que se ejecutará en el servidor
export async function crearMaterialAction(
  formData: FormData
): Promise<ActionResult> {
  // 1. Obtener el cliente de Supabase y la sesión del usuario
  const supabase = createClient();
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  // 2. Validar que el usuario esté autenticado
  if (authError || !session) {
    return { success: false, error: "No autenticado" };
  }

  // 3. Obtener los datos de autenticación
  const token = session.access_token; // El "Pasaporte" 🛂

  const googleIdentity = session.user.identities?.find(
    (identity) => identity.provider === "google"
  );

  const googleId = googleIdentity?.id || ""; // El ID real del creador 👤

  // 4. Modificar el FormData: Sobrescribir el 'creador_id'
  // Usamos .set() para reemplazar el "1" que venía del cliente
  formData.set("creador_id", googleId);

  // 5. Llamar a tu backend de Go (de servidor a servidor)
  try {
    const response = await fetch("http://localhost:8080/materials", {
      method: "POST",
      headers: {
        // ¡Enviamos el token para la validación de seguridad!
        Authorization: `Bearer ${token}`,
        // NO establezcas 'Content-Type: multipart/form-data' manualmente.
        // fetch() lo hace automáticamente cuando el body es FormData.
      },
      body: formData, // Pasamos el FormData directamente
    });

    if (!response.ok) {
      // Si el backend de Go falla, capturamos el error
      const errText = await response.text();
      console.error("Error del backend de Go:", errText);
      return { success: false, error: `El backend de Go falló: ${errText}` };
    }

    // 6. Si todo sale bien
    revalidatePath("/"); // Opcional: refresca el caché de la página principal
    revalidatePath("/register-material"); // Limpia el caché de esta página
    return { success: true };
  } catch (error) {
    console.error("Error de red llamando a la acción:", error);
    return { success: false, error: (error as Error).message };
  }
}
