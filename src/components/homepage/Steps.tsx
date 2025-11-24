import { MessageSquare, Search, Upload } from "lucide-react";

export default function Steps() {
  return (
    <section id="participar" className="py-20 px-4 bg-white relative">
      <div className="container mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 tracking-tight">
            Participar es <span className="text-green-600">Fácil</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Únete a la comunidad de innovación en biomateriales en tres simples
            pasos.
          </p>
        </div>

        {/* Grid de Pasos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* --- CORRECCIÓN AQUÍ --- */}
          {/* LÍNEA CONECTORA: Quitamos el -z-10 y ajustamos el color para que se vea */}
          {/* LÍNEA CONECTORA (Degradado Sólido) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[3px] bg-gradient-to-r from-green-200 via-teal-200 to-blue-200 rounded-full" />

          {/* PASO 1 */}
          <div className="relative flex flex-col items-center text-center group z-10">
            <div className="relative mb-6">
              {/* Agregamos bg-white al contenedor del círculo para tapar la línea si pasa por detrás */}
              <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-green-100 transition-all duration-300 relative z-20">
                <Search className="h-10 w-10 text-green-600" />
              </div>

              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-white z-30">
                1
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-slate-800">Explora</h3>
            <p className="text-slate-500 leading-relaxed max-w-xs">
              Busca en nuestra base de datos y filtra por tipo de material,
              ingredientes o método de fabricación.
            </p>
          </div>

          {/* PASO 2 */}
          <div className="relative flex flex-col items-center text-center group z-10">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-teal-100 transition-all duration-300 relative z-20">
                <Upload className="h-10 w-10 text-teal-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-white z-30">
                2
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-slate-800">Registra</h3>
            <p className="text-slate-500 leading-relaxed max-w-xs">
              Sube tu propia receta, comparte tus hallazgos y documenta tu
              proceso con fotos y videos.
            </p>
          </div>

          {/* PASO 3 */}
          <div className="relative flex flex-col items-center text-center group z-10">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300 relative z-20">
                <MessageSquare className="h-10 w-10 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-white z-30">
                3
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-slate-800">Colabora</h3>
            <p className="text-slate-500 leading-relaxed max-w-xs">
              Conecta con otros investigadores y creadores de la universidad a
              través de recetas colaborativas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
