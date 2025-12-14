import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Mail, MapPin, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* 1. IDENTIDAD */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <div className="bg-white p-1 rounded-md">
                <Image
                  src="/images/Utem.webp"
                  alt="UTEM"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <span>Biomateriales UTEM</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Una plataforma de código abierto dedicada a la documentación,
              investigación y divulgación de biomateriales y procesos
              experimentales.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Redes Sociales (Ejemplos) */}
              <a href="#" className="hover:text-green-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 2. PLATAFORMA */}
          <div>
            <h3 className="text-white font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/materials"
                  className="hover:text-green-400 transition-colors"
                >
                  Catálogo de Materiales
                </Link>
              </li>
              <li>
                <Link
                  href="/register-material"
                  className="hover:text-green-400 transition-colors"
                >
                  Contribuir / Registrar
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-green-400 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. INSTITUCIONAL */}
          <div>
            <h3 className="text-white font-semibold mb-4">Institucional</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.utem.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors flex items-center gap-2"
                >
                  <Globe className="w-3 h-3" /> Universidad UTEM
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  HUB de Innovación
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  ProteinLab
                </a>
              </li>
            </ul>
          </div>

          {/* 4. CONTACTO */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-green-500" />
                <span>
                  Dieciocho 390,
                  <br />
                  Santiago, Chile
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green-500" />
                <a
                  href="mailto:contacto@utem.cl"
                  className="hover:text-white transition-colors"
                >
                  contacto@utem.cl
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            © {currentYear} Biomateriales UTEM. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <span>
              Desarrollado por{" "}
              <span className="text-slate-300 font-medium">Tu Nombre</span>
            </span>
            <Link
              href="/privacy"
              className="hover:text-slate-300 transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/terms"
              className="hover:text-slate-300 transition-colors"
            >
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
