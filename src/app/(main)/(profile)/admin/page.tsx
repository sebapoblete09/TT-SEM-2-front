import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaterialPending from "@/components/admin/Materials";
import UsersSection from "@/components/admin/Users";
import { Shield } from "lucide-react";
import Stats from "@/components/admin/Stats";

export default function page() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-accent rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
        </div>
        <p className="text-muted-foreground">
          Gestiona cuentas de usuarios y aprueba nuevos biomateriales
        </p>
      </div>

      <Stats />

      <Tabs defaultValue="materiales" className="space-y-3">
        {/* --- Menú de Navegación --- */}
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="materiales">Materiales Pendientes</TabsTrigger>
          <TabsTrigger value="usuarios">Gestionar Usuarios</TabsTrigger>
        </TabsList>
        {/* --- Contenido de la Pestaña Materiales --- */}
        <TabsContent value="materiales" className="space-y-4">
          <MaterialPending />
        </TabsContent>

        {/* --- Contenido de la Pestaña Usuarios --- */}
        <TabsContent value="usuarios" className="mt-4">
          <UsersSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
