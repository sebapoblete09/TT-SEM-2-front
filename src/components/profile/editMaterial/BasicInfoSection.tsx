import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LinkIcon,
  Plus,
  Users,
  X,
  Trash2,
  PenTool,
  FlaskConical,
} from "lucide-react";
import { creador } from "@/types/materials";
import { EditMaterialFormValues } from "@/components/register-material/schemas"; // O tu schema correspondiente

interface Props {
  derivadoDe?: string;
  colaboradores?: creador[];
}

// =========================================================
// 1. COMPONENTE PARA HERRAMIENTAS (Array de Strings)
// =========================================================
function ToolsInput() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EditMaterialFormValues>();

  const [inputValue, setInputValue] = useState("");

  // Observamos el array de strings
  const items = watch("herramientas") || [];

  const handleAdd = () => {
    if (inputValue.trim() !== "") {
      const newItem = inputValue.trim();
      if (!items.includes(newItem)) {
        setValue("herramientas", [...items, newItem], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      setInputValue("");
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const newItems = items.filter((_, index) => index !== indexToRemove);
    setValue("herramientas", newItems, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm  items-center gap-4">
      <label className="flex items-center gap-2 text-sm font-medium mb-1 text-slate-700">
        <PenTool className="w-3 h-3" /> Herramientas{" "}
        <span className="text-red-500">*</span>
      </label>

      <div className="flex gap-2">
        <Input
          placeholder="Ej: Olla, Batidora, Molde..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={
            errors.herramientas
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
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

      {errors.herramientas && (
        <p className="text-xs text-red-500 mt-1">
          {errors.herramientas.message}
        </p>
      )}

      {/* Lista Visual de Badges */}
      <div className="mt-3 flex flex-wrap gap-2 min-h-[40px] p-2 border border-dashed rounded-lg bg-slate-50/50">
        {items.length === 0 ? (
          <span className="text-xs text-slate-400 w-full text-center self-center italic">
            Agrega las herramientas necesarias...
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

// =========================================================
// 2. COMPONENTE PARA COMPOSICIÓN (Array de Objetos)
// =========================================================
function CompositionInput() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<EditMaterialFormValues>();

  // Usamos useFieldArray para manejar la lista dinámica de objetos
  const { fields, append, remove } = useFieldArray({
    control,
    name: "composicion",
  });

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm  items-center gap-4">
      <div className="flex justify-between items-center mb-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <FlaskConical className="w-3 h-3" /> Composición{" "}
          <span className="text-red-500">*</span>
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ elemento: "", cantidad: "" })}
          className="h-6 text-xs text-slate-500 hover:text-amber-600 hover:bg-amber-50"
        >
          <Plus className="w-3 h-3 mr-1" /> Agregar Fila
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start">
            {/* Input Elemento */}
            <div className="flex-1">
              <Input
                placeholder="Ingrediente (ej: Agua)"
                {...register(`composicion.${index}.elemento`)}
                className={`h-9 ${
                  errors.composicion?.[index]?.elemento ? "border-red-500" : ""
                }`}
              />
            </div>

            {/* Input Cantidad */}
            <div className="w-1/3">
              <Input
                placeholder="Cant. (ej: 500ml)"
                {...register(`composicion.${index}.cantidad`)}
                className="h-9"
              />
            </div>

            {/* Botón Borrar Fila */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="p-4 border border-dashed rounded-lg bg-slate-50 text-center text-xs text-slate-400 italic">
            No hay ingredientes definidos. Haz clic en "Agregar Fila".
          </div>
        )}
      </div>

      {/* Error general del array (ej: min(1)) */}
      {errors.composicion?.root && (
        <p className="text-xs text-red-500 mt-2">
          {errors.composicion.root.message}
        </p>
      )}
      {/* Fallback si el error viene como string directo */}
      {typeof errors.composicion?.message === "string" && (
        <p className="text-xs text-red-500 mt-2">
          {errors.composicion.message}
        </p>
      )}
    </div>
  );
}

// =========================================================
// 3. COMPONENTE PRINCIPAL (BasicInfoSection)
// =========================================================
export function BasicInfoSection({ derivadoDe, colaboradores }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<EditMaterialFormValues>();

  return (
    <>
      {/* --- CAMPO NOMBRE --- */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <label className="block text-sm font-medium mb-1">
          Nombre del Material <span className="text-red-500">*</span>
        </label>
        <Input
          {...register("nombre")}
          className={
            errors.nombre ? "border-red-500 focus-visible:ring-red-500" : ""
          }
        />
        {errors.nombre && (
          <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>
        )}
      </div>

      {/* --- CAMPO DESCRIPCIÓN --- */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <label className="block text-sm font-medium mb-1">
          Descripción Corta
        </label>
        <Textarea
          {...register("descripcion")}
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

      {/* --- GRID PARA HERRAMIENTAS Y COMPOSICIÓN --- */}
      <div className="flex flex-col gap-8 items-start">
        {/* Componente específico para string[] (Herramientas) */}
        <ToolsInput />

        {/* Componente específico para object[] (Composición) */}
        <CompositionInput />
      </div>

      {/* --- SECCIÓN DE SOLO LECTURA --- */}
      {(derivadoDe || (colaboradores && colaboradores.length > 0)) && (
        <div className="pt-4 mt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Información de Origen (Solo Lectura)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="bg-slate-100 border-slate-200 cursor-not-allowed text-xs"
                  />
                </div>
              </div>
            )}

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
                      className="bg-white text-slate-600 border-slate-300 shadow-sm font-normal"
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
    </>
  );
}
