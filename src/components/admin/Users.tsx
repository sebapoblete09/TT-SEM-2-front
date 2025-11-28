import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { usuario } from "@/types/user";
import { UsersList } from "./UserList";

export default async function UsersSection() {
  const supabase = createClient();

  //Inicializar la session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    // Manejar error (ej. mostrar una página de error)
    return <p>Error al cargar la lista de usuarios</p>;
  }

  const data = await res.json();
  const users: usuario[] = data;
  const token = session.access_token;

  return <UsersList initialUsers={users} access_token={token} />;
}
