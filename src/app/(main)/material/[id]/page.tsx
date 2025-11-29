"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MaterialHeader from "@/components/material/MaterialHeader";
import MaterialGallery from "@/components/material/MaterialGallery";
import { Material } from "@/types/materials";
import LoadingCard from "@/components/ui/loading";
import CompositionsTools from "@/components/material/Section2/index";
import Properties from "@/components/material/Section3/index";
import RecipeTab from "@/components/material/Section4/RecipeTabs";

export default function MaterialDetailPage() {
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

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
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  if (loading) return <LoadingCard />;
  if (error) return <div className="container py-8 text-red-500">{error}</div>;
  if (!material) return <div className="container py-8">No encontrado.</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container flex flex-col  mx-auto max-w-100vh  px-4 py-8">
        {/*Informacion basica + Galeria */}
        <div className="grid grid-cols-2 p-5 gap-10 border-2 max-w-7xl m-auto border-slate-500/50 rounded-2xl bg-white">
          <MaterialGallery material={material} />
          <MaterialHeader material={material} />
        </div>

        {/*Composicion + propiedades */}
        <CompositionsTools material={material} />
        <Properties material={material} />
        <RecipeTab pasos={material.pasos} />
      </div>
    </div>
  );
}
