import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  mecanicas: {
    resistencia?: string;
    dureza?: string;
    elasticidad?: string;
    ductilidad?: string;
    fragilidad?: string;
  };
  perceptivas: {
    color?: string;
    brillo?: string;
    textura?: string;
    transparencia?: string;
    sensacion_termica?: string;
  };
  emocionales: {
    calidez_emocional?: string;
    inspiracion?: string;
    sostenibilidad_percibida?: string;
    armonia?: string;
    innovacion_emocional?: string;
  };
}

export default function PropertiesTab({
  mecanicas,
  perceptivas,
  emocionales,
}: Props) {
  return (
    <div className="space-y-4 mt-6">
      {/* Propiedades Mecánicas */}
      <Card>
        <CardHeader>
          <CardTitle>Propiedades Mecánicas</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            {Object.entries(mecanicas)
              .filter(([key]) => key !== "material_id")
              .map(([key, value]) => (
                <div key={key}>
                  <dt className="text-sm font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="text-lg font-semibold mt-1">
                    {value || "N/A"}
                  </dd>
                </div>
              ))}
          </dl>
        </CardContent>
      </Card>

      {/* Propiedades Perceptivas */}
      <Card>
        <CardHeader>
          <CardTitle>Propiedades Perceptivas</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            {Object.entries(perceptivas)
              .filter(([key]) => key !== "material_id")
              .map(([key, value]) => (
                <div key={key}>
                  <dt className="text-sm font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="text-lg font-semibold mt-1">
                    {value || "N/A"}
                  </dd>
                </div>
              ))}
          </dl>
        </CardContent>
      </Card>

      {/* Propiedades Emocionales */}
      <Card>
        <CardHeader>
          <CardTitle>Propiedades Emocionales</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            {Object.entries(emocionales)
              .filter(([key]) => key !== "material_id")
              .map(([key, value]) => (
                <div key={key}>
                  <dt className="text-sm font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="text-lg font-semibold mt-1">
                    {value || "N/A"}
                  </dd>
                </div>
              ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
