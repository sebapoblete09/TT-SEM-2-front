// src/types/notification.ts
export interface Notificacion {
  id: string;
  created_at: string;
  usuario_id: string;
  titulo: string;
  mensaje: string;
  leido: boolean;
  tipo: "aprobado" | "rechazado" | "info" | "success" | "eliminado";
  material_id?: string;
  link?: string;
}
