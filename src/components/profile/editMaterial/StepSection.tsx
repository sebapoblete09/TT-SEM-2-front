import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"; // Asumiendo shadcn
import { Plus, Trash2 } from "lucide-react";

export interface StepWithFile {
  orden_paso: number;
  descripcion: string;
  url_imagen?: string;
  newFile: File | null;
}

interface Props {
  steps: StepWithFile[];
  onStepChange: (index: number, val: string) => void;
  onStepFile: (index: number, file: File) => void;
  // NUEVAS FUNCIONES
  onAddStep: () => void;
  onRemoveStep: (index: number) => void;
}

export function StepsSection({
  steps,
  onStepChange,
  onStepFile,
  onAddStep,
  onRemoveStep,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-semibold text-slate-700 text-xl">Receta / Pasos</h3>
        <span className="text-xs text-slate-400">
          {steps.length} pasos configurados
        </span>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 border rounded-lg bg-white relative group"
          >
            {/* NUMERACIÓN */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm bg-slate-100 px-2 py-1 rounded">
                  Paso {index + 1}
                </span>

                {/* BOTÓN ELIMINAR (Solo visible si hay más de 1 paso o opcional siempre) */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveStep(index)}
                  className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Eliminar este paso"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <Textarea
                className="w-full bg-slate-50 focus:bg-white transition-colors"
                placeholder="Describe este paso del proceso..."
                value={step.descripcion}
                onChange={(e) => onStepChange(index, e.target.value)}
              />
            </div>

            {/* IMAGEN DEL PASO */}
            <div className="w-32 flex flex-col items-center gap-2">
              <div className="relative w-full aspect-square bg-slate-100 rounded overflow-hidden border">
                {step.newFile || step.url_imagen ? (
                  <Image
                    src={
                      step.newFile
                        ? URL.createObjectURL(step.newFile)
                        : step.url_imagen!
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
                  if (e.target.files?.[0]) onStepFile(index, e.target.files[0]);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* BOTÓN AGREGAR */}
      <Button
        type="button" // Importante para no enviar el form
        variant="outline"
        onClick={onAddStep}
        className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-slate-800 hover:border-slate-400"
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Nuevo Paso
      </Button>
    </div>
  );
}
