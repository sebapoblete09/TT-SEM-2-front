export type usuario = {
  id?: number;
  google_id?: number;
  email?: string;
  nombre?: string;
  rol?: string;
};

export type estadisticas = {
  colaboraciones?: number;
  materiales_aprobados?: number;
  materiales_creados?: number;
  materiales_pendientes?: number;
  total_materiales?: number;
};
