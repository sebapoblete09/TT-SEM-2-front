import { getStatsList } from "@/const/StatList";
import { estadisticas } from "@/types/user";
import { LayoutDashboard } from "lucide-react";

export function ProfileStats({ estadisticas }: { estadisticas: estadisticas }) {
  const statsList = getStatsList(estadisticas);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
      {/* Encabezado */}
      <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2 shrink-0">
        <LayoutDashboard className="w-4 h-4 text-slate-400" />
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Resumen de Actividad
        </h3>
      </div>

      {/* Lista de filas */}
      <div className="p-4 flex flex-col gap-1 flex-1 justify-center">
        {statsList.map((stat, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group cursor-default"
          >
            <div className="flex items-center gap-4">
              {/* Icono con fondo de color */}
              <div
                className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="w-5 h-5" />
              </div>

              {/* Label */}
              <span className="font-medium text-slate-600 text-sm">
                {stat.label}
              </span>
            </div>

            {/* Valor */}
            <span className="text-xl font-bold text-slate-900">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
