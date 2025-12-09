const BASE_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";

/**------------------
 Funciones GET
---------------------*/

//OBTENER TODOS LOS DATOS DEL USUARIO AUTENTICADO
export const getUserDataService = async (access_token: string) => {
  const response = await fetch(`${BASE_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Error ${response.status}`);

  return response.json();
};

//OBTENER ESTADÍSTICAS DE USUARIOS (Para Admin)
export const getUsersStatsService = async (access_token: string) => {
  const respone = await fetch(`${BASE_URL}/users/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-store",
  });

  if (!respone.ok) {
    // Si falla, retornamos ceros para que no rompa la UI
    return { pendientes: 0, aprobados: 0, usuarios: 0 };
  }

  return respone.json();
};

//OBTENER USUARIOS (admin)

// Recibimos el token para autenticarnos con el Backend de Go
export const getUsersService = async (access_token: string) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    // cache: "no-store" es vital para admin, para ver cambios (bans, roles) al instante
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Error ${response.status}: No se pudieron obtener los usuarios`
    );
  }

  return response.json();
};

// OBTENER PERFIL PÚBLICO (Sin token)
export const getPublicUserProfileService = async (id: string) => {
  const response = await fetch(`${BASE_URL}/users/${id}/public`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    // Si es 404 u otro error, lanzamos excepción para manejarla en la página
    throw new Error(`Error ${response.status}: No se pudo cargar el perfil`);
  }

  return response.json();
};
