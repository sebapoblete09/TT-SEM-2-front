"use client";

import { useState, useEffect } from "react";
import { Notificacion } from "@/types/notification";
import { markAsReadAction } from "@/actions/notification"; // Asegúrate de la ruta correcta
import { useRouter } from "next/navigation";
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
  Edit, // Icono para corregir
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  notifications: Notificacion[];
}

export default function NotificationsList({
  notifications: initialData,
}: Props) {
  const [notifications, setNotifications] = useState(initialData);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1); // Quitamos el '#'

      if (hash) {
        setHighlightedId(hash); // 1. Activamos el resaltado

        // Auto-expandir si es rechazo (tu lógica existente)
        const notif = notifications.find((n) => n.id === hash);
        if (notif && notif.tipo === "rechazado") {
          setExpandedIds((prev) => [...prev, hash]);
        }

        // Scroll suave
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        // 2. TEMPORIZADOR PARA APAGAR EL EFECTO (3 segundos)
        const timer = setTimeout(() => {
          setHighlightedId(null);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, []); // Dependencias vacías para que corra solo al montar (navegación inicial)

  const getIcon = (tipo: string) => {
    if (tipo === "aprobado")
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (tipo === "rechazo") return <XCircle className="w-5 h-5 text-red-600" />;
    return <Info className="w-5 h-5 text-blue-600" />;
  };

  const getBgColor = (tipo: string) => {
    if (tipo === "aprobado") return "bg-green-50 border-green-100";
    if (tipo === "rechazo") return "bg-red-50 border-red-100";
    return "bg-blue-50 border-blue-100";
  };

  // Manejar expansión del acordeón
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleInteraction = async (
    n: Notificacion,
    action: "navigate" | "markRead" | "expand"
  ) => {
    // 1. Marcar como leído si no lo está (para cualquier interacción relevante)
    if (!n.leido && (action === "navigate" || action === "markRead")) {
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, leido: true } : item))
      );
      await markAsReadAction(n.id);
    }

    // 2. Lógica según acción
    if (action === "navigate" && n.link) {
      // Si es rechazo, redirigimos a /user (asumiendo que ahí están los pendientes)
      // Podrías necesitar un query param ej: router.push('/user?tab=pending');
      if (n.tipo === "rechazado") {
        router.push(`/user?filter=pendientes&highlight=${n.material_id}`);
      } else {
        router.push(n.link);
      }
    } else if (action === "expand") {
      toggleExpand(n.id);
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 border-2 border-dashed rounded-xl bg-slate-50/50">
        <BellOff className="w-10 h-10 mb-2 opacity-20" />
        <p>No tienes notificaciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => {
        const isExpanded = expandedIds.includes(n.id);
        const isRejection = n.tipo === "rechazado";
        const isHighlighted = highlightedId === n.id;

        return (
          <div
            id={n.id}
            key={n.id}
            className={cn(
              "relative p-4 rounded-xl border transition-all duration-200 group",
              n.leido
                ? "bg-white border-slate-100 opacity-80 hover:opacity-100"
                : "bg-white border-slate-200 shadow-sm border-l-4 border-l-blue-500",
              isHighlighted &&
                "ring-2 ring-blue-400 ring-offset-2 bg-blue-50/30 border-blue-300 shadow-md scale-[1.01]"
            )}
          >
            <div className="flex gap-4 items-start">
              {/* Icono */}
              <div
                className={cn(
                  "p-2 rounded-full shrink-0 mt-0.5",
                  getBgColor(n.tipo)
                )}
              >
                {getIcon(n.tipo)}
              </div>

              {/* Contenido Principal */}
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

                {/* Mensaje (Resumen o Completo según tipo) */}
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {/* Si es rechazo, mostramos solo un resumen inicial o el título, el detalle va en el acordeón */}
                  {isRejection
                    ? "Tu material requiere correcciones. Revisa los detalles."
                    : n.mensaje}
                </p>

                {/* --- ACORDEÓN PARA RECHAZOS --- */}
                {isRejection && isExpanded && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-slate-700 animate-in slide-in-from-top-2">
                    <p className="font-medium text-red-800 mb-1">
                      Motivo del rechazo:
                    </p>
                    <p className="italic text-slate-600">{n.mensaje}</p>{" "}
                    {/* Aquí asumimos que n.mensaje tiene el motivo */}
                    <div className="mt-3 flex justify-end">
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white text-xs gap-1"
                        onClick={() => handleInteraction(n, "navigate")}
                      >
                        <Edit className="w-3 h-3" />
                        Ir a Corregir Material
                      </Button>
                    </div>
                  </div>
                )}

                {/* Botones de Acción Principales */}
                <div className="flex gap-4 mt-3">
                  {/* Botón Ver Detalles */}
                  {n.link && (
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-blue-600 gap-1 hover:no-underline hover:text-blue-800"
                      onClick={() =>
                        isRejection
                          ? handleInteraction(n, "expand")
                          : handleInteraction(n, "navigate")
                      }
                    >
                      {isRejection ? (
                        <>
                          {isExpanded
                            ? "Ocultar detalles"
                            : "Ver motivo rechazo"}
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </>
                      ) : (
                        <>
                          Ver detalles <ExternalLink className="w-3 h-3" />
                        </>
                      )}
                    </Button>
                  )}

                  {/* Botón Marcar Leído */}
                  {!n.leido && (
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-slate-400 hover:no-underline hover:text-slate-600"
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
