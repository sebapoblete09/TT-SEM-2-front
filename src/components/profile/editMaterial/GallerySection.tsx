import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditMaterialFormValues } from "@/schemas/schemas"; // Tu tipo inferido

export function GallerySection() {
  const { register, watch, setValue } =
    useFormContext<EditMaterialFormValues>();

  // 1. Observamos el estado del formulario en tiempo real
  // 'galeria' contiene las imágenes existentes cargadas en defaultValues
  const existingGallery = watch("galeria") || [];

  // 'newGalleryFiles' contiene los archivos nuevos subidos por el usuario
  const newFiles = watch("newGalleryFiles") || [];

  // Handler para input de archivos (RHF no maneja File[] nativamente bien con register directo)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convertimos FileList a Array estándar
      const filesArray = Array.from(e.target.files);
      setValue("newGalleryFiles", filesArray, { shouldValidate: true });
    }
  };

  // Handler para cancelar subida
  const handleCancelUpload = () => {
    setValue("newGalleryFiles", []);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-700 text-xl border-b pb-2">
        Galería de Imágenes
      </h3>

      {/* CONDICIONAL: Si NO hay archivos nuevos, mostramos la galería actual editable */}
      {newFiles.length === 0 ? (
        /* MODO EDICIÓN CAPTIONS */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {existingGallery.length > 0 ? (
            existingGallery.map((img, index) => (
              <div
                key={img.id || index}
                className="border p-2 rounded bg-slate-50"
              >
                <div className="relative aspect-video w-full mb-2 bg-slate-200 rounded overflow-hidden">
                  <Image
                    src={img.url_imagen}
                    alt="Galeria"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Aquí está la magia de RHF: 
                    Registramos el caption directamente a la posición del array.
                    Al escribir, se actualiza el estado del formulario automáticamente.
                */}
                <Input
                  {...register(`galeria.${index}.caption`)}
                  className="h-8 text-xs bg-white"
                  placeholder="Descripción..."
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-slate-400 italic bg-slate-50 rounded border border-dashed">
              No hay imágenes en la galería actual.
            </div>
          )}
        </div>
      ) : (
        /* MODO REEMPLAZO (Aviso visual) */
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded text-center animate-in fade-in zoom-in-95">
          Has seleccionado {newFiles.length} fotos nuevas.
          <br />
          <strong>⚠️ Se borrará toda la galería anterior</strong> y se
          reemplazarán con estas nuevas.
        </div>
      )}

      {/* INPUT PARA SUBIR ARCHIVOS */}
      <div className="mt-4 p-4 border-dashed border-2 rounded-xl bg-slate-50 text-center hover:bg-slate-100 transition-colors">
        <p className="text-sm text-slate-500 mb-2 font-medium">
          {newFiles.length === 0
            ? "Para reemplazar todas las fotos, selecciona nuevas aquí:"
            : "Cambiar selección:"}
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer"
          onChange={handleFileChange}
        />

        {newFiles.length > 0 && (
          <div className="mt-3">
            <Button
              type="button" // Importante para no hacer submit
              variant="ghost"
              size="sm"
              onClick={handleCancelUpload}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              Cancelar subida (Mantener galería actual)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
