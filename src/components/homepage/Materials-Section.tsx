import materials from "@/const/Materials";
import { MaterialCard } from "@/components/ui/materialCard";

export default function Materials_Section() {
  return (
    <section id="explore" className="py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Materiales Destacados</h2>
            <p className="text-muted-foreground">
              Explora nuestra colección de biomateriales innovadores
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/*materials son materiales de prueba */}
          {materials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      </div>
    </section>
  );
}
