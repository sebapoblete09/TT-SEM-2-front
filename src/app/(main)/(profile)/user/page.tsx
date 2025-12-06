/**
 * @file page.tsx
 * @description Página de Perfil de Usuario (Server Component).
 * Esta página es responsable de:
 * 1. Proteger la ruta (redirección si no hay sesión).
 * 2. Obtener los datos del usuario desde el Backend (Go) usando el token de Supabase.
 * 3. Formatear los datos para los componentes de presentación (UI).
 * 4. Renderizar la estructura del layout (Grid).
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

//importacion de tipos
import { usuario, estadisticas } from "@/types/user";
import { Material_Card, Material } from "@/types/materials";

// Componentes de UI
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import Materials_Profile from "@/components/profile/ProfileMaterials";

export default async function ProfilePage() {
  // 1. Inicialización del Cliente Supabase
  const supabase = await createClient();

  // 2. Verificación de Sesión (Seguridad)
  // Obtenemos la sesión actual para validar si el usuario está logueado.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si no hay sesión válida, protegemos la ruta redirigiendo al login.
  if (!session) {
    redirect("/login");
  }

  // Extraemos el avatar directamente de los metadatos de OAuth (Google)
  const userAvatar = session?.user?.user_metadata?.avatar_url;

  // Forzamos la lectura de headers para que esta página sea dinámica (Dynamic Rendering)
  // y no se genere estáticamente en tiempo de build.

  //Llamar al back para obtener el perfil del usaurio
  const baseUrl = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";

  const res = await fetch(`${baseUrl}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    // 'no-store': Asegura que siempre obtengamos los datos más recientes (sin caché).
    // Importante para ver cambios en tiempo real (ej: nuevo material creado).
    cache: "no-store",
  });

  if (!res.ok) {
    // Manejar error (ej. mostrar una página de error)
    return <p>Error al cargar el perfil. Intenta de nuevo.</p>;
  }

  // 4. Procesamiento de Datos
  const data = await res.json();

  // Desestructuramos la respuesta del backend
  const usuario: usuario = data.usuario;
  const estadisticas: estadisticas = data.estadisticas;

  // Transformación de Datos (Mapper):
  // Convertimos el objeto 'Material' completo del backend al tipo 'Material_Card'
  // más ligero que usa el componente de lista.
  const materiales_creados: Material_Card[] = data.materiales_creados.map(
    (material: Material) => {
      return {
        id: material.id,
        nombre: material.nombre,
        descripcion: material.descripcion,
        composicion: material.composicion, // La API ya lo da como string[]
        derivado_de: material.derivado_de,

        // Lógica clave para la imagen:
        // Usamos "optional chaining" (?.) para evitar errores si 'galeria' está vacío.
        // Obtenemos la url_imagen del primer (0) item, o un string vacío si no existe.
        primera_imagen_galeria: material.galeria?.[0]?.url_imagen || "",
        estado: material.estado,
      };
    }
  );

  const materiales_colaboraciones: Material_Card[] =
    data.materiales_colaborador?.map((material: Material) => {
      return {
        id: material.id,
        nombre: material.nombre,
        descripcion: material.descripcion,
        composicion: material.composicion, // La API ya lo da como string[]
        derivado_de: material.derivado_de,

        // Lógica clave para la imagen:
        // Usamos "optional chaining" (?.) para evitar errores si 'galeria' está vacío.
        // Obtenemos la url_imagen del primer (0) item, o un string vacío si no existe.
        primera_imagen_galeria: material.galeria?.[0]?.url_imagen || "",
        estado: material.estado,
      };
    });

  // 5. Renderizado del Layout
  return (
    <div className="container mx-auto max-w-7xl py-10 px-4 space-y-10">
      {/* --- GRID SUPERIOR (Header + Stats) --- */}
      {/* Usamos un Grid responsivo:
          - Móvil: 1 columna (se apilan)
          - Desktop (lg): 3 columnas (2 para info usuario, 1 para stats)
      */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Columna Izquierda (Info Principal) */}
        <div className="lg:col-span-2 h-full">
          {/* Asegúrate de que ProfileHeader tenga 'h-full' si es necesario, o que se adapte */}
          <ProfileHeader usuario={usuario} userAvatar={userAvatar} />
        </div>

        {/* Columna Derecha (Resumen Numérico) */}
        <div className="lg:col-span-1 h-full">
          <ProfileStats estadisticas={estadisticas} />
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR (Lista de Materiales) --- */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Lista de tarjetas filtrable */}
        <Materials_Profile
          initialMaterials={materiales_creados}
          colaboraciones={materiales_colaboraciones}
        />
      </div>
    </div>
  );
}
