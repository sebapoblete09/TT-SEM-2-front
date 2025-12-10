import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { galeriaItem } from "@/types/materials"; // Importa tu tipo original

interface Props {
  originalGallery: galeriaItem[];
  captions: string[];
  setCaptions: (v: string[]) => void;
  newFiles: File[];
  setNewFiles: (v: File[]) => void;
}

export function GallerySection({
  originalGallery,
  captions,
  setCaptions,
  newFiles,
  setNewFiles,
}: Props) {
  const handleCaptionChange = (index: number, val: string) => {
    const newCaptions = [...captions];
    newCaptions[index] = val;
    setCaptions(newCaptions);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-700 text-xl border-b pb-2">
        Galería de Imágenes
      </h3>

      {newFiles.length === 0 ? (
        /* MODO EDICIÓN CAPTIONS */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {originalGallery?.map((img, i) => (
            <div key={img.ID} className="border p-2 rounded bg-slate-50">
              <div className="relative aspect-video w-full mb-2 bg-slate-200 rounded overflow-hidden">
                <Image
                  src={img.url_imagen}
                  alt="Galeria"
                  fill
                  className="object-cover"
                />
              </div>
              <Input
                className="h-8 text-xs"
                placeholder="Descripción..."
                value={captions[i]}
                onChange={(e) => handleCaptionChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>
      ) : (
        /* MODO REEMPLAZO */
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded text-center">
          Has seleccionado {newFiles.length} fotos nuevas.
          <strong> Se borrará la galería anterior</strong> y se subirán estas
          nuevas.
        </div>
      )}

      {/* INPUT ARCHIVOS */}
      <div className="mt-4 p-4 border-dashed border-2 rounded-xl bg-slate-50 text-center">
        <p className="text-sm text-slate-500 mb-2">
          {newFiles.length === 0
            ? "Para reemplazar todas las fotos, selecciona nuevas aquí:"
            : "Cambiar selección:"}
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) setNewFiles(Array.from(e.target.files));
          }}
        />
        {newFiles.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNewFiles([])}
            className="mt-2 text-red-500"
          >
            Cancelar subida (Mantener galería actual)
          </Button>
        )}
      </div>
    </div>
  );
}
