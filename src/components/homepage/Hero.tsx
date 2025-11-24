"use client";
import { Button } from "@/components/ui/button";
import images from "@/const/Images";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Fondo de Imágenes */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt="Biomaterial UTEM"
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        {/* Overlay Oscuro (60%) */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Contenido Principal */}
      {/* pb-32 asegura que en móvil el texto no toque los puntos del carrusel */}
      <div className="container mx-auto max-w-7xl px-4 relative z-20 pt-24 pb-32 md:pt-20 md:pb-0">
        <div className="max-w-4xl mx-auto md:mx-0">
          {" "}
          {/* Centrado en móvil si quieres, o izquierda */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white tracking-tight drop-shadow-lg text-balance">
            Plataforma de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">
              Biomateriales UTEM
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-2xl drop-shadow-md text-pretty">
            Descubre, comparte y colabora en el desarrollo de materiales
            biobasados sostenibles. Una comunidad de investigadores innovando
            para un futuro más verde.
          </p>
          {/* BOTONES RESPONSIVE */}
          {/* Flex-col en móvil (uno abajo del otro), Flex-row en tablet (al lado) */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Botón 1: Principal (Verde) */}
            <Button
              asChild
              size="lg"
              variant="default"
              className="w-full sm:w-auto text-base md:text-lg h-12 px-8 transition-transform active:scale-95"
            >
              <Link href="/materials">Explorar Materiales</Link>
            </Button>

            {/* Botón 2: Secundario (Glass) */}
            <Button
              asChild
              size="lg"
              variant="outline-primary"
              className="w-full sm:w-auto text-base md:text-lg h-12 px-8 transition-transform active:scale-95"
            >
              <Link href="/register-material">+ Registrar Material</Link>
            </Button>
          </div>
        </div>

        {/* Indicadores del carrusel */}
        <div className="absolute bottom-15 left-0 right-0 flex justify-center md:justify-start md:left-4 md:right-auto gap-3 z-30 px-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                index === currentImageIndex
                  ? "w-8 bg-green-500"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Degradado inferior */}
      <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
