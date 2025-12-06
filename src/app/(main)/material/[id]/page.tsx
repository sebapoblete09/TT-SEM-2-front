"use client";
/**
 * @file page.tsx
 * @description Página de detalle público de un material (Ficha Técnica).
 * * Esta página utiliza Client-Side Rendering (CSR) para obtener y mostrar
 * la información completa de un biomaterial específico basado en su ID.
 * Integra componentes modulares para la galería, encabezado, propiedades y receta.
 */

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Componentes de UI y Secciones
import MaterialHeader from "@/components/material/MaterialHeader";
import MaterialGallery from "@/components/material/MaterialGallery";
import CompositionsTools from "@/components/material/Section2/index"; // Sección combinada: Composición + Herramientas
import Properties from "@/components/material/Section3/index"; // Sección de Propiedades (Mecánicas, etc.)
import RecipeTab from "@/components/material/Section4/RecipeTabs"; // Sección de Pasos/Receta
import LoadingCard from "@/components/ui/loading";

// Tipos
import { Material } from "@/types/materials";

export default function MaterialDetailPage() {
  // 1. Estados del Componente
  // Almacenamos el material completo, el estado de carga y posibles errores de red.
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtenemos el parámetro dinámico de la URL (ej: /materials/123 -> id = 123)
  const { id } = useParams();

  /**
   * Efecto de Carga de Datos
   * Se ejecuta al montar el componente o cuando cambia el ID.
   */
  useEffect(() => {
    if (!id) return;
    const fetchMaterial = async () => {
      try {
        setLoading(true);

        const baseUrl =
          process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/materials/${id}`);

        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Material = await res.json();
        setMaterial(data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar el material";
        console.error(message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  // 2. Renderizado Condicional (Guard Clauses)
  if (loading) return <LoadingCard />;
  if (error) return <div className="container py-8 text-red-500">{error}</div>;
  if (!material) return <div className="container py-8">No encontrado.</div>;

  // 3. Renderizado Principal (Éxito)
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Contenedor Principal Centrado */}
      <div className="container flex flex-col  mx-auto max-w-100vh  px-4 py-8">
        {/* SECCIÓN 1: RESUMEN VISUAL
          Grid de 2 columnas para la Galería (izq) y la Info Principal (der).
          Nota: En móvil se colapsa a 1 columna automáticamente.
        */}

        <div className="grid grid-cols-2 p-5 gap-10 border-2 max-w-7xl m-auto border-slate-500/50 rounded-2xl bg-white">
          {/* Columna Izquierda: Galería de Imágenes */}
          <MaterialGallery material={material} />
          {/* Columna Derecha: Título, Autor, Descripción corta */}
          <MaterialHeader material={material} />
        </div>

        {/* SECCIONES DE DETALLE (Vertical Stack)
          Aquí desglosamos la información técnica paso a paso.
        */}
        {/* Sección 2: Ingredientes y Herramientas */}
        <CompositionsTools material={material} />

        {/* Sección 3: Propiedades Técnicas (Mecánicas, Sensoriales) */}
        <Properties material={material} />

        {/* Sección 4: Proceso de Fabricación (Paso a paso) */}
        <RecipeTab pasos={material.pasos} />
      </div>
    </div>
  );
}
