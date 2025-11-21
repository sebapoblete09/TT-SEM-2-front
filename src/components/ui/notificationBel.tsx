// src/components/ui/NotificationBell.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Info, XCircle, CheckCircle } from "lucide-react";
import { useNotifications } from "@/lib/hooks/useNotification";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  googleId: string; // Necesitamos pasarle el ID del usuario logueado
}

export default function NotificationBell({ googleId }: Props) {
  const { notificaciones, unreadCount, marcarComoLeida } =
    useNotifications(googleId);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper para iconos según tipo
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "aprobado":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rechazado":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón Campana */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell
          className={`w-6 h-6 ${
            unreadCount > 0 ? "text-gray-800" : "text-gray-500"
          }`}
        />

        {/* Badge Rojo */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Notificaciones</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {unreadCount} nuevas
              </span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notificaciones.length === 0 ? (
              <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                <Bell className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">No tienes notificaciones</p>
              </div>
            ) : (
              <ul>
                {notificaciones.map((notif) => (
                  <li
                    key={notif.id}
                    className={`p-4 border-b last:border-0 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notif.leido ? "bg-blue-50/50" : ""
                    }`}
                    onClick={() => marcarComoLeida(notif.id)}
                  >
                    <div className="flex gap-3">
                      <div className="mt-1 flex-shrink-0">
                        {getIcon(notif.tipo)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <p
                            className={`text-sm ${
                              !notif.leido
                                ? "font-bold text-gray-900"
                                : "font-medium text-gray-700"
                            }`}
                          >
                            {notif.titulo}
                          </p>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                            {formatDistanceToNow(new Date(notif.created_at), {
                              addSuffix: true,
                              locale: es,
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-snug">
                          {notif.mensaje}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
