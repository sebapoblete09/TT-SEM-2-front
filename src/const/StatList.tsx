import { estadisticas } from "@/types/user";
import {
  FileText,
  CheckCircle,
  Clock,
  Users,
  LucideIcon, // Importamos el tipo para TypeScript
} from "lucide-react";

// Definimos el tipo de cada item para tener autocompletado fuerte
export interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bg: string;
}

// Convertimos la lista en una función que recibe los datos
export const getStatsList = (estadisticas: estadisticas): StatItem[] => {
  return [
    {
      label: "Total Materiales",
      value: estadisticas.materiales_creados ?? 0,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Aprobados",
      value: estadisticas.materiales_aprobados ?? 0,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Pendientes",
      value: estadisticas.materiales_pendientes ?? 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Colaboraciones",
      value: estadisticas.colaboraciones ?? 0,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];
};
