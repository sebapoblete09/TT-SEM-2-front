import Image from "next/image";
import { useFormContext, useFieldArray } from "react-hook-form"; // <--- Importante
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { EditMaterialFormValues } from "@/schemas/schemas"; // Tu tipo inferido

// Ya no recibe props de estado, es autónomo
export function StepsSection() {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<EditMaterialFormValues>();

  // Hook específico para manejar arrays de objetos
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pasos", // Nombre del campo en tu schema
  });

  // Handler para agregar paso
  const handleAddStep = () => {
    append({
      id: Date.now(), // ID temporal único para la key
      orden_paso: fields.length + 1,
      descripcion: "",
      url_imagen: null,
      url_video: null,
      // @ts-ignore: Propiedad temporal para el archivo nuevo, no está en el schema de datos pero sí en el form
      newFile: null,
    });
  };

  // Handler para eliminar paso
  const handleRemoveStep = (index: number) => {
    remove(index);

    // Opcional: Renumerar orden_paso después de borrar para mantener secuencia 1, 2, 3...
    // (Aunque tu backend podría manejarlo, es bueno hacerlo visualmente)
    const currentSteps = watch("pasos");
    const reordered = currentSteps.map((step: any, i: number) => ({
      ...step,
      orden_paso: i + 1,
    }));
    setValue("pasos", reordered);
  };

  // Handler para el archivo (este es un poco manual porque RHF no maneja inputs file en arrays trivialmente)
  const handleFileChange = (index: number, file: File) => {
    // @ts-ignore: Asignamos el archivo a una propiedad temporal en el objeto del paso
    setValue(`pasos.${index}.newFile`, file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-semibold text-slate-700 text-xl">Receta / Pasos</h3>
        <span className="text-xs text-slate-400">
          {fields.length} pasos configurados
        </span>
      </div>

      {/* Mensaje de error general del array (ej: "Mínimo 1 paso") */}
      {errors.pasos?.root && (
        <p className="text-red-500 text-sm">{errors.pasos.root.message}</p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => {
          // Obtenemos los valores actuales para renderizar la preview
          // Usamos watch para ver cambios en tiempo real (como la imagen nueva)
          const currentStep = watch(`pasos.${index}`);
          const error = errors.pasos?.[index]?.descripcion;

          return (
            <div
              key={field.id} // Importante: usar el id de useFieldArray
              className="flex gap-4 p-4 border rounded-lg bg-white relative group"
            >
              {/* CONTENIDO TEXTO */}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm bg-slate-100 px-2 py-1 rounded">
                    Paso {index + 1}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveStep(index)}
                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                    title="Eliminar este paso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <Textarea
                  {...register(`pasos.${index}.descripcion`)} // Conexión automática
                  className={`w-full bg-slate-50 focus:bg-white transition-colors ${
                    error ? "border-red-500" : ""
                  }`}
                  placeholder="Describe este paso del proceso..."
                />
                {error && (
                  <span className="text-red-500 text-xs">{error.message}</span>
                )}
              </div>

              {/* IMAGEN DEL PASO */}
              <div className="w-32 flex flex-col items-center gap-2">
                <div className="relative w-full aspect-square bg-slate-100 rounded overflow-hidden border">
                  {/* Lógica de Preview: Archivo nuevo > URL existente > Placeholder */}
                  {currentStep?.newFile || currentStep?.url_imagen ? (
                    <Image
                      src={
                        currentStep.newFile instanceof File
                          ? URL.createObjectURL(currentStep.newFile)
                          : (currentStep.url_imagen as string)
                      }
                      alt="Paso"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-slate-400">
                      Sin img
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  className="text-xs w-full text-transparent file:text-slate-600 file:border-0 file:bg-slate-100 file:mr-4 file:py-1 file:px-2 file:rounded-full hover:file:bg-slate-200 cursor-pointer"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0])
                      handleFileChange(index, e.target.files[0]);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTÓN AGREGAR */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddStep}
        className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-slate-800 hover:border-slate-400"
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Nuevo Paso
      </Button>
    </div>
  );
}
