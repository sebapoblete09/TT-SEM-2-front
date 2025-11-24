// src/lib/hooks/useNotifications.ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // <--- Ajusta esta ruta a tu cliente de supabase
import { Notificacion } from "@/types/notification";

export const useNotifications = (userGoogleId: string | undefined) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userGoogleId) return;

    // 1. Cargar historial (últimas 10 no leídas o recientes)
    const fetchNotificaciones = async () => {
      const { data, error } = await supabase
        .from("notificaciones")
        .select("*")
        .eq("usuario_id", userGoogleId)
        .order("created_at", { ascending: false })
        .limit(15);

      if (!error && data) {
        setNotificaciones(data as Notificacion[]);
      }
      setLoading(false);
    };

    fetchNotificaciones();

    // 2. Suscribirse a Realtime (INSERT)
    // Esto escucha cuando Go crea una nueva fila
    const channel = supabase
      .channel("notificaciones-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notificaciones",
          filter: `usuario_id=eq.${userGoogleId}`, // ¡Clave! Solo escucha las de este usuario
        },
        (payload) => {
          console.log("🔔 Nueva notificación recibida:", payload.new);
          const nueva = payload.new as Notificacion;
          // Agregamos la nueva al principio del array
          setNotificaciones((prev) => [nueva, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userGoogleId, supabase]);

  // Función para marcar como leída
  const marcarComoLeida = async (id: string) => {
    // Optimistic update (actualizamos UI primero para que se sienta rápido)
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leido: true } : n))
    );

    // Actualizamos en BD
    await supabase.from("notificaciones").update({ leido: true }).eq("id", id);
  };

  // Contador de no leídas
  const unreadCount = notificaciones.filter((n) => !n.leido).length;

  return {
    notificaciones,
    loading,
    marcarComoLeida,
    unreadCount,
  };
};
