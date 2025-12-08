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
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

// --- PASO 2: PROPIEDADES ---

// 1. Definimos las opciones
export const PROPERTY_OPTIONS = ["Baja", "Media", "Alta"] as const;

// 2. SOLUCIÓN AL ERROR DE TIPOS:
// Usamos z.string() vacío y validamos con .min() y .refine()
const optionSchema = z
  .string()
  // Esta línea valida que no esté vacío (cubre el "required")
  .min(1, { message: "Selecciona una opción válida" })
  // Esta línea valida que el valor sea uno de los permitidos
  .refine((val) => PROPERTY_OPTIONS.includes(val as any), {
    message: "Opción no válida",
  });

export const propertiesSchema = z.object({
  mecanicas: z.object({
    resistencia: optionSchema,
    dureza: optionSchema,
    elasticidad: optionSchema,
    ductilidad: optionSchema,
    fragilidad: optionSchema,
  }),
  perceptivas: z.object({
    color: z.string().min(3, "Describe el color"),
    brillo: z.string().min(3, "Describe el brillo"),
    textura: z.string().min(3, "Describe la textura"),
    transparencia: z.string().min(3, "Describe la transparencia"),
    sensacion_termica: z.string().min(3, "Describe la sensación"),
  }),
  emocionales: z.object({
    calidez_emocional: optionSchema,
    inspiracion: optionSchema,
    sostenibilidad_percibida: optionSchema,
    armonia: optionSchema,
    innovacion_emocional: optionSchema,
  }),
});

export type PropertiesFormValues = z.infer<typeof propertiesSchema>;

// --- PASO 3: COMPOSICIÓN QUÍMICA ---
export const compositionSchema = z.object({
  composicion: z
    .array(z.string())
    .min(1, "Debes agregar al menos un componente (ej: Agua, Glicerina)"),
});

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
});

// Esquema para el array de pasos
export const recipeSchema = z.object({
  recipeSteps: z
    .array(stepSchema)
    .min(1, "Debes agregar al menos un paso a la receta"),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;
