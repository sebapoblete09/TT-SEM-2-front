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
    <section className="relative text-primary-foreground py-16 px-4 overflow-hidden">
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt="Biomaterial"
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 opacity-50 bg-black" />
      </div>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Plataforma de Biomateriales UTEM
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed font-bold">
            Descubre, comparte y colabora en el desarrollo de materiales
            biobasados sostenibles. Una comunidad de investigadores innovando
            para un futuro más verde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" variant="default">
              <Link href="/materials">Explorar Materiales</Link>
            </Button>
            <Button asChild size="lg" variant="outline-primary">
              <Link href="/register-material ">+ Registrar Material </Link>
            </Button>
          </div>
        </div>
        <div className="flex gap-2 mt-8">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentImageIndex
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
