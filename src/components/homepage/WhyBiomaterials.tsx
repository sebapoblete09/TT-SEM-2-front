import { Card, CardContent } from "../ui/card";

import benefits from "@/const/HomeSection1";

export default function WhyBiomaterials() {
  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            ¿Por qué Biomateriales?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Son materiales derivados de fuentes naturales, renovables y
            biodegradables, una alternativa clave frente a los plásticos y
            contaminantes convencionales. Representan el futuro de la innovación
            sostenible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              // 2. USAMOS LA CLASE DINÁMICA DEL BORDE
              className={`border-2 hover:border-secondary transition-colors`}
            >
              <CardContent className="pt-8 text-center">
                {/* 3. USAMOS LAS CLASES DINÁMICAS DEL FONDO DEL ICONO */}
                <div
                  className={`w-16 h-16 rounded-full ${benefit.bgColor} flex items-center justify-center mx-auto mb-4`}
                >
                  {/* 4. USAMOS LA CLASE DINÁMICA DEL COLOR DEL ICONO */}
                  <benefit.icon className={`w-12 h-12 ${benefit.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
