"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Skull, Upload } from "lucide-react";

// Simple schema for testing
const testSchema = z.object({
  songType: z.enum(["emotional", "corrido"]),
  email: z.string().email("Por favor, introduce un correo electrónico válido."),
  dedicatedTo: z.string().min(1, "Este campo es requerido."),
  story: z.string().min(20, "Cuéntanos más de la historia (mínimo 20 caracteres)."),
  referenceAudio: z.array(z.any()).optional(),
  inspirationImages: z.array(z.any()).optional(),
  lyricsFile: z.array(z.any()).optional(),
});

type TestFormValues = z.infer<typeof testSchema>;

export default function FileUploadTestPage() {
  const [uploadedFiles, setUploadedFiles] = useState<{
    referenceAudio: File[];
    inspirationImages: File[];
    lyricsFile: File[];
  }>({
    referenceAudio: [],
    inspirationImages: [],
    lyricsFile: [],
  });

  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      songType: "emotional",
      email: "",
      dedicatedTo: "",
      story: "",
      referenceAudio: [],
      inspirationImages: [],
      lyricsFile: [],
    },
  });

  const onSubmit = (data: TestFormValues) => {
    console.log("Form data:", data);
    console.log("Uploaded files:", uploadedFiles);
    alert("¡Formulario enviado! Revisa la consola para ver los archivos cargados.");
  };

  const songType = form.watch("songType");
  const theme = songType === "emotional" ? {
    Icon: Heart,
    title: "Crea una Canción Emocional",
    description: "Transforma tus sentimientos en una melodía que tocará el corazón.",
    cardClass: "border-pink-500/50",
  } : {
    Icon: Skull,
    title: "Forja tu Corrido",
    description: "Convierte hazañas y relatos de poder en una leyenda que resonará.",
    cardClass: "border-red-500/50",
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className={`max-w-4xl mx-auto shadow-2xl ${theme.cardClass}`}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <theme.Icon className="h-8 w-8" />
            <CardTitle className="text-3xl font-bold">{theme.title}</CardTitle>
          </div>
          <CardDescription className="text-lg">
            {theme.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Song Type Toggle */}
              <div className="flex gap-4 mb-6">
                <Button
                  type="button"
                  variant={songType === "emotional" ? "default" : "outline"}
                  onClick={() => form.setValue("songType", "emotional")}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Emocional
                </Button>
                <Button
                  type="button"
                  variant={songType === "corrido" ? "default" : "outline"}
                  onClick={() => form.setValue("songType", "corrido")}
                  className="flex items-center gap-2"
                >
                  <Skull className="h-4 w-4" />
                  Corrido
                </Button>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tu Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Para enviarte la canción final" {...field} />
                      </FormControl>
                      <FormDescription>No lo compartiremos con nadie.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dedicatedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿Para quién es la canción?</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Mi madre, Ana, mi futuro esposo..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vierte aquí tus recuerdos y emociones</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={5} 
                        placeholder="Describe vuestra historia, momentos especiales, anécdotas, lo que sientes..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>Sé lo más detallado posible para un mejor resultado.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Upload Section */}
              <div className="space-y-6 border-t pt-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Archivos de Referencia (Opcional)
                </h3>
                <div className="space-y-6">
                  
                  <FormField
                    control={form.control}
                    name="referenceAudio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audio de Referencia</FormLabel>
                        <FormControl>
                          <FileUpload
                            accept="audio/*"
                            multiple={true}
                            maxSize={25}
                            placeholder="Sube archivos de audio que inspiren tu canción"
                            onFilesChange={(files) => {
                              field.onChange(files);
                              setUploadedFiles(prev => ({ ...prev, referenceAudio: files }));
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Sube canciones que te gusten como referencia de estilo o melodía (máx. 25MB por archivo)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inspirationImages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imágenes de Inspiración</FormLabel>
                        <FormControl>
                          <FileUpload
                            accept="image/*"
                            multiple={true}
                            maxSize={10}
                            placeholder="Sube imágenes que representen el sentimiento de tu canción"
                            onFilesChange={(files) => {
                              field.onChange(files);
                              setUploadedFiles(prev => ({ ...prev, inspirationImages: files }));
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Fotos, artwork o imágenes que capturen la esencia de tu historia
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lyricsFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Archivo de Letra/Poema</FormLabel>
                        <FormControl>
                          <FileUpload
                            accept=".txt,.doc,.docx,.pdf"
                            multiple={false}
                            maxSize={5}
                            placeholder="Sube un archivo con letra o poema existente"
                            onFilesChange={(files) => {
                              field.onChange(files);
                              setUploadedFiles(prev => ({ ...prev, lyricsFile: files }));
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Si ya tienes una letra escrita o un poema que quieres convertir en canción
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Upload Summary */}
              {(uploadedFiles.referenceAudio.length > 0 || uploadedFiles.inspirationImages.length > 0 || uploadedFiles.lyricsFile.length > 0) && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Archivos cargados:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {uploadedFiles.referenceAudio.length > 0 && (
                      <li>• {uploadedFiles.referenceAudio.length} archivo(s) de audio de referencia</li>
                    )}
                    {uploadedFiles.inspirationImages.length > 0 && (
                      <li>• {uploadedFiles.inspirationImages.length} imagen(es) de inspiración</li>
                    )}
                    {uploadedFiles.lyricsFile.length > 0 && (
                      <li>• {uploadedFiles.lyricsFile.length} archivo(s) de letra/poema</li>
                    )}
                  </ul>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                Probar Funcionalidad de Carga
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}