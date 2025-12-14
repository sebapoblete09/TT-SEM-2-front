"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getUserDataService } from "@/services/userServices"; // Asegúrate que la ruta sea correcta
import type { User as SupabaseUser } from "@supabase/supabase-js";

type DbUser = {
  nombre: string;
  email: string;
  rol: string;
};

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    // Función auxiliar para no repetir código y evitar el error
    const fetchAndSetDbUser = async (token: string) => {
      try {
        const data = await getUserDataService(token);
        // VALIDACIÓN CLAVE: Verificamos si viene dentro de "usuario" o directo
        if (data && data.usuario) {
          return data.usuario;
        } else {
          return data; // Por si acaso tu backend cambia y lo manda directo
        }
      } catch (err) {
        console.error("Error fetching db user:", err);
        return null;
      }
    };

    const initAuth = async () => {
      try {
        // 1. Obtener Sesión Actual
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          if (mounted) setUser(session.user);

          // 2. Traer datos del backend
          const dbData = await fetchAndSetDbUser(session.access_token);
          if (mounted) setDbUser(dbData);
        }
      } catch (error) {
        console.error("Error en initAuth:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // 3. Listener de cambios
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Solo actualizamos si el componente sigue montado
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          // AQUI ESTABA EL ERROR: Ahora usamos la misma lógica de extracción
          const dbData = await fetchAndSetDbUser(session.access_token);
          setDbUser(dbData);
        } else {
          setUser(null);
          setDbUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    user,
    dbUser,
    role: dbUser?.rol, // Ahora sí debería persistir
    loading,
  };
}
