"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RelatedMaterialsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Materiales Relacionados</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aquí aparecerán materiales con características similares.
        </p>
      </CardContent>
    </Card>
  );
}
