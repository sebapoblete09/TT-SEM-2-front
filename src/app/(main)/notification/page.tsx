import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserNotificationsService } from "@/services/notificationServices";
import NotificationsList from "@/components/profile/NotificationList";
import { Bell } from "lucide-react";

export const metadata = {
  title: "Notificaciones | Panel",
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const notificaciones = await getUserNotificationsService(
    session.access_token
  );

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Encabezado limpio */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-10 w-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
            <Bell className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Centro de Novedades
            </h1>
            <p className="text-slate-500 text-sm">
              Historial de actividad y revisiones de tus materiales.
            </p>
          </div>
        </div>

        {/* Lista en un contenedor limpio */}
        <div>
          <NotificationsList notifications={notificaciones} />
        </div>
      </div>
    </div>
  );
}
