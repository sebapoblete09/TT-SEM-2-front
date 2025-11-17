import { MessageSquare, Search, Upload } from "lucide-react";

export default function Steps() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Participar es Fácil
          </h2>
          <p className="text-lg text-muted-foreground">
            Únete a la comunidad en tres simples pasos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Explora</h3>
              <p className="text-muted-foreground">
                Busca en nuestra base de datos y filtra por tipo de material,
                ingredientes o método de fabricación.
              </p>
            </div>
            <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent" />
          </div>

          <div className="relative">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Registra</h3>
              <p className="text-muted-foreground">
                Sube tu propia receta, comparte tus hallazgos y documenta tu
                proceso con fotos y videos.
              </p>
            </div>
            <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-secondary to-transparent" />
          </div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              3
            </div>
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Colabora</h3>
            <p className="text-muted-foreground">
              Conecta con otros investigadores y creadores de la universidad, a
              travez de recetas colaborativas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
