import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

export default function InnovationSection() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <Card className="border-2">
          <CardContent className="pt-12 pb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Una Iniciativa del Área de Innovación UTEM
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
                Este proyecto nace del compromiso de la Universidad Tecnológica
                Metropolitana con la innovación y la sostenibilidad. A través
                del Club Innova UTEM, buscamos generar conciencia sobre los
                biomateriales y facilitar la colaboración entre investigadores,
                estudiantes y la comunidad académica para construir un futuro
                más sostenible.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="flex flex-col items-center">
                <Image
                  src="/images/Utem.webp"
                  alt="Logo UTEM"
                  width={120}
                  height={120}
                  className="object-contain"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Universidad Tecnológica Metropolitana
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="h-14 w-14 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Club Innova UTEM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
