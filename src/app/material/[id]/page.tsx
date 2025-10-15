"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MaterialHeader from "@/components/material/MaterialHeader";
import MaterialGallery from "@/components/material/MaterialGallery";
import MaterialTabs from "@/components/material/materialtabs/index";
import MaterialSidebar from "@/components/material/materialSidebar/index";
import { Material } from "@/types/materials";

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
        const res = await fetch(`http://localhost:8080/materials/${id}`);
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

  if (loading)
    return <div className="container py-8">Cargando material...</div>;
  if (error) return <div className="container py-8 text-red-500">{error}</div>;
  if (!material) return <div className="container py-8">No encontrado.</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <MaterialHeader material={material} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          <div className="lg:col-span-2 space-y-8 ">
            <MaterialGallery material={material} />
            <MaterialTabs material={material} />
          </div>
          <MaterialSidebar material={material} />
        </div>
      </div>
    </div>
  );
}
