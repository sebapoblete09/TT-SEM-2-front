"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Material } from "@/components/ui/materialCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Download, Share2, Beaker, Wrench } from "lucide-react";
import Image from "next/image";

export default function MaterialDetailPage() {
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (!id) return;

    const fetchMaterial = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/materials/${id}`);
        if (!res.ok) {
          throw new Error(`Error al obtener el material (${res.status})`);
        }
        const data: Material = await res.json();
        setMaterial(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);

  if (loading)
    return <div className="container py-8">Cargando material...</div>;
  if (error)
    return <div className="container py-8 text-red-500">Error: {error}</div>;
  if (!material)
    return <div className="container py-8">Material no encontrado.</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* Podrías tener una categoría en tu modelo de datos */}
              <Badge className="mb-3">Biomaterial</Badge>
              <h1 className="text-4xl font-bold mb-4">{material.nombre}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {material.descripcion}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  MG
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{material.Creador.nombre}</p>
                <p className="text-muted-foreground">Investigadora Principal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Publicado:{" "}
                {new Date(material.creado_en).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {material.Colaboradores.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Colaboradores:
              </p>
              <div className="flex flex-wrap gap-2">
                {material.Colaboradores.map((colab) => (
                  <Badge key={colab.ID} variant="outline">
                    {colab.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted">
                  {material.Galeria[0]?.url_imagen && (
                    <Image
                      src={material.Galeria[0].url_imagen}
                      alt={material.nombre}
                      fill
                      className="object-cover rounded-t-lg"
                      priority
                    />
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2 p-4">
                  {material.Galeria.map((item) => (
                    <div
                      key={item.ID}
                      className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={item.url_imagen}
                        alt={item.caption || `Vista de ${material.nombre}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs for detailed information */}
            <Tabs defaultValue="recipe" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recipe">Receta</TabsTrigger>
                <TabsTrigger value="properties">Propiedades</TabsTrigger>
                <TabsTrigger value="composition">Composición</TabsTrigger>
              </TabsList>

              <TabsContent value="recipe" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Método de Preparación</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {material.Pasos.map((paso) => (
                      <div key={paso.orden_paso} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            {paso.orden_paso}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-muted-foreground leading-relaxed">
                            {paso.descripcion}
                          </p>
                          {paso.url_imagen && (
                            <div className="mt-3 relative aspect-video bg-muted rounded-lg overflow-hidden">
                              <Image
                                src={paso.url_imagen}
                                alt={`Paso ${paso.orden_paso}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="properties" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Propiedades Mecánicas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Resistencia
                        </dt>
                        <dd className="text-lg font-semibold mt-1">
                          {material.PropiedadesMecanicas.resistencia || "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Dureza
                        </dt>
                        <dd className="text-lg font-semibold mt-1">
                          {material.PropiedadesMecanicas.dureza || "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Elasticidad
                        </dt>
                        <dd className="text-lg font-semibold mt-1">
                          {material.PropiedadesMecanicas.elasticidad || "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Ductilidad
                        </dt>
                        <dd className="text-lg font-semibold mt-1">
                          {material.PropiedadesMecanicas.ductilidad || "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Fragilidad
                        </dt>
                        <dd className="text-lg font-semibold mt-1">
                          {material.PropiedadesMecanicas.fragilidad || "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Propiedades Perceptivas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Color
                        </dt>
                        <dd className="text-lg font-semibold mt-1">
                          {material.PropiedadesPerceptivas.color || "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Brillo
                        </dt>
                        <dd className="text-lg font-semibold mt-1">
                          {material.PropiedadesPerceptivas.brillo || "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Textura
                        </dt>
                        <dd className="text-lg font-semibold mt-1">
                          {material.PropiedadesPerceptivas.textura || "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Transparencia
                        </dt>
                        <dd className="text-lg font-semibold mt-1">
                          {material.PropiedadesPerceptivas.transparencia ||
                            "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Sensación Térmica
                        </dt>
                        <dd className="text-lg font-semibold mt-1">
                          {material.PropiedadesPerceptivas.sensacion_termica ||
                            "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Propiedades Emocionales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">
                        Calidez Emocional
                      </dt>
                      <dd className="text-sm leading-relaxed">
                        {material.PropiedadesEmocionales.calidez_emocional ||
                          "No especificado"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">
                        Inspiración
                      </dt>
                      <dd className="text-sm leading-relaxed">
                        {material.PropiedadesEmocionales.inspiracion ||
                          "No especificado"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">
                        Sostenibilidad Percibida
                      </dt>
                      <dd className="text-sm leading-relaxed">
                        {material.PropiedadesEmocionales
                          .sostenibilidad_percibida || "No especificado"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">
                        Armonía
                      </dt>
                      <dd className="text-sm leading-relaxed">
                        {material.PropiedadesEmocionales.armonia ||
                          "No especificado"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">
                        Innovación Emocional
                      </dt>
                      <dd className="text-sm leading-relaxed">
                        {material.PropiedadesEmocionales.innovacion_emocional ||
                          "No especificado"}
                      </dd>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="composition" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Composición</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {material.composicion.map((comp, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-4 border rounded-lg"
                        >
                          <Beaker className="h-5 w-5 text-muted-foreground" />
                          <p className="font-medium">{comp}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Herramientas Necesarias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {material.herramientas?.map((herramienta, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{herramienta}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aplicaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Empaques biodegradables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Productos desechables ecológicos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Películas protectoras</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Material educativo</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Materiales Relacionados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    name: "Bioplástico de Papa",
                    creator: "Dr. Luis Fernández",
                  },
                  { name: "Film de Almidón", creator: "Dra. Ana Torres" },
                ].map((mat, i) => (
                  <div
                    key={i}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <p className="font-medium text-sm">{mat.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mat.creator}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
