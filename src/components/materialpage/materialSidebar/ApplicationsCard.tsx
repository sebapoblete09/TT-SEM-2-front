"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ApplicationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aplicaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Próximamente se mostrarán las posibles aplicaciones del material.
        </p>
      </CardContent>
    </Card>
  );
}
