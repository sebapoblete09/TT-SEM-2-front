// components/admin/UsersList.tsx
"use client"; // <-- 1. ¡Esto es lo más importante!

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // 2. Importa los componentes Select
import { usuario } from "@/types/user";

// 3. Define las props que recibirá
type UserListProps = {
  initialUsers: usuario[];
};

export function UsersList({ initialUsers }: UserListProps) {
  // 4. Estado para manejar la lista de usuarios (para futuras actualizaciones)
  const [users, setUsers] = useState(initialUsers);

  // 5. Estado para saber qué usuario estamos editando
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  // 6. (Lógica futura) Aquí pondrías tu función para llamar a la API y guardar el rol
  const handleRoleChange = async (userId: number, newRole: string) => {
    console.log(`Cambiando rol para ${userId} a ${newRole}`);

    // Aquí llamarías a tu backend:
    // await fetch(`${baseUrl}/users/${userId}/role`, {
    //   method: "PATCH",
    //   body: JSON.stringify({ rol: newRole }),
    //   headers: { ... }
    // });

    // Actualiza el estado local para que la UI se refresque
    /*setUsers(users.map(u => 
      u.id === userId ? { ...u, rol: newRole } : u
    ));*/

    // Cierra el select
    setEditingUserId(null);
  };

  return (
    <TabsContent value="usuarios" className="mt-4">
      <p className="text-muted-foreground mb-4">
        Revisa los usuarios y modifica sus roless.
      </p>

      <div className="border rounded-lg p-4">
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg gap-4"
            >
              <div>
                <p className="font-bold">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Rol actual: <span className="font-medium">{user.rol}</span>
                </p>
              </div>

              {/* --- 7. LÓGICA DE RENDERIZADO CONDICIONAL --- */}
              <div className="flex gap-x-2">
                {editingUserId === user.id ? (
                  // --- ESTADO DE EDICIÓN (mostramos el Select) ---
                  <>
                    <Select
                      defaultValue={user.rol}
                      onValueChange={(newRole) => {
                        // ✅ Añade esta comprobación
                        if (user.id) {
                          handleRoleChange(user.id, newRole);
                        } else {
                          console.error(
                            "No se pudo cambiar el rol: ID de usuario indefinido."
                          );
                        }
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrador">
                          Administrador
                        </SelectItem>
                        <SelectItem value="lector">Lector</SelectItem>
                        <SelectItem value="colaborador">Colaborador</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      onClick={() => setEditingUserId(null)}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  // --- ESTADO NORMAL (mostramos el Botón) ---
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingUserId(user.id ?? null)} // 8. Al hacer clic, se activa el modo edición
                  >
                    Editar Rol
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </TabsContent>
  );
}
