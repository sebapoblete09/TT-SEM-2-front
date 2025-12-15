/**
 * @file page.tsx
 * @description Página de Registro (Server Component).
 * Maneja la protección de ruta y la verificación de roles del lado del servidor.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserDataService } from "@/services/userServices";

// Importamos el formulario cliente
import RegisterMaterialForm from "@/components/register-material/RegisterForm";

// Iconos y UI para la pantalla de bloqueo
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function RegisterMaterialPage() {
  const supabase = await createClient();

  // 1. Verificar Sesión
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // 2. Verificar Rol (Llamada al Backend)
  let userRole = "lector";
  try {
    const profile = await getUserDataService(session.access_token);
    if (profile && profile.usuario) {
      userRole = profile.usuario.rol?.toLowerCase() || "lector";
    }
  } catch (error) {
    console.error("Error verificando rol:", error);
  }

  const isLector = userRole === "lector";

  // 3. Renderizado Condicional
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        {isLector ? (
          // --- VISTA BLOQUEADA (Server Rendered) ---
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-12 text-center border-2 border-dashed border-slate-200 shadow-sm relative overflow-hidden">
              {/* Decoración fondo */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200 opacity-50" />

              <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                Acceso Restringido
              </h3>

              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Tu perfil actual es de <strong>Lector</strong>.{" "}
                <br className="hidden md:block" />
                Para contribuir a la biblioteca registrando nuevos materiales,
                necesitas el rol de <strong>Colaborador</strong>.
              </p>

              <div className="flex justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 gap-3 px-8 h-12 text-base"
                >
                  <Link href="/user">
                    Ir a mi Perfil para Solicitar
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-slate-400 mt-6">
                Si crees que esto es un error, contacta al administrador.
              </p>
            </div>
          </div>
        ) : (
          // --- VISTA PERMITIDA: Carga el formulario cliente ---
          <RegisterMaterialForm />
        )}
      </div>
    </div>
  );
}
