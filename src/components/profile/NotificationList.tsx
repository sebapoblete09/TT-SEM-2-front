"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth"; // Hook de Auth
import { useNotifications } from "@/lib/hooks/useNotification"; // Hook de Notificaciones
import { Notificacion } from "@/types/notification";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Info,
  BellOff,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Props opcionales (ya que el hook carga data, pero útil si haces SSR)
interface Props {
  initialNotifications?: Notificacion[];
}

export default function NotificationsList({ initialNotifications }: Props) {
  // 1. OBTENER USUARIO PARA EL HOOK
  const { user } = useAuth();
  // Extraemos el Google ID de las identidades (según tu estructura)
  const googleId = user?.identities?.find((i) => i.provider === "google")?.id;

  // 2. CONECTAR EL HOOK DE NOTIFICACIONES
  // Este hook se encarga de: Cargar, Escuchar cambios en Realtime y Marcar como leída
  const { notificaciones, loading, marcarComoLeida } =
    useNotifications(googleId);

  // Estados visuales locales
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const router = useRouter();

  // 3. EFECTO PARA MANEJAR DEEPLINKS (URL #hash)
  useEffect(() => {
    // Solo ejecutamos si ya cargaron las notificaciones para poder encontrar el ID
    if (typeof window !== "undefined" && notificaciones.length > 0) {
      const hash = decodeURIComponent(window.location.hash.substring(1));

      if (hash) {
        // Verificar si la notificación del hash existe en la lista cargada
        const targetNotification = notificaciones.find((n) => n.id === hash);

        if (targetNotification) {
          setHighlightedId(hash);
          setExpandedIds((prev) =>
            prev.includes(hash) ? prev : [...prev, hash]
          );

          const element = document.getElementById(hash);
          if (element) {
            setTimeout(() => {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
          }

          const timer = setTimeout(() => {
            setHighlightedId(null);
          }, 3000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [notificaciones]); // Dependencia clave: Ejecutar cuando lleguen los datos

  // Helpers visuales (Misma lógica visual)
  const getIcon = (tipo: string, titulo: string) => {
    if (tipo === "aprobado")
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (tipo === "rechazado")
      return <XCircle className="w-5 h-5 text-red-600" />;
    if (titulo === "Material Eliminado")
      return <Trash2 className="w-5 h-5 text-red-600" />;
    return <Info className="w-5 h-5 text-blue-600" />;
  };

  const getBgColor = (tipo: string, titulo: string) => {
    if (tipo === "aprobado") return "bg-green-50 border-green-100";
    if (tipo === "rechazado" || titulo === "Material Eliminado")
      return "bg-red-50 border-red-100";
    return "bg-blue-50 border-blue-100";
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 4. HANDLER UNIFICADO CON EL HOOK
  const handleInteraction = async (
    n: Notificacion,
    action: "navigate" | "markRead" | "expand"
  ) => {
    // Si la acción implica lectura, llamamos al hook
    if (!n.leido && (action === "navigate" || action === "markRead")) {
      await marcarComoLeida(n.id); // <--- ESTO ACTUALIZA LA BD Y EL NAVBAR AUTOMÁTICAMENTE
    }

    if (action === "navigate" && n.link) {
      if (n.tipo === "rechazado") {
        router.push(`/user?filter=pendientes&highlight=${n.material_id}`);
      } else {
        router.push(n.link);
      }
    } else if (action === "expand") {
      toggleExpand(n.id);
    }
  };

  // Renderizado de carga
  if (loading && notificaciones.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-12 w-full bg-slate-100 rounded-xl mb-2"></div>
          <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
          <span className="text-slate-400 text-sm mt-2">
            Cargando notificaciones...
          </span>
        </div>
      </div>
    );
  }

  // Renderizado vacío
  if (notificaciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 border-2 border-dashed rounded-xl bg-slate-50/50">
        <BellOff className="w-10 h-10 mb-2 opacity-20" />
        <p>No tienes notificaciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-20">
      {notificaciones.map((n) => {
        const isExpanded = expandedIds.includes(n.id);
        const isHighlighted = highlightedId === n.id;
        const isRejection = n.tipo === "rechazado";
        const isDeletion = n.titulo === "Material Eliminado";
        const isAlert = isRejection || isDeletion;

        return (
          <div
            id={n.id}
            key={n.id}
            className={cn(
              "relative p-4 rounded-xl border transition-all duration-300 group",
              n.leido
                ? "bg-white border-slate-100 opacity-70 hover:opacity-100"
                : "bg-white border-slate-200 shadow-sm border-l-4 border-l-blue-500",
              isHighlighted &&
                "ring-2 ring-blue-400 ring-offset-2 bg-blue-50/30 border-blue-300 shadow-md scale-[1.01] z-10 opacity-100"
            )}
          >
            <div className="flex gap-4 items-start">
              <div
                className={cn(
                  "p-2 rounded-full shrink-0 mt-0.5",
                  getBgColor(n.tipo, n.titulo)
                )}
              >
                {getIcon(n.tipo, n.titulo)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h4
                    className={cn(
                      "text-sm font-semibold truncate",
                      !n.leido && "text-slate-900"
                    )}
                  >
                    {n.titulo}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0 capitalize">
                    {format(new Date(n.created_at), "dd MMM, HH:mm", {
                      locale: es,
                    })}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {isAlert
                    ? isDeletion
                      ? "Este material ha sido eliminado permanentemente."
                      : "Tu material requiere correcciones."
                    : n.mensaje}
                </p>

                {/* ACORDEÓN DE DETALLES */}
                {isAlert && isExpanded && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-slate-700 animate-in slide-in-from-top-2 fade-in duration-300">
                    <p className="font-medium text-red-800 mb-1">
                      {isDeletion
                        ? "Detalles de la eliminación:"
                        : "Motivo del rechazo:"}
                    </p>
                    <p className="italic text-slate-600 bg-white/50 p-2 rounded border border-red-100/50">
                      {n.mensaje}
                    </p>

                    {isRejection && (
                      <div className="mt-3 flex justify-end">
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white text-xs gap-1 shadow-sm"
                          onClick={() => handleInteraction(n, "navigate")}
                        >
                          <Edit className="w-3 h-3" />
                          Ir a Corregir
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* BOTONES DE ACCIÓN */}
                <div className="flex gap-4 mt-3 items-center">
                  {(isAlert || n.link) && (
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-blue-600 gap-1 hover:no-underline hover:text-blue-800 font-medium"
                      onClick={() =>
                        isAlert
                          ? handleInteraction(n, "expand")
                          : handleInteraction(n, "navigate")
                      }
                    >
                      {isAlert ? (
                        <>
                          {isExpanded ? "Ocultar detalles" : "Ver detalles"}
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </>
                      ) : (
                        <>
                          Ver ahora <ExternalLink className="w-3 h-3" />
                        </>
                      )}
                    </Button>
                  )}

                  {!n.leido && (
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-slate-400 hover:no-underline hover:text-slate-600 transition-colors"
                      onClick={() => handleInteraction(n, "markRead")}
                    >
                      Marcar como leída
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
