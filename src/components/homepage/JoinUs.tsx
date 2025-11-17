import Link from "next/link";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function JoinUs() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
          ¿Listo para construir un futuro más verde?
        </h2>
        <p className="text-lg md:text-xl mb-10 text-primary-foreground/90 max-w-2xl mx-auto text-pretty">
          Explora todas las recetas de biomateriales o comparte tu propio
          descubrimiento con la comunidad UTEM.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link href="/materials">Explorar Materiales</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 bg-transparent"
          >
            <Link href="/register-material">
              <Plus className="mr-2 h-5 w-5" />
              Registrar Material
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
