"use client";

import { useState, useEffect } from "react";
import { Notificacion } from "@/types/notification";
import { markAsReadAction } from "@/actions/notification";
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
  Edit,
  Trash2, // Icono para eliminación
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
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // 1. INICIALIZACIÓN INTELIGENTE:
  // Si la notificación es rechazo o eliminación, nace expandida
  const [expandedIds, setExpandedIds] = useState<string[]>(() =>
    initialData
      .filter(
        (n) => n.tipo === "rechazado" || n.titulo === "Material Eliminado"
      )
      .map((n) => n.id)
  );

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);

      if (hash) {
        setHighlightedId(hash);

        // Aseguramos que si vienes por link, se expanda (aunque ya debería estarlo por el state inicial)
        setExpandedIds((prev) =>
          prev.includes(hash) ? prev : [...prev, hash]
        );

        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        const timer = setTimeout(() => {
          setHighlightedId(null);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Helpers visuales
  const getIcon = (tipo: string, titulo: string) => {
    if (tipo === "aprobado")
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (tipo === "rechazado")
      return <XCircle className="w-5 h-5 text-red-600" />;
    if (titulo === "Material Eliminado")
      return <Trash2 className="w-5 h-5 text-red-600" />; // Icono específico
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

  const handleInteraction = async (
    n: Notificacion,
    action: "navigate" | "markRead" | "expand"
  ) => {
    if (!n.leido && (action === "navigate" || action === "markRead")) {
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, leido: true } : item))
      );
      await markAsReadAction(n.id);
    }

    if (action === "navigate" && n.link) {
      if (n.tipo === "rechazado") {
        router.push(`/user?filter=pendientes&highlight=${n.material_id}`);
      } else {
        router.push(n.link); // Para eliminación lleva a /user, para aprobado a /material/id
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
        const isHighlighted = highlightedId === n.id;

        // FLAGS DE TIPO
        const isRejection = n.tipo === "rechazado";
        const isDeletion = n.titulo === "Material Eliminado";

        // ¿Debe comportarse como una alerta expandible? (Caja roja con detalles)
        const isAlert = isRejection || isDeletion;

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
                  getBgColor(n.tipo, n.titulo)
                )}
              >
                {getIcon(n.tipo, n.titulo)}
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

                {/* Mensaje Principal (Resumen si es alerta, Completo si es normal) */}
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {isAlert
                    ? isDeletion
                      ? "Este material ha sido eliminado permanentemente."
                      : "Tu material requiere correcciones."
                    : n.mensaje}
                </p>

                {/* --- ACORDEÓN PARA ALERTAS (Rechazos y Eliminaciones) --- */}
                {isAlert && isExpanded && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-slate-700 animate-in slide-in-from-top-2">
                    <p className="font-medium text-red-800 mb-1">
                      {isDeletion
                        ? "Detalles de la eliminación:"
                        : "Motivo del rechazo:"}
                    </p>
                    {/* Aquí mostramos el mensaje completo del backend que contiene la razón */}
                    <p className="italic text-slate-600">{n.mensaje}</p>

                    {/* Botón de acción solo si es Rechazo (para ir a corregir) */}
                    {isRejection && (
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
                    )}
                  </div>
                )}

                {/* Botones de Acción / Toggle */}
                <div className="flex gap-4 mt-3">
                  {/* Botón Ver Detalles (Toggle) */}
                  {/* Mostramos el botón si es alerta O si tiene un link válido */}
                  {(isAlert || n.link) && (
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-blue-600 gap-1 hover:no-underline hover:text-blue-800"
                      onClick={() =>
                        isAlert
                          ? handleInteraction(n, "expand")
                          : handleInteraction(n, "navigate")
                      }
                    >
                      {isAlert ? (
                        <>
                          {isExpanded
                            ? "Ocultar detalles"
                            : "Ver motivo y detalles"}
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
