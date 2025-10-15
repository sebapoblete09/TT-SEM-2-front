"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CompositionTab({
  composicion,
}: {
  composicion?: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Composición</CardTitle>
      </CardHeader>
      <CardContent>
        {composicion?.length ? (
          <ul className="list-disc list-inside space-y-1">
            {composicion.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            No se registró composición para este material.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
