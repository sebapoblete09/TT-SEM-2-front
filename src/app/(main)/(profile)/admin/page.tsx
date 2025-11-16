import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaterialPending from "@/components/admin/Materials";
import UsersSection from "@/components/admin/Users";

export default function page() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>

      <Tabs defaultValue="materiales" className="w-full">
        {/* --- Menú de Navegación --- */}
        <TabsList className="grid w-full grid-cols-2 max-w-lg">
          <TabsTrigger value="materiales">Materiales Pendientes</TabsTrigger>
          <TabsTrigger value="usuarios">Gestionar Usuarios</TabsTrigger>
        </TabsList>
        {/* --- Contenido de la Pestaña Materiales --- */}
        <TabsContent value="materiales" className="mt-4">
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
