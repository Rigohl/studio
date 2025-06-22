
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, Star, Mic2, Users, Heart, Skull, ChevronsUpDown, Check, Image as ImageIcon, Disc } from "lucide-react";
import { createSongAction } from "@/app/test-pago/actions";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";


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
  instrumentation: z.string().optional(),
  mood: z.string().optional(),
  tempo: z.string().optional(),
  structure: z.string().optional(),
  ending: z.string().optional(),
  plan: z.enum(["creator", "artist", "master"], { required_error: "Debes seleccionar un plan." }),
  famousCollaboration: z.boolean().default(false),
  styleVoice: z.string().optional(),
});

type SongCreationFormValues = z.infer<typeof songCreationSchema>;
type SongResult = { lyrics: string; audio: string; };
type FormStep = "filling" | "upsell" | "loading" | "result";
type Plan = "creator" | "artist" | "master";

const planOptions = [
    { value: "creator", label: "Creador", price: "$249", features: ["Canción completa", "Letra 100% personalizada", "1 Revisión de letra", "Calidad profesional MP3"] },
    { value: "artist", label: "Artista", price: "$499", features: ["Todo lo del Plan Creador +", "2 Revisiones de letra", "Control de Composición (Instrumentos, Tempo, Mood)", "Carátula de Álbum Digital"] },
    { value: "master", label: "Maestro", price: "$999", features: ["Todo lo del Plan Artista +", "3 Revisiones de letra", "Control Total (Estructura, Final)", "Audio WAV (Calidad Estudio)", "Pista instrumental", "Libertad para Géneros Personalizados"] },
];

const famousArtistSuggestions = {
    emotional: ["Estilo Ed Sheeran", "Estilo Adele", "Estilo Luis Miguel"],
    corrido: ["Estilo Peso Pluma", "Estilo Natanael Cano", "Estilo Chalino Sánchez"],
};

const experienceThemes = {
    emotional: {
        Icon: Heart,
        cardClass: "border-emotional-pink/50",
        title: "Crea una Canción Emocional",
        description: "Transforma tus sentimientos en una melodía que tocará el corazón.",
        dedicatedToLabel: "¿Para quién es la canción?",
        dedicatedToPlaceholder: "Ej: Mi madre, Ana, mi futuro esposo...",
        requesterLabel: "¿De parte de quién?",
        relationshipLabel: "Vuestra relación",
        relationshipPlaceholder: "Ej: Novia, mejor amigo, hijo...",
        storyLabel: "Vierte aquí tus recuerdos y emociones",
        storyPlaceholder: "Describe vuestra historia, momentos especiales, anécdotas, lo que sientes...",
        genrePlaceholder: "Ej: Balada Pop, Acústico, R&B...",
    },
    corrido: {
        Icon: Skull,
        cardClass: "border-corridos-red/50",
        title: "Forja tu Corrido",
        description: "Convierte hazañas y relatos de poder en una leyenda que resonará.",
        dedicatedToLabel: "Protagonista del Corrido",
        dedicatedToPlaceholder: "Ej: El Compa Juan, El Jefe, mi padre...",
        requesterLabel: "¿Quién encarga el corrido?",
        relationshipLabel: "Relación con el protagonista",
        relationshipPlaceholder: "Ej: Socio, admirador, familiar...",
        storyLabel: "Forja la leyenda. ¿Cuál es la hazaña?",
        storyPlaceholder: "Narra la historia de superación, lealtad, poder o el evento clave que define al protagonista.",
        genrePlaceholder: "Ej: Corrido Tumbado, Sierreño...",
    }
};

const emotionalGenres = ["Balada Pop", "Acústico", "R&B", "Cumbia Romántica", "Rock Pop"];
const corridoGenres = ["Corrido Tumbado", "Corrido Bélico", "Corrido Alterado", "Corrido Progresivo", "Sierreño", "Trap Corrido", "Norteño-Corrido", "Banda-Corrido"];

const isValidPlan = (plan: any): plan is Plan => ["creator", "artist", "master"].includes(plan);

