"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Hero() {
  return (
    <section className="bg-primary text-primary-foreground py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Plataforma de Biomateriales UTEM
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Descubre, comparte y colabora en el desarrollo de materiales
            biobasados sostenibles. Una comunidad de investigadores innovando
            para un futuro más verde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" variant="outline-primary">
              <Link href="/register-material">+ Registrar Material</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="#explore">Explorar Materiales</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
