import * as z from "zod";

// --- PASO 1: INFORMACIÓN BÁSICA ---
export const basicInfoSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100),
  descripcion: z.string().min(10, "Mínimo 10 caracteres").max(500),
  derivadoDe: z.string().optional(),
  imagenes: z.array(z.any()).min(1, "Debes subir al menos una imagen"),
  herramientas: z.array(z.string()).min(1, "Agrega al menos una herramienta"),
  colaboradores: z.array(z.string()).optional(),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

// --- PASO 2: PROPIEDADES ---

// 1. Schema para Propiedades Mecánicas (Numérico + Unidad)
const mecanicaItemSchema = z.object({
  nombre: z.string().min(1, "El nombre de la propiedad es requerido"),

  // CAMBIO: Ahora es string. Quitamos coerce.number()
  valor: z.string().min(1, "El valor es requerido"),

  unidad: z
    .string()
    .optional()
    .transform((val) => (val === "" || val === undefined ? "n/a" : val)),
});

// 2. Schema para Propiedades de Texto (Perceptivas y Emocionales)
const textPropertyItemSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  valor: z.string().min(1, "El valor es requerido"),
});

// 3. Schema Principal de Propiedades
export const propertiesSchema = z.object({
  // Inicializamos como arrays vacíos por defecto
  mecanicas: z.array(mecanicaItemSchema).default([]),
  perceptivas: z.array(textPropertyItemSchema).default([]),
  emocionales: z.array(textPropertyItemSchema).default([]),
});

export type PropertiesFormValues = z.infer<typeof propertiesSchema>;

// --- PASO 3: COMPOSICIÓN QUÍMICA ---

// Definimos el esquema de un solo ítem
const compositionItemSchema = z.object({
  elemento: z.string().min(1, "El nombre del elemento es requerido"),
  cantidad: z.string().min(1, "La cantidad es requerida").or(z.literal("")), // Opcional: permite vacío si prefieres
});

export const compositionSchema = z.object({
  composicion: z
    .array(compositionItemSchema)
    .min(1, "Debes agregar al menos un componente a la lista"),
});

// Tipos inferidos
export type CompositionFormValues = z.infer<typeof compositionSchema>;

// --- PASO 4: RECETA ---

// Esquema para un solo paso
const stepSchema = z.object({
  id: z.number(), // ID interno para React keys
  orden_paso: z.number(),
  descripcion: z
    .string()
    .min(10, "La descripción del paso es muy corta (mínimo 10 caracteres)"),
  // Los archivos se validan como 'any' u 'optional' porque son Files del navegador
  url_imagen: z.any().optional().nullable(),
  url_video: z.any().optional().nullable(),
  newFile: z.any().optional(),
});

// Esquema para el array de pasos
export const recipeSchema = z.object({
  recipeSteps: z
    .array(stepSchema)
    .min(1, "Debes agregar al menos un paso a la receta"),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;

export const editMaterialSchema = z.object({
  // 1. Básicos (Mergeamos los campos, pero hacemos imágenes opcionales para edición)
  nombre: basicInfoSchema.shape.nombre,
  descripcion: basicInfoSchema.shape.descripcion,
  derivadoDe: basicInfoSchema.shape.derivadoDe,
  herramientas: basicInfoSchema.shape.herramientas,

  // En edición, las imágenes ya existen en el backend.
  // Validamos solo si el usuario intenta subir algo inválido, o lo dejamos opcional.
  imagenes: z.any().optional(),

  // 2. Propiedades (Anidamos tal cual tu propertiesSchema)
  // Nota: Zod object merge no funciona profundo fácilmente, mejor definirlos explícitamente si la estructura coincide
  mecanicas: propertiesSchema.shape.mecanicas,
  perceptivas: propertiesSchema.shape.perceptivas,
  emocionales: propertiesSchema.shape.emocionales,

  // 3. Composición
  composicion: compositionSchema.shape.composicion,

  // 4. Pasos (Mapeamos 'recipeSteps' a 'pasos' si prefieres mantener consistencia con BD)
  pasos: recipeSchema.shape.recipeSteps,

  galeria: z
    .array(
      z.object({
        id: z.number(), // O z.string() si tu ID es UUID
        url_imagen: z.string(),
        caption: z.string().optional().nullable(),
      })
    )
    .optional(),

  // 2. Campo temporal para los archivos nuevos que subas
  // Usamos z.any() porque 'File[]' no es validable nativamente por Zod de forma sencilla
  newGalleryFiles: z.any().optional(),
});

export type EditMaterialFormValues = z.infer<typeof editMaterialSchema>;

// --- SCHEMA UNIFICADO PARA REGISTRO ---

// --- SCHEMA PRINCIPAL UNIFICADO ---
export const registerMaterialSchema = z.object({
  // Spread de todos los schemas
  ...basicInfoSchema.shape,
  ...propertiesSchema.shape,
  ...compositionSchema.shape,

  // Pasos unificados
  recipeSteps: z.array(stepSchema).min(1, "Agrega al menos un paso"),
});

export type RegisterMaterialFormValues = z.infer<typeof registerMaterialSchema>;
