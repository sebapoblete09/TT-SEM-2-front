/**
 * @file page.tsx
 * @description Página de detalle público de un material (Ficha Técnica).
 * * Esta página utiliza Server-Side Rendering (SSR) para obtener y mostrar
 * la información completa de un biomaterial específico basado en su ID.
 * Integra componentes modulares para la galería, encabezado, propiedades y receta.
 */

import { getMaterialByIdService } from "@/services/materialServices";
import { Material } from "@/types/materials";
import { notFound } from "next/navigation"; // Para manejar 404

// Componentes de UI
import MaterialHeader from "@/components/material/MaterialHeader";
import MaterialGallery from "@/components/material/MaterialGallery";
import CompositionsTools from "@/components/material/Section2/index";
import Properties from "@/components/material/Section3/index";
import RecipeTab from "@/components/material/Section4/RecipeTabs";
import DerivedSection from "@/components/MaterialPage/Derived-Section";

// Definimos el tipo de las props de la página
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MaterialDetailPage({ params }: PageProps) {
  // 1. Estados del Componente
  const { id } = await params;
  if (!id) return notFound();

  let material: Material | null = null;

  try {
    // 2. Fetch directo en el servidor
    material = await getMaterialByIdService(id);
  } catch (error) {
    console.error("Error fetching material:", error);
  }

  // 3. Manejo de "No encontrado"
  // Next.js mostrará automáticamente tu archivo not-found.tsx si existe
  if (!material) {
    return notFound();
  }

  // 4. Renderizado (JSX limpio, sin estados de carga)
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container flex flex-col mx-auto px-4 py-8">
        {/* SECCIÓN 1: RESUMEN VISUAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 p-5 gap-10 border-2 border-slate-500/50 rounded-2xl bg-white">
          <MaterialGallery material={material} />
          <MaterialHeader material={material} />
        </div>

        {/* SECCIONES DE DETALLE */}
        <CompositionsTools material={material} />
        <Properties material={material} />
        <RecipeTab pasos={material.pasos} />

        {/*Seccion de derivados */}
        <DerivedSection parentId={material.id} />
      </div>
    </div>
  );
}
