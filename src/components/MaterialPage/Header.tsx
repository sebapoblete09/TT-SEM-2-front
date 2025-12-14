import { Beaker, Globe } from "lucide-react";
import ScrollReveal from "@/components/ui/scrollReveal"; // Ajusta la ruta si es necesario

// Definimos el tipo exacto que esperamos
interface HeroMaterialProps {
  totalMaterials: number;
}

export default function HeroMaterial({ totalMaterials }: HeroMaterialProps) {
  return (
    <ScrollReveal>
      <div className="relative bg-gradient-to-br from-primary via-primary to-secondary rounded-3xl p-8 md:p-12 mb-10 overflow-hidden shadow-2xl text-white border border-white/10">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl mix-blend-multiply" />

        <div className="relative z-10 max-w-3xl">
          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-white border border-white/20 backdrop-blur-md shadow-sm">
              <Globe className="w-3.5 h-3.5" />
              Catálogo Público
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-white border border-white/20 backdrop-blur-md shadow-sm">
              <Beaker className="w-3.5 h-3.5" />
              I+D Experimental
            </span>
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Descubre el futuro de los <br />
            <span className="text-lime-300 drop-shadow-sm">Biomateriales</span>
          </h1>

          {/* Descripción */}
          <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8 leading-relaxed font-light">
            Explora, filtra y conoce las recetas de nuestra colección. Cada
            material es una oportunidad para innovar de forma sostenible y
            abierta.
          </p>

          {/* Estadísticas */}
          <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/20">
            {/* Columna 1: Contador */}
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white tracking-tight">
                {totalMaterials}
              </span>
              <span className="text-sm text-white/70 uppercase tracking-wider font-medium">
                Materiales
              </span>
            </div>

            {/* Separador vertical (Solo uno) */}
            <div className="hidden sm:block w-px h-10 bg-white/20" />

            {/* Columna 2: Open Source */}
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-lime-300 tracking-tight">
                100%
              </span>
              <span className="text-sm text-white/70 uppercase tracking-wider font-medium">
                Open Source
              </span>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
