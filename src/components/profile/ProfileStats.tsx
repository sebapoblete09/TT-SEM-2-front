import { estadisticas } from "@/types/user";
import { FileText, CheckCircle, Clock, Users, LucideIcon } from "lucide-react"; // Importamos iconos

function StatCard({
  value,
  label,
  icon: Icon,
  color,
}: {
  value: number;
  label: string;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
      {/* Icono con fondo de color */}
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
      </div>

      <div>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export function ProfileStats({ estadisticas }: { estadisticas: estadisticas }) {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          value={estadisticas.materiales_creados}
          label="Materiales"
          icon={FileText}
          color="text-blue-600 bg-blue-100"
        />
        <StatCard
          value={estadisticas.materiales_aprobados}
          label="Aprobados"
          icon={CheckCircle}
          color="text-green-600 bg-green-100"
        />
        <StatCard
          value={estadisticas.materiales_pendientes}
          label="Pendientes"
          icon={Clock}
          color="text-amber-600 bg-amber-100"
        />
        <StatCard
          value={estadisticas.colaboraciones}
          label="Colaboraciones"
          icon={Users}
          color="text-purple-600 bg-purple-100"
        />
      </div>
    </section>
  );
}
