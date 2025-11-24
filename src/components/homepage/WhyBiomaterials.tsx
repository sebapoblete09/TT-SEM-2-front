import { Card, CardContent } from "../ui/card";
import benefits from "@/const/HomeSection1";

export default function WhyBiomaterials() {
  return (
    // CAMBIO 1: Fondo un poco más oscuro (bg-slate-50) en lugar de transparente/blanco
    <section className="py-16 md:py-24 px-4 bg-slate-50 relative overflow-hidden">
      {/* Fondo decorativo: Intensifiqué un poco la opacidad para que se note sobre el gris */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl mix-blend-multiply" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-slate-900 tracking-tight">
            ¿Por qué <span className="text-green-600">Biomateriales</span>?
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto text-pretty leading-relaxed">
            Son materiales derivados de fuentes naturales, renovables y
            biodegradables. Representan una alternativa clave frente a los
            contaminantes convencionales y son el futuro de la{" "}
            <span className="font-medium text-green-700">
              innovación sostenible
            </span>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="group bg-white border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              <CardContent className="pt-8 pb-8 px-6 text-center flex flex-col items-center h-full">
                <div
                  className={`w-20 h-20 rounded-2xl ${benefit.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ease-out`}
                >
                  <benefit.icon className={`w-10 h-10 ${benefit.iconColor}`} />
                </div>

                <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-green-700 transition-colors">
                  {benefit.title}
                </h3>

                <p className="text-slate-500 leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
