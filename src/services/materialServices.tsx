import { access } from "fs";

const BASE_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";

/**------------------
 Funciones GET
---------------------*/

//OBTENER TODOS LOS MATERIALES (Admin)
export const getAllMaterialsService = async () => {
  const response = await fetch(`${BASE_URL}/materials`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Error ${response.status}`);
  return response.json();
};

//OBTENER TODOS LOS MATERIALES (Resumen) para las cards
export const getMaterialsService = async () => {
  const response = await fetch(`${BASE_URL}/materials-summary`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Error ${response.status}`);

  return response.json();
};

//OBTENER UN MATERIAL POR ID (Detalle)
export const getMaterialByIdService = async (id: string) => {
  const response = await fetch(`${BASE_URL}/materials/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Error ${response.status}`);

  return response.json();
};

//OBTENER LOS MATERIALES PENDIENTES
export const getPendingMaterialsService = async (access_token: string) => {
  const response = await fetch(`${BASE_URL}/materials/pending`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Error fetching pending materials");
    return { materiales: [] };
  }

  return response.json();
};

//OBTENER MATERIALES DERIVADOS DE OTRO
export const getDerivedMaterialsService = async (parentId: string) => {
  const response = await fetch(`${BASE_URL}/materials/${parentId}/derived`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Error ${response.status}`);
  const data = await response.json();
  return data.filter((m: any) => m.estado === true);
};

//// Obtener las listas para llenar el sidebar (Herramientas y Composición)
export const getFilterServices = async () => {
  const response = await fetch(`${BASE_URL}/materials/filters`, {
    method: "GET",
    cache: "force-cache",
  });
  if (!response.ok) throw new Error("Error cargando opciones de filtro");
  return response.json();
};

/**------------------
 Funciones POST
---------------------*/
// services/materialServices.ts

//REGISTRAR MATERIAL
export const createMaterialService = async (
  formData: FormData,
  token: string
) => {
  const response = await fetch(`${BASE_URL}/materials`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al registrar el material");
  }

  return response.json();
};

//APROBAR MATERIAL
export const approveMaterialService = async (
  access_token: string,
  id: string
) => {
  const response = await fetch(`${BASE_URL}/materials/${id}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al aprobar material");
  }

  return response.json();
};

//RECHAZAR MATERIAL
export const rejectedMaterialService = async (
  access_token: string,
  id: string,
  reason: string
) => {
  const response = await fetch(`${BASE_URL}/materials/${id}/reject`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al aprobar material");
  }

  return response.json();
};

/**------------------
 Funciones PUT
---------------------*/
//Actualizar material
export const updateMaterialService = async (
  id: string,
  formData: FormData,
  access_token: string
) => {
  // 2. Petición PUT
  const response = await fetch(`${BASE_URL}/materials/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar material");
  }

  return response.json();
};
