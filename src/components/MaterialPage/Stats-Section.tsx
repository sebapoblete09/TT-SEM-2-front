"use client";

export default function Stats({ count }: { count: number }) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {count || 0}
            </div>
            <div className="text-secondary-foreground/80">
              Biomateriales Registrados
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">45</div>
            <div className="text-secondary-foreground/80">
              Investigadores Activos
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">23</div>
            <div className="text-secondary-foreground/80">
              Proyectos Colaborativos
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
