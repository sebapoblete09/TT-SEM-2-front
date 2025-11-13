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
  material_id: string;
  resistencia: string;
  dureza: string;
  elasticidad: string;
  ductilidad: string;
  fragilidad: string;
};

export type prop_perceptivas = {
  material_id: string;
  color: string;
  brillo: string;
  textura: string;
  transparencia: string;
  sensacion_termica: string;
};

export type prop_emocionales = {
  material_id: string;
  calidez_emocional: string;
  inspiracion: string;
  sostenibilidad_percibida: string;
  armonia: string;
  innovacion_emocional: string;
};

export type Material = {
  id: string; // uuid
  nombre: string;
  descripcion: string;
  herramientas: string[];
  composicion: string[];
  derivado_de: string;
  created_at: number;
  creado_en: string;
  actualizado_en: string;
  creador: creador;
  colaboradores: creador[];
  pasos: Paso[];
  galeria: galeriaItem[];
  prop_mecanicas: prop_mecanicas;
  prop_perceptivas: prop_perceptivas;
  prop_emocionales: prop_emocionales;
};

export type Material_Card = {
  id: string; // uuid
  nombre: string;
  descripcion: string;
  composicion: string[];
  derivado_de: string;
  primera_imagen_galeria: string;
};
