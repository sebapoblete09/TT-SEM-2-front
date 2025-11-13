import { estadisticas } from "@/types/user";

// Componente "StatCard" interno para no repetir código
function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg text-center transition-transform hover:scale-105">
      <p className="text-4xl font-bold text-primary">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// Componente principal de estadísticas
export function ProfileStats({ estadisticas }: { estadisticas: estadisticas }) {
  return (
    <section className="mb-10">
      {/* Grid responsive:
        - 2 columnas en móvil (default)
        - 4 columnas en pantallas medianas (md) y superiores
      */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          value={estadisticas.materiales_creados}
          label="Materiales Creados"
        />
        <StatCard value={estadisticas.materiales_aprobados} label="Aprobados" />
        <StatCard
          value={estadisticas.materiales_pendientes}
          label="Pendientes de Aprobación"
        />
        <StatCard value={estadisticas.colaboraciones} label="Colaboraciones" />
      </div>
    </section>
  );
}
