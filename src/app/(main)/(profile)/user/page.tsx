import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers"; // Para evitar caché estática

//importacion de tipos
import { usuario, estadisticas } from "@/types/user";
import { Material_Card, Material } from "@/types/materials";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import Materials_Profile from "@/components/profile/ProfileMaterials";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = createClient();

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
    <div className="container mx-auto max-w-full py-10 px-4">
      <div className="flex gap-10 p-5 m-auto justify-center">
        {/* --- SECCIÓN 1: PERFIL DE USUARIO --- */}
        {/* Componente 1: Muestra la info del usuario */}
        <div className="flex flex-col">
          <ProfileHeader usuario={usuario} userAvatar={userAvatar} />
          {usuario.rol === "administrador" ? (
            <div>
              <Button asChild size="lg" variant="secondary">
                <Link href="/admin">Panel de Administracion</Link>
              </Button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        {/* Componente 2: Muestra las estadísticas */}
        <ProfileStats estadisticas={estadisticas} />
        {/*Si es Admin, tendra acceso a un dashboard para aprobar */}
      </div>
      <hr className="my-8 " />

      <Materials_Profile initialMaterials={materiales_creados} />
    </div>
  );
}
