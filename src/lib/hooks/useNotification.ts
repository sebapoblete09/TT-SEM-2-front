// src/lib/hooks/useNotifications.ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Notificacion } from "@/types/notification";

export const useNotifications = (userGoogleId: string | undefined) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userGoogleId) return;

    // 1. Carga inicial
    const fetchNotificaciones = async () => {
      const { data, error } = await supabase
        .from("notificaciones")
        .select("*")
        .eq("usuario_id", userGoogleId)
        .order("created_at", { ascending: false })
        .limit(20); // Aumenté un poco el límite

      if (!error && data) {
        setNotificaciones(data as Notificacion[]);
      }
      setLoading(false);
    };

    fetchNotificaciones();

    // 2. Suscripción Realtime (INSERT y UPDATE)
    const channel = supabase
      .channel("notificaciones-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // <--- CAMBIO: Escuchamos TODO (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "notificaciones",
          filter: `usuario_id=eq.${userGoogleId}`,
        },
        (payload) => {
          // CASO 1: Nueva notificación
          if (payload.eventType === "INSERT") {
            setNotificaciones((prev) => [payload.new as Notificacion, ...prev]);
          }
          // CASO 2: Actualización (ej: Se marcó como leída en otro lado)
          else if (payload.eventType === "UPDATE") {
            setNotificaciones((prev) =>
              prev.map((n) =>
                n.id === payload.new.id ? (payload.new as Notificacion) : n
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userGoogleId, supabase]);

  // Función para marcar como leída
  const marcarComoLeida = async (id: string) => {
    // 1. Optimistic Update Local (Para que se sienta instantáneo en este componente)
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leido: true } : n))
    );

    // 2. Update en BD (Esto disparará el evento UPDATE de arriba para el Navbar)
    await supabase.from("notificaciones").update({ leido: true }).eq("id", id);
  };

  const unreadCount = notificaciones.filter((n) => !n.leido).length;

  return {
    notificaciones,
    loading,
    marcarComoLeida,
    unreadCount,
  };
};
