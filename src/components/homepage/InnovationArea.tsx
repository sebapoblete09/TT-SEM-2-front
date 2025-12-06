import { Lightbulb, Plus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

export default function InnovationSection() {
  return (
    <section id="nosotros" className="py-24 px-4 bg-slate-50/50">
      <div className="container mx-auto max-w-5xl bg">
        <Card className="border-2 border-slate-500/20 shadow-2xl shadow-slate-200/60 bg-white rounded-3xl overflow-hidden relative">
          {/* Decoración de fondo sutil dentro de la tarjeta */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60" />

          <CardContent className="pt-16 pb-16 px-6 md:px-12 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-slate-900 tracking-tight">
                Una Iniciativa del Área de{" "}
                <span className="text-green-600">Innovación UTEM</span>
              </h2>
              <p className="text-lg text-slate-500 max-w-3xl mx-auto text-pretty leading-relaxed">
                Este proyecto nace del compromiso de la Universidad Tecnológica
                Metropolitana con la innovación y la sostenibilidad. A través
                del <strong>Club Innova UTEM</strong>, buscamos generar
                conciencia sobre los biomateriales y facilitar la colaboración
                entre investigadores, estudiantes y la comunidad académica.
              </p>
            </div>

            {/* Contenedor de Logos con diseño unificado */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {/* LOGO 1: UTEM */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-32 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg">
                  <Image
                    src="/images/Utem.webp"
                    alt="Logo UTEM"
                    width={80} // Ajustado para que quepa bien en el circulo
                    height={80}
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-semibold text-slate-700">UTEM</p>
              </div>

              {/* CONECTOR: Signo + */}
              <div className="text-slate-300">
                <Plus className="w-8 h-8" />
              </div>

              {/* LOGO 2: CLUB INNOVA */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-32 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg hover:shadow-green-100">
                  <Lightbulb className="h-14 w-14 text-green-600" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Club Innova
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
