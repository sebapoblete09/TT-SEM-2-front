// components/admin/UsersSection.tsx (o donde lo tengas)

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UsersList } from "./UserList";
import { getUsersService } from "@/services/userServices"; // Importamos el servicio
import { usuario } from "@/types/user";

export default async function UsersSection() {
  const supabase = await createClient();

  // 1. Auth Check
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // 2. Data Fetching (Usando el Service)
  let users: usuario[] = [];

  try {
    // Le pasamos el token seguro del servidor
    users = await getUsersService(session.access_token);
  } catch (error) {
    console.error(error);
    // Si falla, mostramos un mensaje visual
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md border border-red-200">
        Error al cargar la lista de usuarios. Intente más tarde.
      </div>
    );
  }

  // 3. Render
  return <UsersList initialUsers={users} />;
}
