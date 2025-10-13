import { LuSearch } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuListFilter } from "react-icons/lu";
export default function Filter() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Buscar biomateriales..." className="pl-10 h-12" />
        </div>
        <Button variant="ghost" size="lg" className="md:w-auto">
          <LuListFilter className="mr-2 h-5 w-5" />
          Filtros
        </Button>
      </div>
    </div>
  );
}