export function SongCreationForm({ songTypeParam, planParam }: { songTypeParam: string | null, planParam: string | null }) {
  const { toast } = useToast();
  const [formStep, setFormStep] = useState<FormStep>("filling");
  const [formData, setFormData] = useState<SongCreationFormValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SongResult | null>(null);
  const [collaborationChoice, setCollaborationChoice] = useState<string>("");
  const [genrePopoverOpen, setGenrePopoverOpen] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");

  const songType = songTypeParam === 'corrido' ? 'corrido' : 'emotional';
  const theme = experienceThemes[songType];
  const genres = songType === 'corrido' ? corridoGenres : emotionalGenres;

  const form = useForm<SongCreationFormValues>({
    resolver: zodResolver(songCreationSchema),
    defaultValues: {
      songType: songType,
      plan: isValidPlan(planParam) ? planParam : "artist",
      dedicatedTo: "",
      requester: "",
      nickname: "",
      relationship: "",
      story: "",
      genre: songType === 'corrido' ? "Corrido Tumbado" : "Balada Pop",
      voice: "male",
      includeNames: false,
      keywords: "",
      referenceSong: "",
      instrumentation: "",
      mood: "",
      tempo: "",
      structure: "",
      ending: "",
      famousCollaboration: false,
      styleVoice: "",
    },
  });

  const plan = form.watch("plan");

  useEffect(() => {
    // Update song type based on URL param
    const newSongType = songTypeParam === "corrido" ? "corrido" : "emotional";
    if (form.getValues("songType") !== newSongType) {
        form.reset({
            ...form.getValues(),
            songType: newSongType,
            genre: newSongType === 'corrido' ? "Corrido Tumbado" : "Balada Pop",
            plan: isValidPlan(planParam) ? planParam : "artist",
        });
    }
    
    // Update plan based on URL param
    const newPlan = isValidPlan(planParam) ? planParam : "artist";
    if (form.getValues("plan") !== newPlan) {
        form.setValue("plan", newPlan);
    }
  }, [songTypeParam, planParam, form]);
  
  const onSubmit = (data: SongCreationFormValues) => {
    setFormData(data);
    setFormStep("upsell");
  };

  const handleFinalSubmit = async (collaboration: string | null) => {
    if (!formData) return;
    setLoading(true);
    setResult(null);
    setFormStep("loading");

    const finalData = {
        ...formData,
        famousCollaboration: !!collaboration,
        styleVoice: collaboration || "",
    };
    
    try {
      const res = await createSongAction({ ...finalData, voiceType: finalData.voice });
      if (res.lyrics && res.audio) {
        setResult(res);
        setFormStep("result");
        toast({
            title: "¡Tu canción ha sido creada!",
            description: "Escúchala a continuación y procede al pago para descargarla.",
        });
      } else {
        throw new Error(res.error || "La respuesta del servidor no fue la esperada.");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Hubo un problema con nuestro sistema de IA. Por favor, inténtalo de nuevo.";
      toast({
        title: "Error al crear la canción",
        description: errorMessage,
        variant: "destructive",
      });
      setFormStep("filling");
    } finally {
      setLoading(false);
    }
  };


  if (formStep === 'loading' || loading) {
    return (
      <Card className={cn("max-w-4xl mx-auto shadow-2xl", theme.cardClass)}>
        <CardContent className="p-8">
            <div className="text-center p-16 flex flex-col items-center justify-center space-y-4 h-[50vh]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <h2 className="font-headline text-3xl font-bold">Estamos componiendo...</h2>
                <p className="text-muted-foreground">Nuestra IA está afinando los últimos detalles de tu obra maestra. Esto puede tardar un momento.</p>
            </div>
        </CardContent>
      </Card>
    );
  }

  if (formStep === 'result' && result) {
    return (
     <Card className={cn("max-w-4xl mx-auto shadow-2xl", theme.cardClass)}>
        <CardHeader className="text-center bg-secondary/30 p-8 rounded-t-lg">
            <theme.Icon className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="font-headline text-4xl font-bold mt-4">¡Tu Canción Está Lista!</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">Escucha el resultado y prepárate para compartirla.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
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
                <Button variant="outline" onClick={() => { setResult(null); setFormStep('filling'); form.reset(); }}>Crear otra canción</Button>
            </div>
        </CardContent>
     </Card>
    );
  }

  if (formStep === 'upsell') {
    const suggestions = formData?.songType === 'corrido' ? famousArtistSuggestions.corrido : famousArtistSuggestions.emotional;
    return (
      <Card className={cn("max-w-4xl mx-auto shadow-2xl", theme.cardClass)}>
        <CardContent className="p-8">
            <div className="space-y-8 text-center animate-fade-in">
                <Star className="mx-auto h-12 w-12 text-accent-gold" />
                <h2 className="font-headline text-4xl font-bold">¿Deseas que un FAMOSO ayude a tu canción?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Por un costo adicional de <span className="font-bold text-foreground">$299</span>, podemos usar un modelo de voz avanzado para inspirarnos en el estilo de un artista famoso, dándole un toque aún más profesional.
                </p>
                
                <Card className="max-w-lg mx-auto text-left">
                    <CardHeader>
                        <CardTitle>Elige un Estilo de Voz</CardTitle>
                        <CardDescription>Selecciona una sugerencia o escribe el nombre de un artista.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map(artist => (
                                <Button key={artist} variant="outline" size="sm" onClick={() => setCollaborationChoice(artist)}>
                                    {artist}
                                </Button>
                            ))}
                        </div>
                        <Input 
                            placeholder="O escribe el nombre de un artista..."
                            value={collaborationChoice}
                            onChange={(e) => setCollaborationChoice(e.target.value)}
                        />
                         <p className="text-xs text-muted-foreground">Nos inspiraremos en el estilo vocal del artista para la interpretación.</p>
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="ghost" size="lg" onClick={() => handleFinalSubmit(null)}>
                        <Users className="mr-2 h-5 w-5" />
                        No, gracias. Usar voz estándar.
                    </Button>
                    <Button size="lg" className="bg-accent-gold text-accent-foreground hover:bg-accent-gold/90" onClick={() => handleFinalSubmit(collaborationChoice || "Voz de Famoso")}>
                        <Mic2 className="mr-2 h-5 w-5" />
                        Sí, agregar por $299 y generar
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("max-w-4xl mx-auto shadow-2xl border-2", theme.cardClass)}>
        <CardHeader className="text-center bg-secondary/30 p-8 rounded-t-lg">
            <theme.Icon className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="font-headline text-4xl md:text-5xl font-bold mt-4">{theme.title}</CardTitle>
            <CardDescription className="text-lg mt-2">
                {theme.description}
            </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-8">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control} name="songType" render={({ field }) => ( <FormItem className="hidden"><FormControl><Input {...field} /></FormControl></FormItem> )}/>
                <FormField control={form.control} name="styleVoice" render={({ field }) => ( <FormItem className="hidden"><FormControl><Input {...field} /></FormControl></FormItem> )}/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="dedicatedTo" render={({ field }) => (
                        <FormItem><FormLabel>{theme.dedicatedToLabel}</FormLabel><FormControl><Input placeholder={theme.dedicatedToPlaceholder} {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="requester" render={({ field }) => (
                        <FormItem><FormLabel>{theme.requesterLabel}</FormLabel><FormControl><Input placeholder="Tu nombre" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="nickname" render={({ field }) => (
                        <FormItem><FormLabel>Apodo (opcional)</FormLabel><FormControl><Input placeholder="Ej: Chuy, La Güera, Mi Sol" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="relationship" render={({ field }) => (
                        <FormItem><FormLabel>{theme.relationshipLabel}</FormLabel><FormControl><Input placeholder={theme.relationshipPlaceholder} {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                
                <FormField control={form.control} name="story" render={({ field }) => (
                    <FormItem><FormLabel>{theme.storyLabel}</FormLabel><FormControl><Textarea rows={5} placeholder={theme.storyPlaceholder} {...field} /></FormControl><FormDescription>Sé lo más detallado posible para un mejor resultado.</FormDescription><FormMessage /></FormItem>
                )}/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <FormField
                      control={form.control}
                      name="genre"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Género Musical</FormLabel>
                          <Popover open={genrePopoverOpen} onOpenChange={setGenrePopoverOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? field.value
                                    : "Selecciona un género..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                              <Command
                                value={genreSearch}
                                onValueChange={setGenreSearch}
                                filter={(value, search) => {
                                  if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                                  return 0;
                                }}
                              >
                                <CommandInput
                                  placeholder={plan === 'master' ? "Busca o escribe un género..." : "Busca un género..."}
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    {plan === 'master' && genreSearch.length > 0 ? (
                                      <CommandItem
                                        onSelect={() => {
                                          form.setValue("genre", genreSearch);
                                          setGenrePopoverOpen(false);
                                          setGenreSearch("");
                                        }}
                                      >
                                        <Check className="mr-2 h-4 w-4 opacity-0" />
                                        Crear: "{genreSearch}"
                                      </CommandItem>
                                    ) : (
                                      'No se encontraron resultados.'
                                    )}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {genres.map((genre) => (
                                      <CommandItem
                                        value={genre}
                                        key={genre}
                                        onSelect={(currentValue) => {
                                          form.setValue("genre", genre === currentValue ? "" : currentValue);
                                          setGenrePopoverOpen(false);
                                          setGenreSearch("");
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === genre ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {genre}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                           <FormDescription>
                             {plan === 'master'
                               ? 'Puedes elegir de la lista o escribir un género personalizado.'
                               : 'Elige un género de la lista. Plan Maestro requerido para géneros personalizados.'}
                           </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="voice" render={({ field }) => (
                        <FormItem><FormLabel>Tipo de Voz Principal</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="male">Masculina</SelectItem><SelectItem value="female">Femenina</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" disabled={plan === 'creator'} className={cn(plan === 'creator' && 'opacity-60 cursor-not-allowed')}>
                        <AccordionTrigger className="font-headline text-lg hover:no-underline">
                          Detalles Avanzados (Planes Artista y Maestro)
                        </AccordionTrigger>
                        <AccordionContent className="space-y-8 pt-4">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField control={form.control} name="instrumentation" render={({ field }) => (
                                    <FormItem><FormLabel>Instrumentación</FormLabel><FormControl><Input placeholder="Ej: Acordeón, bajo sexto, tololoche" {...field} disabled={plan === 'creator'} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="mood" render={({ field }) => (
                                    <FormItem><FormLabel>Ambiente (Mood)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={plan === 'creator'}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un ambiente" /></SelectTrigger></FormControl><SelectContent><SelectItem value="nostalgico">Nostálgico</SelectItem><SelectItem value="agresivo">Agresivo</SelectItem><SelectItem value="festivo">Festivo</SelectItem><SelectItem value="reflexivo">Reflexivo</SelectItem><SelectItem value="epico">Épico</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="tempo" render={({ field }) => (
                                    <FormItem><FormLabel>Tempo</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={plan === 'creator'}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona el tempo" /></SelectTrigger></FormControl><SelectContent><SelectItem value="lento">Lento</SelectItem><SelectItem value="medio">Medio</SelectItem><SelectItem value="rapido">Rápido</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="keywords" render={({ field }) => (
                                    <FormItem><FormLabel>Palabras Clave</FormLabel><FormControl><Input placeholder="Palabras o frases que DEBEN aparecer" {...field} disabled={plan === 'creator'} /></FormControl><FormMessage /></FormItem>
                                )}/>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t" hidden={plan !== 'master'}>
                               <p className={cn("md:col-span-2 text-sm text-muted-foreground -mb-4", plan !== 'master' && 'hidden')}>Exclusivo Plan Maestro</p>
                                <FormField control={form.control} name="structure" render={({ field }) => (
                                    <FormItem><FormLabel>Estructura de la Canción</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={plan !== 'master'}><FormControl><SelectTrigger><SelectValue placeholder="Define la estructura" /></SelectTrigger></FormControl><SelectContent><SelectItem value="clasica">Clásica (verso-coro-verso-coro)</SelectItem><SelectItem value="narrativa">Narrativa (historia lineal)</SelectItem><SelectItem value="progresiva">Progresiva (sin coro repetido)</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="ending" render={({ field }) => (
                                    <FormItem><FormLabel>Final de la Canción</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={plan !== 'master'}><FormControl><SelectTrigger><SelectValue placeholder="Elige un final" /></SelectTrigger></FormControl><SelectContent><SelectItem value="abrupto">Final abrupto</SelectItem><SelectItem value="fade-out">Fade out (desvanecido)</SelectItem><SelectItem value="epico-instrumental">Final épico con instrumentación</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )}/>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
                             <FormField control={form.control} name="referenceSong" render={({ field }) => (
                                <FormItem><FormLabel>Canción de Referencia</FormLabel><FormControl><Input placeholder="Una canción que te guste como inspiración" {...field} disabled={plan === 'creator'}/></FormControl><FormMessage /></FormItem>
                             )}/>
                              <FormField control={form.control} name="includeNames" render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 h-full justify-center"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={plan === 'creator'} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Incluir nombres</FormLabel><FormDescription>Marcar si quieres que los nombres aparezcan en la letra.</FormDescription></div></FormItem>
                              )}/>
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-headline text-lg">Elige tu Plan</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {planOptions.map(option => (
                            <FormItem key={option.value}>
                              <FormControl>
                                <RadioGroupItem value={option.value} id={option.value} className="sr-only peer" />
                              </FormControl>
                              <Label
                                htmlFor={option.value}
                                className={cn(
                                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center relative h-full",
                                    option.value === 'artist' && "border-accent-gold/50"
                                )}
                              >
                                {option.value === 'artist' && <span className="text-xs bg-accent-gold text-accent-foreground px-2 py-0.5 rounded-full absolute -top-2.5">Recomendado</span>}
                                <span className="font-bold text-lg">{option.label}</span>
                                <span className="text-2xl text-foreground font-bold my-2">{option.price}</span>
                                <ul className="space-y-2 text-xs text-muted-foreground text-left w-full">
                                    {option.features.map(feature => (
                                        <li key={feature} className="flex items-start gap-2">
                                            {feature.includes('Personalizados') ? <Wand2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> : <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />}
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                              </Label>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" size="lg" className="w-full font-bold text-lg bg-accent-gold text-accent-foreground hover:bg-accent-gold/90">
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generar mi Canción
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}

    