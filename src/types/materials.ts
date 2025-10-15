// Placeholder para el tipo Creador/Colaborador
export type Creador = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  google_id: string;
  nombre: string;
  email: string;
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

export type GaleriaItem = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  material_id: string;
  url_imagen: string;
  caption: string;
};

export type PropiedadesMecanicas = {
  material_id: string;
  resistencia: string;
  dureza: string;
  elasticidad: string;
  ductilidad: string;
  fragilidad: string;
};

export type PropiedadesPerceptivas = {
  material_id: string;
  color: string;
  brillo: string;
  textura: string;
  transparencia: string;
  sensacion_termica: string;
};

export type PropiedadesEmocionales = {
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
  creador_id: number;
  creado_en: string;
  actualizado_en: string;
  Creador: Creador;
  Colaboradores: Creador[];
  Pasos: Paso[];
  Galeria: GaleriaItem[];
  PropiedadesMecanicas: PropiedadesMecanicas;
  PropiedadesPerceptivas: PropiedadesPerceptivas;
  PropiedadesEmocionales: PropiedadesEmocionales;
};

export type Material_Card = {
  id: string; // uuid
  nombre: string;
  descripcion: string;
  composicion: string[];
  derivado_de: string;
  primera_imagen_galeria: string;
};
