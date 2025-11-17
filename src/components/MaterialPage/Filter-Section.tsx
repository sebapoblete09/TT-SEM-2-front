// components/ui/FilterSection.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import categories from "@/const/Categories";
import { LuSearch } from "react-icons/lu";
import { Input } from "@/components/ui/input";

// 1. Importa los hooks de Next.js para manejar la URL
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; // (Recuerda: npm install use-debounce)

export default function FilterSection() {
  // 2. Inicializa los hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 3. Obtiene los valores actuales de la URL (o usa valores por defecto)
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "Todos";

  // 4. Handler para el input de BÚSQUEDA (con debounce)
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    // Reemplaza la URL actual con los nuevos parámetros
    router.replace(`${pathname}?${params.toString()}`);
  }, 300); // Espera 300ms después de dejar de teclear

  // 5. Handler para los clics de CATEGORÍA (instantáneo)
  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === "Todos") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    // Reemplaza la URL actual con los nuevos parámetros
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="py-8 px-4 bg-background border-b">
      <div className="container mx-auto max-w-7xl">
        {/* 6. Reemplazamos <Filter /> por el Input funcional */}
        <div className="flex-1 relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar biomateriales..."
            className="pl-10 h-12"
            // Asigna el valor de la URL al cargar
            defaultValue={currentSearch}
            // Llama al handler 'debounced'
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
