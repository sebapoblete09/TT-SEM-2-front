// Placeholder para el tipo Creador/Colaborador
export type creador = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Supabase_id: string;
  google_id: string;
  nombre: string;
  email: string;
  rol: string;
};

export type Paso = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  material_id: string;
  orden_paso: number;
  descripcion: string;
  url_imagen: string;
  url_video: string;
};

export type galeriaItem = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  material_id: string;
  url_imagen: string;
  caption: string;
};

export type prop_mecanicas = {
  valor: string;
  nombre: string;
  unidad: string;
};

export type prop_perceptivas = {
  valor: string;
  nombre: string;
};

export type prop_emocionales = {
  valor: string;
  nombre: string;
};

export type composicion = {
  cantidad: string;
  elemento: string;
};

export type Material = {
  id: string; // uuid
  nombre: string;
  descripcion: string;
  herramientas: string[];
  composicion: composicion[];
  derivado_de: string;
  created_at: number;
  creado_en: string;
  actualizado_en: string;
  creador: creador;
  colaboradores: creador[];
  pasos: Paso[];
  galeria: galeriaItem[];
  prop_mecanicas: prop_mecanicas[];
  prop_perceptivas: prop_perceptivas[];
  prop_emocionales: prop_emocionales[];
  estado: boolean;
};

export type Material_Card = {
  id: string;
  nombre: string;
  descripcion: string;
  composicion: composicion[];
  derivado_de: string;
  herramientas: string[];
  primera_imagen_galeria?: string;
  estado?: boolean;
};

export type BasicInfoData = {
  nombre: string;
  descripcion: string;
  herramientas: string[];
  derivadoDe: string;
  colaboradores: string[];
  imagenes: File[];
};
