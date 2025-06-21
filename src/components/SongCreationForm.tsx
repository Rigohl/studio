"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, Star } from "lucide-react";
import { createSongAction } from "@/app/test-pago/actions";
import { Label } from "@/components/ui/label";

const songCreationSchema = z.object({
  songType: z.enum(["emotional", "corrido"], { required_error: "Debes seleccionar un tipo de canción." }),
  dedicatedTo: z.string().min(1, "Este campo es requerido."),
  requester: z.string().min(1, "Este campo es requerido."),
  nickname: z.string().optional(),
  relationship: z.string().min(1, "Este campo es requerido."),
  story: z.string().min(20, "Cuéntanos más de la historia (mínimo 20 caracteres)."),
  genre: z.string().min(1, "El género es requerido."),
  voice: z.enum(["male", "female"], { required_error: "Debes seleccionar un tipo de voz." }),
  includeNames: z.boolean().default(false),
  keywords: z.string().optional(),
  referenceSong: z.string().optional(),
  styleVoice: z.string().optional(),
  deliveryTime: z.enum(["1h", "3h", "6h"], { required_error: "Debes seleccionar un tiempo de entrega." }),
  famousCollaboration: z.boolean().default(false),
});

type SongCreationFormValues = z.infer<typeof songCreationSchema>;
type SongResult = { lyrics: string; audio: string; };

