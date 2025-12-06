// components/admin/UsersList.tsx
"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usuario } from "@/types/user";
import { BookOpen, Edit2, ShieldCheck, UserCog, X } from "lucide-react";
import { Badge } from "../ui/badge";

type UserListProps = {
  initialUsers: usuario[];
  access_token: string;
};

export function UsersList({ initialUsers, access_token }: UserListProps) {
  // Estado para manejar la lista de usuarios (para futuras actualizaciones)
  const [users, setUsers] = useState(initialUsers);

  // Estado para saber qué usuario estamos editando
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  // funcion para cambiar el rol de un usuario
  const handleRoleChange = async (userId: number, newRole: string) => {
    console.log(`Cambiando rol para ${userId} a ${newRole}`);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:8080";
      const res = await fetch(`${baseUrl}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ rol: newRole }),
      });
      if (!res.ok) throw new Error("Error al actualizar rol");

      // Actualizar estado local (Optimistic Update)
      setUsers(
        users.map((u) => (u.google_id === userId ? { ...u, rol: newRole } : u))
      );

      setEditingUserId(null);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el rol");
    } finally {
      setLoading(false);
    }
  };

  // Helper para estilo del rol
  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "administrador":
        return {
          color: "bg-purple-100 text-purple-700 border-purple-200",
          icon: ShieldCheck,
        };
      case "colaborador":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: UserCog,
        };
      default: // Lector
        return {
          color: "bg-slate-100 text-slate-600 border-slate-200",
          icon: BookOpen,
        };
    }
  };
  return (
    <TabsContent value="users" className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Gestión de Usuarios
          </h3>
          <p className="text-sm text-slate-500">
            Administra los permisos y roles de los miembros de la comunidad.
          </p>
        </div>
        <div className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          Total: {users.length}
        </div>
      </div>

      <div className="grid gap-4">
        {users.map((user, index) => {
          // Clave única segura
          const userKey = user.google_id || `user-${index}`;
          const roleStyle = getRoleBadge(user.rol || "lector");
          const RoleIcon = roleStyle.icon;

          return (
            <div
              key={userKey}
              className="group bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              {/* IZQUIERDA: Info Usuario */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-800 text-base">
                    {user.nombre || user.email?.split("@")[0]}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* CENTRO/DERECHA: Gestión de Rol */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {editingUserId === user.google_id ? (
                  // --- MODO EDICIÓN ---
                  <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                    <Select
                      defaultValue={user.rol}
                      onValueChange={(val) =>
                        handleRoleChange(user.google_id, val)
                      }
                      disabled={loading}
                    >
                      <SelectTrigger className="w-[160px] h-9 bg-white border-slate-300 focus:ring-green-500">
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="administrador"
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                            <span>Administrador</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="colaborador"
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <UserCog className="w-4 h-4 text-blue-600" />
                            <span>Colaborador</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="lector" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-slate-500" />
                            <span>Lector</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => setEditingUserId(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  // --- MODO VISUALIZACIÓN ---
                  <>
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 text-xs font-medium border ${roleStyle.color} flex items-center gap-1.5`}
                    >
                      <RoleIcon className="w-3.5 h-3.5" />
                      <span className="capitalize">{user.rol}</span>
                    </Badge>

                    <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block" />

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-green-700 hover:bg-green-50 transition-colors"
                      onClick={() => setEditingUserId(user.google_id)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </TabsContent>
  );
}
