import { createClient } from "@/lib/supabase/client";

const BASE_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";

export const updateMaterialService = async (id: string, formData: FormData) => {
  const supabase = createClient();
  // 1. Obtener sesión
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("No hay sesión activa");
  }

  // 2. Petición PUT
  const response = await fetch(`${BASE_URL}/materials/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      // No Content-Type, FormData lo pone solo
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar material");
  }

  return response.json();
};
