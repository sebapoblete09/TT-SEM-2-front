"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, X, ImageIcon, Video } from "lucide-react";

export default function RegisterMaterialPage() {
  const [herramientas, setHerramientas] = useState<string[]>([]);
  const [currentHerramienta, setCurrentHerramienta] = useState("");
  const [composicion, setComposicion] = useState<string[]>([]);
  const [currentComposicion, setCurrentComposicion] = useState("");
  const [colaboradores, setColaboradores] = useState<string[]>([]);
  const [currentColaborador, setCurrentColaborador] = useState("");
  const [recipeSteps, setRecipeSteps] = useState([
    {
      id: 1,
      orden_paso: 1,
      descripcion: "",
      url_imagen: null,
      url_video: null,
    },
  ]);
  const [galeriaImages, setGaleriaImages] = useState<
    Array<{ url_imagen: string; caption: string }>
  >([]);

  const addHerramienta = () => {
    if (
      currentHerramienta.trim() &&
      !herramientas.includes(currentHerramienta.trim())
    ) {
      setHerramientas([...herramientas, currentHerramienta.trim()]);
      setCurrentHerramienta("");
    }
  };

  const removeHerramienta = (herramienta: string) => {
    setHerramientas(herramientas.filter((h) => h !== herramienta));
  };

  const addComposicion = () => {
    if (
      currentComposicion.trim() &&
      !composicion.includes(currentComposicion.trim())
    ) {
      setComposicion([...composicion, currentComposicion.trim()]);
      setCurrentComposicion("");
    }
  };

  const removeComposicion = (comp: string) => {
    setComposicion(composicion.filter((c) => c !== comp));
  };

  const addColaborador = () => {
    if (
      currentColaborador.trim() &&
      !colaboradores.includes(currentColaborador.trim())
    ) {
      setColaboradores([...colaboradores, currentColaborador.trim()]);
      setCurrentColaborador("");
    }
  };

  const removeColaborador = (colab: string) => {
    setColaboradores(colaboradores.filter((c) => c !== colab));
  };

  const addRecipeStep = () => {
    const newOrden = recipeSteps.length + 1;
    setRecipeSteps([
      ...recipeSteps,
      {
        id: newOrden,
        orden_paso: newOrden,
        descripcion: "",
        url_imagen: null,
        url_video: null,
      },
    ]);
  };

  const removeRecipeStep = (id: number) => {
    setRecipeSteps(recipeSteps.filter((step) => step.id !== id));
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Registrar Nuevo Biomaterial
          </h1>
          <p className="text-muted-foreground text-lg">
            Comparte tu investigación con la comunidad UTEM
          </p>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="properties">Propiedades</TabsTrigger>
            <TabsTrigger value="composition">Composición</TabsTrigger>
            <TabsTrigger value="recipe">Receta</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>
                  Proporciona los detalles fundamentales de tu biomaterial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Material *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Bioplástico de Almidón de Maíz"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe las características principales y aplicaciones potenciales de tu biomaterial..."
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Herramientas Necesarias</Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentHerramienta}
                      onChange={(e) => setCurrentHerramienta(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addHerramienta())
                      }
                      placeholder="Ej: Olla, Espátula, Termómetro..."
                    />
                    <Button
                      type="button"
                      onClick={addHerramienta}
                      variant="secondary"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {herramientas.map((herramienta) => (
                      <Badge
                        key={herramienta}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {herramienta}
                        <button
                          onClick={() => removeHerramienta(herramienta)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="derivado_de">Derivado de (Opcional)</Label>
                  <Input
                    id="derivado_de"
                    placeholder="ID del material base si este es una variación"
                  />
                  <p className="text-xs text-muted-foreground">
                    Si este material es una variación de otro existente, ingresa
                    su ID
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Colaboradores</Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentColaborador}
                      onChange={(e) => setCurrentColaborador(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addColaborador())
                      }
                      placeholder="Email del colaborador..."
                    />
                    <Button
                      type="button"
                      onClick={addColaborador}
                      variant="secondary"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {colaboradores.map((colab) => (
                      <Badge
                        key={colab}
                        variant="outline"
                        className="px-3 py-1"
                      >
                        {colab}
                        <button
                          onClick={() => removeColaborador(colab)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Galería de Imágenes *</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arrastra imágenes aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG hasta 10MB (mínimo 3 imágenes)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Propiedades Mecánicas</CardTitle>
                <CardDescription>
                  Define las características físicas del material
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resistencia">Resistencia</Label>
                    <Input id="resistencia" placeholder="Ej: Alta, 50 MPa" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dureza">Dureza</Label>
                    <Input id="dureza" placeholder="Ej: Media, 70 Shore A" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="elasticidad">Elasticidad</Label>
                    <Input
                      id="elasticidad"
                      placeholder="Ej: Flexible, 200% elongación"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ductilidad">Ductilidad</Label>
                    <Input id="ductilidad" placeholder="Ej: Alta, Baja" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fragilidad">Fragilidad</Label>
                    <Input id="fragilidad" placeholder="Ej: Baja, Media" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Propiedades Perceptivas</CardTitle>
                <CardDescription>
                  Características sensoriales del material
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      placeholder="Ej: Beige natural, Translúcido"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brillo">Brillo</Label>
                    <Input
                      id="brillo"
                      placeholder="Ej: Mate, Satinado, Brillante"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textura">Textura</Label>
                    <Input id="textura" placeholder="Ej: Suave, Rugosa, Lisa" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transparencia">Transparencia</Label>
                    <Input
                      id="transparencia"
                      placeholder="Ej: Opaco, Translúcido, Transparente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sensacion_termica">Sensación Térmica</Label>
                    <Input
                      id="sensacion_termica"
                      placeholder="Ej: Cálido, Frío, Neutro"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Propiedades Emocionales</CardTitle>
                <CardDescription>
                  Aspectos emocionales y perceptuales del material
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="calidez_emocional">Calidez Emocional</Label>
                  <Textarea
                    id="calidez_emocional"
                    placeholder="Describe la sensación de calidez que transmite el material..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspiracion">Inspiración</Label>
                  <Textarea
                    id="inspiracion"
                    placeholder="¿Qué inspiró el desarrollo de este material?"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sostenibilidad_percibida">
                    Sostenibilidad Percibida
                  </Label>
                  <Textarea
                    id="sostenibilidad_percibida"
                    placeholder="Cómo se percibe la sostenibilidad del material..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="armonia">Armonía</Label>
                  <Textarea
                    id="armonia"
                    placeholder="Describe la armonía visual y táctil del material..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="innovacion_emocional">
                    Innovación Emocional
                  </Label>
                  <Textarea
                    id="innovacion_emocional"
                    placeholder="Aspectos innovadores desde una perspectiva emocional..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Composition Tab */}
          <TabsContent value="composition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Composición del Material</CardTitle>
                <CardDescription>
                  Lista los componentes principales del biomaterial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Componentes</Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentComposicion}
                      onChange={(e) => setCurrentComposicion(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addComposicion())
                      }
                      placeholder="Ej: 100g Almidón de maíz (50%)"
                    />
                    <Button
                      type="button"
                      onClick={addComposicion}
                      variant="secondary"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ingresa cada componente con su cantidad y porcentaje
                  </p>
                  <div className="space-y-2 mt-3">
                    {composicion.map((comp, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <span className="text-sm">{comp}</span>
                        <button
                          onClick={() => removeComposicion(comp)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recipe Tab */}
          <TabsContent value="recipe" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Método / Receta</CardTitle>
                <CardDescription>
                  Documenta el proceso paso a paso para crear el biomaterial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recipeSteps.map((step) => (
                  <div
                    key={step.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Paso {step.orden_paso}</h4>
                      {recipeSteps.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRecipeStep(step.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Descripción del Paso</Label>
                      <Textarea
                        placeholder="Describe detalladamente este paso del proceso..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Imagen del Paso (Opcional)</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                          <ImageIcon className="h-6 w-6 mx-auto text-muted-foreground" />
                          <p className="text-xs text-muted-foreground mt-2">
                            Subir imagen
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Video del Paso (Opcional)</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                          <Video className="h-6 w-6 mx-auto text-muted-foreground" />
                          <p className="text-xs text-muted-foreground mt-2">
                            Subir video
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={addRecipeStep}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Paso
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" size="lg">
            Guardar Borrador
          </Button>
          <Button size="lg" className="bg-primary">
            Publicar Material
          </Button>
        </div>
      </div>
    </div>
  );
}