export function SongCreationForm() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SongResult | null>(null);

  const defaultSongType = searchParams.get("type") === "corrido" ? "corrido" : "emotional";

  const form = useForm<SongCreationFormValues>({
    resolver: zodResolver(songCreationSchema),
    defaultValues: {
      songType: defaultSongType,
      dedicatedTo: "",
      requester: "",
      nickname: "",
      relationship: "",
      story: "",
      genre: defaultSongType === "emotional" ? "Balada Pop" : "Corrido Tumbado",
      voice: "male",
      includeNames: false,
      keywords: "",
      referenceSong: "",
      styleVoice: "",
      deliveryTime: "3h",
      famousCollaboration: false,
    },
  });

  async function onSubmit(data: SongCreationFormValues) {
    setLoading(true);
    setResult(null);
    try {
      const res = await createSongAction({ ...data, voiceType: data.voice });
      if (res.lyrics && res.audio) {
        setResult(res);
        toast({
            title: "¡Tu canción ha sido creada!",
            description: "Escúchala a continuación y procede al pago para descargarla.",
        });
      } else {
        throw new Error("La respuesta del servidor no fue la esperada.");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al crear la canción",
        description: "Hubo un problema con nuestro sistema de IA. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center p-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <h2 className="font-headline text-3xl font-bold">Estamos componiendo...</h2>
        <p className="text-muted-foreground">Nuestra IA está afinando los últimos detalles de tu obra maestra. Esto puede tardar un momento.</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="space-y-8">
        <div className="text-center">
            <h2 className="font-headline text-4xl font-bold">¡Tu Canción Está Lista!</h2>
            <p className="text-muted-foreground mt-2">Escucha el resultado y prepárate para compartirla.</p>
        </div>
        <div className="bg-secondary/50 p-6 rounded-lg">
            <h3 className="font-headline text-2xl mb-4">Audio</h3>
            <audio controls src={result.audio} className="w-full">
                Tu navegador no soporta el audio.
            </audio>
        </div>
        <div className="bg-secondary/50 p-6 rounded-lg">
            <h3 className="font-headline text-2xl mb-4">Letra</h3>
            <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed">{result.lyrics}</pre>
        </div>
        <div className="text-center space-y-4">
            <Link href="/confirmacion" passHref>
                <Button size="lg" className="bg-accent-gold text-accent-foreground hover:bg-accent-gold/90 text-lg">Proceder al Pago</Button>
            </Link>
            <Button variant="outline" onClick={() => { setResult(null); form.reset(); }}>Crear otra canción</Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="songType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-headline">Tipo de Canción</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el estilo principal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="emotional">Canción Emocional</SelectItem>
                  <SelectItem value="corrido">Corrido Bélico</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField control={form.control} name="dedicatedTo" render={({ field }) => (
                <FormItem><FormLabel>¿Para quién es la canción?</FormLabel><FormControl><Input placeholder="Ej: Mi madre, Juan Pérez" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="requester" render={({ field }) => (
                <FormItem><FormLabel>¿Quién la dedica?</FormLabel><FormControl><Input placeholder="Tu nombre" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="nickname" render={({ field }) => (
                <FormItem><FormLabel>Apodo (opcional)</FormLabel><FormControl><Input placeholder="Ej: Chuy, La Güera" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="relationship" render={({ field }) => (
                <FormItem><FormLabel>Parentesco o relación</FormLabel><FormControl><Input placeholder="Ej: Mejor amigo, Novia, Hermano" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        
        <FormField control={form.control} name="story" render={({ field }) => (
            <FormItem><FormLabel>Cuéntanos la historia</FormLabel><FormControl><Textarea rows={5} placeholder="Describe la historia, anécdotas, sentimientos o eventos que quieres en la canción." {...field} /></FormControl><FormDescription>Sé lo más detallado posible para un mejor resultado.</FormDescription><FormMessage /></FormItem>
        )}/>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField control={form.control} name="genre" render={({ field }) => (
                <FormItem><FormLabel>Género Musical</FormLabel><FormControl><Input placeholder="Ej: Balada Pop, Cumbia, Rock, Corrido Tumbado" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="voice" render={({ field }) => (
                <FormItem><FormLabel>Tipo de Voz Principal</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="male">Masculina</SelectItem><SelectItem value="female">Femenina</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )}/>
        </div>

        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger className="font-headline text-lg">Detalles Avanzados (Opcional)</AccordionTrigger>
                <AccordionContent className="space-y-8 pt-4">
                    <FormField control={form.control} name="keywords" render={({ field }) => (
                        <FormItem><FormLabel>Palabras Clave</FormLabel><FormControl><Input placeholder="Palabras o frases que DEBEN aparecer" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="referenceSong" render={({ field }) => (
                        <FormItem><FormLabel>Canción de Referencia</FormLabel><FormControl><Input placeholder="Una canción que te guste como inspiración" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="styleVoice" render={({ field }) => (
                        <FormItem><FormLabel>Estilo de Voz</FormLabel><FormControl><Input placeholder="Ej: Voz rasposa, similar a..., con falsete" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="includeNames" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Incluir nombres</FormLabel><FormDescription>Marcar si quieres que los nombres aparezcan en la letra.</FormDescription></div></FormItem>
                    )}/>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

        <FormField control={form.control} name="deliveryTime" render={({ field }) => (
            <FormItem className="space-y-3"><FormLabel className="font-headline text-lg">Velocidad de Entrega</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col md:flex-row gap-4">{["6h", "3h", "1h"].map(time => (<FormItem key={time} className="flex-1"><FormControl><RadioGroupItem value={time} id={time} className="sr-only peer" /><Label htmlFor={time} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"><span className="font-bold text-lg">{time}</span><span className="text-sm text-muted-foreground">{time === '6h' ? '$' : time === '3h' ? '$$' : '$$$'}</span></Label></FormControl></FormItem>))}</RadioGroup></FormControl><FormMessage /></FormItem>
        )}/>
        
        <div className="flex items-center space-x-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-accent-gold hover:text-amber-500"><Star className="w-4 h-4 mr-2" />¿Deseas que un FAMOSO ayude a tu canción?</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">Colaboración Especial</DialogTitle>
                    </DialogHeader>
                    <p className="py-4">Por un costo adicional, podemos usar un modelo de voz entrenado en un artista famoso para darle un toque aún más profesional a tu canción. ¡Imagina tu historia cantada por una estrella!</p>
                </DialogContent>
            </Dialog>
        </div>

        <Button type="submit" size="lg" className="w-full font-bold text-lg bg-accent-gold text-accent-foreground hover:bg-accent-gold/90">
          <Wand2 className="mr-2 h-5 w-5" />
          Generar mi Canción
        </Button>
      </form>
    </Form>
  );
}
