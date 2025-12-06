import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers"; // Para evitar caché estática

//importacion de tipos
import { usuario, estadisticas } from "@/types/user";
import { Material_Card, Material } from "@/types/materials";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import Materials_Profile from "@/components/profile/ProfileMaterials";

export default async function ProfilePage() {
  const supabase = await createClient();

  //Inicializar la session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }
  const userAvatar = session?.user?.user_metadata?.avatar_url;

  // Para asegurar que la data se pida en cada visita y no se quede en caché
  const headersList = headers();

  //Llamar al back para obtener el perfil del usaurio
  const baseUrl = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    // Manejar error (ej. mostrar una página de error)
    return <p>Error al cargar el perfil. Intenta de nuevo.</p>;
  }

  // 3. OBTENER Y DESESTRUCTURAR EL JSON (¡Esta es tu respuesta!)
  // Le decimos a TypeScript qué forma tiene la data
  const data = await res.json();

  const usuario: usuario = data.usuario;
  const estadisticas: estadisticas = data.estadisticas;
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
  return (
    <div className="container mx-auto max-w-7xl py-10 px-4 space-y-10">
      {/* --- SECCIÓN 1: PERFIL DE USUARIO --- */}
      {/* SECCIÓN SUPERIOR: Banner + Stats en Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Columna Izquierda (2/3): Perfil Header */}
        <div className="lg:col-span-2 h-full">
          {/* Asegúrate de que ProfileHeader tenga 'h-full' si es necesario, o que se adapte */}
          <ProfileHeader usuario={usuario} userAvatar={userAvatar} />
        </div>

        {/* Columna Derecha (1/3): Stats Verticales */}
        <div className="lg:col-span-1 h-full">
          <ProfileStats estadisticas={estadisticas} />
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Materiales */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <Materials_Profile initialMaterials={materiales_creados} />
      </div>
    </div>
  );
}
