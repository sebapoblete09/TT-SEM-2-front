import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LinkIcon, Plus, Users, X } from "lucide-react";
import { creador } from "@/types/materials";

// --- Props del Componente Principal ---
interface Props {
  nombre: string;
  setNombre: (v: string) => void;
  descripcion: string;
  setDescripcion: (v: string) => void;
  herramientas: string[];
  setHerramientas: (v: string[]) => void;
  composicion: string[];
  setComposicion: (v: string[]) => void;
  derivadoDe?: string; // Puede ser null o string vacío
  colaboradores?: creador[]; // Array de objetos creador
}

// --- Componente Auxiliar para manejar listas (Input + Badges) ---
function ListInput({
  label,
  placeholder,
  items,
  setItems,
}: {
  label: string;
  placeholder: string;
  items: string[];
  setItems: (v: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim() !== "") {
      setItems([...items, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Evita que se envíe el formulario principal
      handleAdd();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button" // Importante: type button para no enviar el form
          size="icon"
          onClick={handleAdd}
          className="bg-slate-900 hover:bg-slate-800 shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Área de lista */}
      <div className="mt-3 flex flex-wrap gap-2 min-h-[40px] p-2 border border-dashed rounded-lg bg-slate-50/50">
        {items.length === 0 ? (
          <span className="text-xs text-slate-400 w-full text-center self-center italic">
            Los elementos agregados aparecerán aquí
          </span>
        ) : (
          items.map((item, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="pl-3 pr-1 py-1 flex items-center gap-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="ml-1 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-50"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}

// --- Componente Principal ---
export function BasicInfoSection({
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  herramientas,
  setHerramientas,
  composicion,
  setComposicion,
  derivadoDe,
  colaboradores,
}: Props) {
  return (
    <div className="space-y-6 border p-4 rounded-lg bg-slate-50">
      <h3 className="font-semibold text-slate-700">Información General</h3>

      {/* --- CAMPOS EDITABLES --- */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre del Material <span className="text-red-500">*</span>
        </label>
        <Input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Descripción Corta
        </label>
        <Textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ListInput
          label="Herramientas"
          placeholder="Agregar herramienta..."
          items={herramientas}
          setItems={setHerramientas}
        />
        <ListInput
          label="Composición"
          placeholder="Agregar ingrediente..."
          items={composicion}
          setItems={setComposicion}
        />
      </div>

      {/* --- SECCIÓN DE SOLO LECTURA --- */}
      {(derivadoDe || (colaboradores && colaboradores.length > 0)) && (
        <div className="pt-4 mt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Información de Origen (Solo Lectura)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. DERIVADO DE */}
            {derivadoDe && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1 text-slate-600">
                  <LinkIcon className="w-3 h-3" />
                  Derivado de
                </label>
                <div className="relative">
                  <Input
                    value={derivadoDe}
                    disabled
                    className="bg-slate-100  border-slate-200 cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Este material es una iteración de otro existente.
                </p>
              </div>
            )}

            {/* 2. COLABORADORES */}
            {colaboradores && colaboradores.length > 0 && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1 text-slate-600">
                  <Users className="w-3 h-3" />
                  Colaboradores
                </label>
                <div className="p-3 bg-slate-100 border border-slate-200 rounded-md min-h-[40px] flex flex-wrap gap-2">
                  {colaboradores.map((colab) => (
                    <Badge
                      key={colab.ID || colab.google_id} // Usar ID único
                      variant="outline"
                      className="bg-white text-slate-600 border-slate-300 shadow-sm"
                    >
                      {colab.nombre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
