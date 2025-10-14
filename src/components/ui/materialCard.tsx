import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type Material = {
  id: string; // uuid
  nombre: string;
  descripcion: string;
  herramientas?: string[] | null;
  composicion?: string[] | null;
  derivado_de?: string | null;
  creador_id?: number | null;
  creado_en?: string | null;
  actualizado_en?: string | null;
};

interface MaterialCardProps {
  material: Material;
}

export function MaterialCard({ material }: MaterialCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {material.nombre}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {material.descripcion}
        </p>

        {material.composicion && material.composicion.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {material.composicion.slice(0, 3).map((comp, idx) => (
              <Badge key={idx} variant="secondary">
                {comp}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
