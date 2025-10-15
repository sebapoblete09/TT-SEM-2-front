"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ToolsCard({
  herramientas,
}: {
  herramientas?: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Herramientas necesarias</CardTitle>
      </CardHeader>
      <CardContent>
        {herramientas?.length ? (
          <ul className="list-disc list-inside space-y-1">
            {herramientas.map((tool, i) => (
              <li key={i}>{tool}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            No se especificaron herramientas.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
