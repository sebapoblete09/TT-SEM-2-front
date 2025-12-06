import { estadisticas } from "@/types/user";
import { FileText, CheckCircle, Users, LayoutDashboard } from "lucide-react";

export function ProfileStats({ estadisticas }: { estadisticas: estadisticas }) {
  const statsList = [
    {
      label: "Total Materiales",
      value: estadisticas.total_materiales ?? 0,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Creados",
      value: estadisticas.materiales_creados ?? 0,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Colaboraciones",
      value: estadisticas.colaboraciones ?? 0,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full overflow-hidden">
      {/* Encabezado de la tarjeta de stats */}
      <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <LayoutDashboard className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          Resumen
        </h3>
      </div>

      {/* Lista de filas */}
      <div className="p-2">
        {statsList.map((stat, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group"
          >
            <div className="flex items-center gap-4">
              {/* Icono */}
              <div
                className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              {/* Label */}
              <span className="font-medium text-slate-600">{stat.label}</span>
            </div>

            {/* Valor */}
            <span className="text-2xl font-bold text-slate-900">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
