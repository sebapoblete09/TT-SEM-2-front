import { useState } from "react";
import { useFormContext } from "react-hook-form"; // <--- Importante
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LinkIcon, Plus, Users, X } from "lucide-react";
import { creador } from "@/types/materials";
import { EditMaterialFormValues } from "@/components/register-material/schemas"; // Importa tu tipo inferido

// --- Props Reducidas ---
// Ya no necesitamos setNombre, setDescripcion, etc.
// Solo pasamos datos estáticos (read-only) que no están en el form context editable
interface Props {
  derivadoDe?: string;
  colaboradores?: creador[];
}

// --- Componente Auxiliar ListInput (Adaptado a RHF) ---
function ListInput({
  label,
  placeholder,
  fieldName, // Nombre del campo en el schema (ej: "herramientas")
}: {
  label: string;
  placeholder: string;
  fieldName: "herramientas" | "composicion"; // Tipado estricto
}) {
  // Hook para acceder al form context
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EditMaterialFormValues>();

  // Estado local SOLO para el input de texto temporal (no se guarda en el form hasta dar Enter)
  const [inputValue, setInputValue] = useState("");

  // Leemos el array actual del formulario
  const items = watch(fieldName) || [];

  const handleAdd = () => {
    if (inputValue.trim() !== "") {
      const newItem = inputValue.trim();
      // Evitar duplicados (opcional)
      if (!items.includes(newItem)) {
        setValue(fieldName, [...items, newItem], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      setInputValue("");
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const newItems = items.filter(
      (_: string, index: number) => index !== indexToRemove
    );
    setValue(fieldName, newItems, { shouldValidate: true, shouldDirty: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  // Obtener error específico de este campo array
  const errorMsg = errors[fieldName]?.message;

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
          // Si hay error en el array (ej: min(1)), pintamos borde rojo al input
          className={
            errorMsg ? "border-red-500 focus-visible:ring-red-500" : ""
          }
        />
        <Button
          type="button"
          size="icon"
          onClick={handleAdd}
          className="bg-slate-900 hover:bg-slate-800 shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Mensaje de error de validación (ej: "Agrega al menos una herramienta") */}
      {errorMsg && (
        <p className="text-xs text-red-500 mt-1">{errorMsg as string}</p>
      )}

      {/* Área de lista */}
      <div className="mt-3 flex flex-wrap gap-2 min-h-[40px] p-2 border border-dashed rounded-lg bg-slate-50/50">
        {items.length === 0 ? (
          <span className="text-xs text-slate-400 w-full text-center self-center italic">
            Los elementos agregados aparecerán aquí
          </span>
        ) : (
          items.map((item: string, index: number) => (
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
export function BasicInfoSection({ derivadoDe, colaboradores }: Props) {
  // Accedemos al contexto RHF
  const {
    register,
    formState: { errors },
  } = useFormContext<EditMaterialFormValues>();

  return (
    <div className="space-y-6 border p-4 rounded-lg bg-slate-50">
      <h3 className="font-semibold text-slate-700">Información General</h3>

      {/* --- CAMPO NOMBRE --- */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre del Material <span className="text-red-500">*</span>
        </label>
        <Input
          {...register("nombre")} // Vinculación automática
          className={
            errors.nombre ? "border-red-500 focus-visible:ring-red-500" : ""
          }
        />
        {errors.nombre && (
          <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>
        )}
      </div>

      {/* --- CAMPO DESCRIPCIÓN --- */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Descripción Corta
        </label>
        <Textarea
          {...register("descripcion")} // Vinculación automática
          rows={3}
          className={
            errors.descripcion
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }
        />
        {errors.descripcion && (
          <p className="text-xs text-red-500 mt-1">
            {errors.descripcion.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usamos el nuevo ListInput conectado a RHF */}
        <ListInput
          label="Herramientas"
          placeholder="Agregar herramienta..."
          fieldName="herramientas"
        />
        <ListInput
          label="Composición"
          placeholder="Agregar ingrediente..."
          fieldName="composicion"
        />
      </div>

      {/* --- SECCIÓN DE SOLO LECTURA (Se mantiene igual) --- */}
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
                    className="bg-slate-100 border-slate-200 cursor-not-allowed"
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
                      key={colab.ID || colab.google_id}
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
