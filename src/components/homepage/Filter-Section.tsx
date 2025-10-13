import Filter from "@/components/ui/filter";
import { Badge } from "@/components/ui/badge";
import categories from "@/const/Categories";
export default function FilterSection() {
  return (
    <section className="py-8 px-4 bg-background border-b">
      {/*Filtro de busqueda*/}
      <div className="container mx-auto max-w-7xl">
        <Filter />

        {/*Lista de categorias */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === "Todos" ? "default" : "outline"}
              className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
