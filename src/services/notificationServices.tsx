// src/services/notificationServices.ts
import { Notificacion } from "@/types/notification";

const BASE_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";

// GET: Obtener todas las notificaciones
export const getUserNotificationsService = async (access_token: string) => {
  const response = await fetch(`${BASE_URL}/notifications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store", // CRÍTICO: Para ver notificaciones nuevas al instante
  });

  if (!response.ok) return [];

  return response.json() as Promise<Notificacion[]>;
};

// PATCH: Marcar una como leída
export const markNotificationReadService = async (
  id: string,
  access_token: string
) => {
  const response = await fetch(`${BASE_URL}s/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al marcar como leída");
  }
};
