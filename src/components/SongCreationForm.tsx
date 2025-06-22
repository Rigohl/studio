
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";

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
import { Loader2, Wand2, Star, Mic2, Users, Heart, Skull, ChevronsUpDown, Check, ImageIcon, Disc, Info, Twitter, Share2, Facebook, Download } from "lucide-react";
import { createSongAction, createAlbumArtAction, reviseSongAction } from "@/app/test-pago/actions";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";


const songCreationSchema = z.object({
  songType: z.enum(["emotional", "corrido"], { required_error: "Debes seleccionar un tipo de canción." }),
  email: z.string().email("Por favor, introduce un correo electrónico válido."),
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
  inspirationalArtist: z.string().optional(),
});

type SongCreationFormValues = z.infer<typeof songCreationSchema>;
type SongResult = { lyrics: string; audio: string; };
type FormStep = "filling" | "upsell" | "loading" | "review" | "result";
type Plan = "creator" | "artist" | "master";

const planDetails = {
    creator: { revisions: 1 },
    artist: { revisions: 2 },
    master: { revisions: 3 },
};

const planOptions = {
    emotional: [
        { value: "creator", label: "Creador", price: "$199", features: ["Canción completa y emotiva", "Letra 100% personalizada", "1 Revisión de letra", "Calidad profesional MP3"] },
        { value: "artist", label: "Artista", price: "$399", features: ["Todo lo del Plan Creador +", "2 Revisiones de letra", "Control de Composición Avanzado", "Carátula de Álbum con IA"] },
        { value: "master", label: "Maestro", price: "$799", features: ["Todo lo del Plan Artista +", "3 Revisiones de letra", "Audio WAV (Calidad Estudio)", "Pista instrumental", "Libertad para Géneros Personalizados", "Inspiración en Estilo de Artista"] },
    ],
    corrido: [
        { value: "creator", label: "El Relato", price: "$249", features: ["Corrido completo (Bélico, etc.)", "Letra que narra tu hazaña", "1 Revisión de la letra", "Calidad profesional MP3"] },
        { value: "artist", label: "La Leyenda", price: "$499", features: ["Todo lo de El Relato +", "2 Revisiones de letra y arreglos", "Control de Composición Avanzado", "Carátula de Álbum con IA"] },
        { value: "master", label: "El Patriarca", price: "$999", features: ["Todo lo de La Leyenda +", "3 Revisiones completas", "Audio WAV (Calidad Estudio)", "Pista instrumental para tus eventos", "Géneros y Fusiones personalizadas", "Inspiración en Estilo de Artista"] },
    ]
};

const famousArtistSuggestions = {
    emotional: ["Estilo Ed Sheeran", "Estilo Adele", "Estilo Luis Miguel"],
    corrido: [
        "Estilo Peso Pluma", 
        "Estilo Natanael Cano", 
        "Estilo Gerardo Ortiz", 
        "Estilo El Komander",
        "Estilo El de la Guitarra (Voz y Guitarra)",
        "Estilo Chalino Sánchez"
    ],
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
        moods: [
            { value: "melancolico", label: "Melancólico" },
            { value: "alegre", label: "Alegre" },
            { value: "apasionado", label: "Apasionado" },
            { value: "sonador", label: "Soñador" },
            { value: "inspirador", label: "Inspirador" },
        ],
        tooltips: {
            instrumentation: "Describe los instrumentos que imaginas. Ej: 'Piano y cuerdas' para una balada, 'Guitarra acústica y un beat suave' para algo pop.",
            mood: "Define la emoción principal. Esto guiará la melodía y la armonía para evocar el sentimiento correcto.",
            tempo: "Marca el pulso de tu canción. 'Lento' para una balada introspectiva, 'Medio' para un ritmo pop, o 'Rápido' para una canción enérgica.",
            structure: "Define el viaje musical. 'Clásica' (verso-coro) es ideal para un estribillo pegadizo. 'Narrativa' es perfecta para contar una historia cronológica.",
            ending: "Decide el adiós de la canción. 'Abrupto' para un corte dramático, 'Fade out' para un final suave, o 'Épico instrumental' para un clímax emocional.",
        }
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
        moods: [
            { value: "desafiante", label: "Desafiante" },
            { value: "triunfal", label: "Triunfal" },
            { value: "nostalgico", label: "Nostálgico" },
            { value: "leal", label: "Leal" },
            { value: "de-respeto", label: "De Respeto" },
        ],
        tooltips: {
            instrumentation: "Describe los instrumentos clave para el sonido del corrido. Ej: 'Acordeón, bajo sexto, tololoche'.",
            mood: "Elige el tono de la historia. Esto define si el corrido sonará como una advertencia, una celebración o un recuerdo.",
            tempo: "Define el ritmo del corrido. 'Lento' para un tono narrativo, 'Medio' para un paso firme, o 'Rápido' para una sensación de acción.",
            structure: "Define cómo se contará la hazaña. 'Clásica' (verso-coro) para un mensaje central. 'Narrativa' cuenta la historia de principio a fin, como una leyenda.",
            ending: "Elige cómo termina la leyenda. 'Abrupto' para un final impactante, 'Fade out' para un cierre que perdura, o 'Épico instrumental' para un remate de poder.",
        }
    }
};

const emotionalGenres = ["Balada Pop", "Acústico", "R&B", "Cumbia Romántica", "Rock Pop"];
const corridoGenres = ["Corrido Tumbado", "Corrido Bélico", "Corrido Alterado", "Corrido Progresivo", "Sierreño", "Trap Corrido", "Norteño-Corrido", "Banda-Corrido"];
const loadingMessages = [
    "Analizando tu historia...",
    "Consultando a los compositores de IA...",
    "Escribiendo la letra...",
    "Afinando los instrumentos virtuales...",
    "Grabando las voces...",
    "Mezclando la pista...",
    "Aplicando los toques finales...",
];

const isValidPlan = (plan: any): plan is Plan => ["creator", "artist", "master"].includes(plan);

export function SongCreationForm({ songTypeParam, planParam }: { songTypeParam: string | null, planParam: string | null }) {
  const { toast } = useToast();
  const [formStep, setFormStep] = useState<FormStep>("filling");
  const [formData, setFormData] = useState<SongCreationFormValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);
  const [result, setResult] = useState<SongResult | null>(null);
  const [albumArtUrl, setAlbumArtUrl] = useState<string | null>(null);
  const [revisionsRemaining, setRevisionsRemaining] = useState(0);
  const [revisionRequest, setRevisionRequest] = useState("");
  const [collaborationChoice, setCollaborationChoice] = useState<string>("");
  const [genrePopoverOpen, setGenrePopoverOpen] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const songType = songTypeParam === 'corrido' ? 'corrido' : 'emotional';
  const theme = experienceThemes[songType];
  const genres = songType === 'corrido' ? corridoGenres : emotionalGenres;
  const currentPlanOptions = songType === 'corrido' ? planOptions.corrido : planOptions.emotional;

  const form = useForm<SongCreationFormValues>({
    resolver: zodResolver(songCreationSchema),
    defaultValues: {
      songType: songType,
      plan: isValidPlan(planParam) ? planParam : "artist",
      email: "",
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
      inspirationalArtist: "",
    },
  });

  const plan = form.watch("plan");

  useEffect(() => {
    // This effect ensures the form values are correctly updated when URL params change
    const newSongType = songTypeParam === "corrido" ? "corrido" : "emotional";
    const newPlan = isValidPlan(planParam) ? planParam : "artist";
    if (form.getValues("songType") !== newSongType || form.getValues("plan") !== newPlan) {
        form.reset({
            ...form.getValues(),
            songType: newSongType,
            genre: newSongType === 'corrido' ? "Corrido Tumbado" : "Balada Pop",
            plan: newPlan,
        });
    }
  }, [songTypeParam, planParam, form]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
        if (audio.currentTime > 15) {
            audio.pause();
            audio.currentTime = 0;
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        }
    };
    
    const handlePlay = () => {
        audio.currentTime = 0;
        audio.removeEventListener('timeupdate', handleTimeUpdate); 
        audio.addEventListener('timeupdate', handleTimeUpdate);
    };

    audio.addEventListener('play', handlePlay);

    return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [result]);

   useEffect(() => {
      if (formStep === 'loading') {
        let i = 0;
        setCurrentLoadingMessage(loadingMessages[i]);
        const interval = setInterval(() => {
          i = (i + 1) % loadingMessages.length;
          setCurrentLoadingMessage(loadingMessages[i]);
        }, 2500);
        return () => clearInterval(interval);
      }
    }, [formStep]);

  const onSubmit = (data: SongCreationFormValues) => {
    setFormData(data);
    setFormStep("upsell");
  };

  const handleCreateSong = async (collaboration: string | null) => {
    if (!formData) return;
    
    setLoading(true);
    setResult(null);
    setAlbumArtUrl(null);

    const finalData = {
        ...formData,
        famousCollaboration: !!collaboration,
        styleVoice: collaboration || "",
    };
    setFormData(finalData);
    
    setRevisionsRemaining(planDetails[finalData.plan].revisions);
    setFormStep("loading");
    
    const isPremium = finalData.plan === 'artist' || finalData.plan === 'master';
    if (isPremium) {
        const artResult = await createAlbumArtAction({ prompt: finalData.story });
        if (artResult.imageUrl) {
            setAlbumArtUrl(artResult.imageUrl);
        } else {
            toast({ title: "Error al crear carátula", description: artResult.error, variant: "destructive" });
        }
    }

    try {
      const res = await createSongAction({ ...finalData, voiceType: finalData.voice });
      if (res.lyrics && res.audio) {
        setResult(res);
        setFormStep("review");
        toast({
            title: "¡Tu canción está lista para revisión!",
            description: "Escúchala y solicita cambios si es necesario.",
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

  const handleRevisionSubmit = async () => {
    if (!formData || !result || !revisionRequest) return;
    
    setLoading(true);
    setFormStep("loading");

    try {
      const res = await reviseSongAction({
        lyricsDraft: result.lyrics,
        requests: revisionRequest,
        songDetails: {
            ...formData,
            voiceType: formData.voice, // Ensure voiceType is passed
        },
      });

      if (res.lyrics && res.audio) {
        setResult(res);
        setRevisionsRemaining(prev => prev - 1);
        setRevisionRequest("");
        setFormStep("review");
        toast({ title: "¡Revisión completada!", description: "Aquí tienes la nueva versión de tu canción." });
      } else {
        throw new Error(res.error || "La respuesta del servidor no fue la esperada.");
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error al revisar la canción", description: String(error), variant: "destructive" });
      setFormStep("review");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadLyrics = () => {
    if (!result) return;
    const blob = new Blob([result.lyrics], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'letra-cancion.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (formStep === 'loading' || loading) {
    return (
      <Card className={cn("max-w-4xl mx-auto shadow-2xl", theme.cardClass)}>
        <CardContent className="p-8">
            <div className="text-center p-16 flex flex-col items-center justify-center space-y-4 h-[50vh]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <h2 className="font-headline text-3xl font-bold">{currentLoadingMessage}</h2>
                <p className="text-muted-foreground">La magia toma su tiempo. Estamos creando algo único para ti.</p>
                {albumArtUrl && (
                    <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">Carátula generada:</p>
                        <Image src={albumArtUrl} alt="Carátula del álbum generada" width={128} height={128} className="rounded-lg shadow-lg animate-pulse" />
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
    );
  }

  if (formStep === 'review' && result) {
    const hasRevisionsLeft = revisionsRemaining > 0;
    return (
        <Card className={cn("max-w-4xl mx-auto shadow-2xl", theme.cardClass)}>
            <CardHeader className="text-center bg-secondary/30 p-8 rounded-t-lg">
                <theme.Icon className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="font-headline text-4xl font-bold mt-4">Paso de Revisión (Cambio {planDetails[plan].revisions - revisionsRemaining + 1}/{planDetails[plan].revisions})</CardTitle>
                <CardDescription className="text-muted-foreground mt-2">Escucha un preview de 15 segundos y solicita cambios si lo necesitas.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                {albumArtUrl && (
                    <div className="flex justify-center">
                        <Image src={albumArtUrl} alt="Carátula del álbum" width={200} height={200} className="rounded-lg shadow-lg" />
                    </div>
                )}
                <div className="bg-secondary/50 p-6 rounded-lg">
                    <h3 className="font-headline text-2xl mb-4">Preview de Audio (15 seg)</h3>
                    <audio ref={audioRef} controls src={result.audio} className="w-full">
                        Tu navegador no soporta el audio.
                    </audio>
                     <p className="text-xs text-muted-foreground mt-2">El audio se detendrá a los 15 segundos. La versión final no tendrá esta limitación.</p>
                </div>
                <div className="bg-secondary/50 p-6 rounded-lg">
                    <h3 className="font-headline text-2xl mb-4">Letra Generada</h3>
                    <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed max-h-60 overflow-y-auto">{result.lyrics}</pre>
                </div>

                {hasRevisionsLeft ? (
                    <div className="bg-secondary/50 p-6 rounded-lg space-y-4">
                        <h3 className="font-headline text-2xl">Solicitar Cambios ({revisionsRemaining} restantes)</h3>
                        <Textarea 
                            placeholder="Ej: 'Cambia el coro para que mencione nuestro primer viaje.' o 'Haz el segundo verso más lento y nostálgico.'"
                            value={revisionRequest}
                            onChange={(e) => setRevisionRequest(e.target.value)}
                            rows={4}
                        />
                        <Button onClick={handleRevisionSubmit} disabled={!revisionRequest}>Enviar Revisión</Button>
                    </div>
                ) : (
                    <div className="text-center p-4 bg-yellow-900/20 rounded-md">
                        <p className="font-semibold text-yellow-300">Has utilizado todas tus revisiones.</p>
                    </div>
                )}
                
                <div className="text-center space-y-4 pt-4 border-t">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="lg" className="bg-accent-gold text-accent-foreground hover:bg-accent-gold/90 text-lg">
                                ¡Me encanta! Aceptar y Continuar
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {revisionsRemaining > 0 ? `Si aceptas la canción ahora, perderás las ${revisionsRemaining} revisiones restantes. ¿Deseas continuar?` : 'Estás a punto de aceptar la versión final de tu canción.'}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => setFormStep('result')}>Sí, continuar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
  }

  if (formStep === 'result' && result && formData) {
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = `¡He creado una canción personalizada con IA en DualMuse! Escucha mi creación: ${shareUrl}`;
    const planDetails = currentPlanOptions.find(p => p.value === formData.plan);
    const price = planDetails ? planDetails.price.replace('$', '') : '0';
    const planName = planDetails ? planDetails.label : 'N/A';
    
    return (
     <Card className={cn("max-w-4xl mx-auto shadow-2xl", theme.cardClass)}>
        <CardHeader className="text-center bg-secondary/30 p-8 rounded-t-lg">
            <theme.Icon className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="font-headline text-4xl font-bold mt-4">¡Tu Obra Maestra Final!</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">Aquí está la versión final de tu canción. ¡Lista para el mundo!</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
            {albumArtUrl && (
                <div className="flex justify-center">
                    <Image src={albumArtUrl} alt="Carátula final del álbum" width={250} height={250} className="rounded-lg shadow-2xl" />
                </div>
            )}
            <div className="bg-secondary/50 p-6 rounded-lg space-y-4">
                <h3 className="font-headline text-2xl">Audio Final</h3>
                <audio controls src={result.audio} className="w-full">
                    Tu navegador no soporta el audio.
                </audio>
                <div className="flex gap-4">
                     <Button asChild variant="outline" className="w-full">
                        <a href={result.audio} download={`dualmuse-${formData.songType}.wav`}>
                            <Download className="mr-2" />
                            Descargar Audio (.wav)
                        </a>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleDownloadLyrics}>
                        <Download className="mr-2" />
                        Descargar Letra (.txt)
                    </Button>
                </div>
            </div>
            <div className="bg-secondary/50 p-6 rounded-lg">
                <h3 className="font-headline text-2xl mb-4">Letra Final</h3>
                <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed max-h-60 overflow-y-auto">{result.lyrics}</pre>
            </div>
            <div className="text-center space-y-6">
                <div>
                    <h3 className="font-headline text-xl mb-3">Comparte tu creación</h3>
                    <div className="flex justify-center gap-4">
                        <Button asChild variant="outline" size="icon">
                            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                        </Button>
                         <Button asChild variant="outline" size="icon">
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </a>
                        </Button>
                         <Button asChild variant="outline" size="icon">
                            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" data-action="share/whatsapp/share">
                                <Share2 className="h-5 w-5" />
                                <span className="sr-only">WhatsApp</span>
                            </a>
                        </Button>
                    </div>
                </div>
                <Link href={`/confirmacion?plan=${encodeURIComponent(planName)}&price=${price}&type=${formData.songType}`} passHref>
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
                <h2 className="font-headline text-4xl font-bold">Añade una Voz de Famoso (Opcional)</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Por un costo adicional de <span className="font-bold text-foreground">$299</span>, podemos usar un modelo avanzado para inspirarnos en el <span className="font-bold text-foreground">estilo vocal</span> de un artista famoso, dándole un toque aún más distintivo y profesional.
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
                         <p className="text-xs text-muted-foreground">Nos inspiraremos en el estilo vocal del artista.</p>
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="ghost" size="lg" onClick={() => handleCreateSong(null)}>
                        <Users className="mr-2 h-5 w-5" />
                        No, gracias. Usar la voz estándar.
                    </Button>
                    <Button size="lg" className="bg-accent-gold text-accent-foreground hover:bg-accent-gold/90" onClick={() => handleCreateSong(collaborationChoice || "Estilo Famoso")}>
                        <Mic2 className="mr-2 h-5 w-5" />
                        Sí, agregar Estilo de Voz por $299
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
            <TooltipProvider>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField control={form.control} name="songType" render={({ field }) => ( <FormItem className="hidden"><FormControl><Input {...field} /></FormControl></FormItem> )}/>
                    <FormField control={form.control} name="voiceType" render={({ field }) => ( <FormItem className="hidden"><FormControl><Input {...field} /></FormControl></FormItem> )}/>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="dedicatedTo" render={({ field }) => (
                            <FormItem><FormLabel>{theme.dedicatedToLabel}</FormLabel><FormControl><Input placeholder={theme.dedicatedToPlaceholder} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="requester" render={({ field }) => (
                            <FormItem><FormLabel>{theme.requesterLabel}</FormLabel><FormControl><Input placeholder="Tu nombre" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Tu Correo Electrónico</FormLabel><FormControl><Input type="email" placeholder="Para enviarte la canción final" {...field} /></FormControl><FormDescription>No lo compartiremos con nadie.</FormDescription><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="nickname" render={({ field }) => (
                            <FormItem><FormLabel>Apodo (opcional)</FormLabel><FormControl><Input placeholder="Ej: Chuy, La Güera, Mi Sol" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>

                    <FormField control={form.control} name="relationship" render={({ field }) => (
                        <FormItem><FormLabel>{theme.relationshipLabel}</FormLabel><FormControl><Input placeholder={theme.relationshipPlaceholder} {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    
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
                                            onSelect={() => {
                                              form.setValue("genre", genre === field.value ? "" : genre);
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
                              <div className="flex items-center gap-2">
                                <Wand2 className="h-5 w-5 text-accent-gold" />
                                <span>Detalles Avanzados</span>
                                {plan !== 'creator' ? null : <span className="text-xs font-normal bg-muted text-muted-foreground px-2 py-1 rounded-full">Planes Artista y Maestro</span>}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-8 pt-4">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FormField control={form.control} name="instrumentation" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                Instrumentación
                                                <Tooltip><TooltipTrigger asChild><button type="button"><Info className="h-4 w-4 text-muted-foreground cursor-help" /></button></TooltipTrigger><TooltipContent><p className="max-w-xs">{theme.tooltips.instrumentation}</p></TooltipContent></Tooltip>
                                            </FormLabel>
                                            <FormControl><Input placeholder="Ej: Acordeón, bajo sexto, tololoche" {...field} disabled={plan === 'creator'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name="mood" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                Ambiente (Mood)
                                                <Tooltip><TooltipTrigger asChild><button type="button"><Info className="h-4 w-4 text-muted-foreground cursor-help" /></button></TooltipTrigger><TooltipContent><p className="max-w-xs">{theme.tooltips.mood}</p></TooltipContent></Tooltip>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={plan === 'creator'}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un ambiente" /></SelectTrigger></FormControl><SelectContent>
                                                {theme.moods.map(mood => <SelectItem key={mood.value} value={mood.value}>{mood.label}</SelectItem>)}
                                            </SelectContent></Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name="tempo" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                Tempo
                                                <Tooltip><TooltipTrigger asChild><button type="button"><Info className="h-4 w-4 text-muted-foreground cursor-help" /></button></TooltipTrigger><TooltipContent><p className="max-w-xs">{theme.tooltips.tempo}</p></TooltipContent></Tooltip>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={plan === 'creator'}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona el tempo" /></SelectTrigger></FormControl><SelectContent><SelectItem value="lento">Lento</SelectItem><SelectItem value="medio">Medio</SelectItem><SelectItem value="rapido">Rápido</SelectItem></SelectContent></Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name="keywords" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Palabras Clave</FormLabel>
                                            <FormControl><Input placeholder="Palabras o frases que DEBEN aparecer" {...field} disabled={plan === 'creator'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                               </div>

                               <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t", plan !== 'master' && 'hidden')}>
                                   <p className="md:col-span-3 text-sm text-muted-foreground -mb-4">Exclusivo Plan Maestro</p>
                                    <FormField control={form.control} name="inspirationalArtist" render={({ field }) => (
                                      <FormItem>
                                          <FormLabel className="flex items-center gap-2">
                                              Estilo Inspiracional
                                              <Tooltip><TooltipTrigger asChild><button type="button"><Info className="h-4 w-4 text-muted-foreground cursor-help" /></button></TooltipTrigger><TooltipContent><p className="max-w-xs">Escribe un artista como referencia. Nos inspiraremos en su estilo musical (instrumentación, arreglos, ambiente), no en su voz.</p></TooltipContent></Tooltip>
                                          </FormLabel>
                                          <FormControl><Input placeholder="Ej: Bad Bunny, Ed Sheeran, Calibre 50..." {...field} disabled={plan !== 'master'} /></FormControl>
                                          <FormMessage />
                                      </FormItem>
                                    )}/>
                                    <FormField control={form.control} name="structure" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                Estructura de la Canción
                                                <Tooltip><TooltipTrigger asChild><button type="button"><Info className="h-4 w-4 text-muted-foreground cursor-help" /></button></TooltipTrigger><TooltipContent><p className="max-w-xs">{theme.tooltips.structure}</p></TooltipContent></Tooltip>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={plan !== 'master'}><FormControl><SelectTrigger><SelectValue placeholder="Define la estructura" /></SelectTrigger></FormControl><SelectContent><SelectItem value="clasica">Clásica (verso-coro-verso-coro)</SelectItem><SelectItem value="narrativa">Narrativa (historia lineal)</SelectItem><SelectItem value="progresiva">Progresiva (sin coro repetido)</SelectItem></SelectContent></Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name="ending" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                Final de la Canción
                                                <Tooltip><TooltipTrigger asChild><button type="button"><Info className="h-4 w-4 text-muted-foreground cursor-help" /></button></TooltipTrigger><TooltipContent><p className="max-w-xs">{theme.tooltips.ending}</p></TooltipContent></Tooltip>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={plan !== 'master'}><FormControl><SelectTrigger><SelectValue placeholder="Elige un final" /></SelectTrigger></FormControl><SelectContent><SelectItem value="abrupto">Final abrupto</SelectItem><SelectItem value="fade-out">Fade out (desvanecido)</SelectItem><SelectItem value="epico-instrumental">Final épico con instrumentación</SelectItem></SelectContent></Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
                                 <FormField control={form.control} name="referenceSong" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Canción de Referencia</FormLabel>
                                        <FormControl><Input placeholder="Una canción que te guste como inspiración" {...field} disabled={plan === 'creator'}/></FormControl>
                                        <FormMessage />
                                    </FormItem>
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
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {currentPlanOptions.map(option => (
                                <FormItem key={option.value}>
                                  <FormControl>
                                    <RadioGroupItem value={option.value} id={option.value} className="sr-only peer" />
                                  </FormControl>
                                  <Label
                                    htmlFor={option.value}
                                    className={cn(
                                        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center relative h-full",
                                        option.value === 'artist' && (songType === 'emotional' ? "peer-data-[state=unchecked]:border-primary/50" : "peer-data-[state=unchecked]:border-corridos-red/50")
                                    )}
                                  >
                                    {option.value === 'artist' && <span className={cn("text-xs text-primary-foreground px-2 py-0.5 rounded-full absolute -top-2.5", songType === 'emotional' ? 'bg-primary' : 'bg-corridos-red text-white')}>Recomendado</span>}
                                    <span className="font-bold text-lg">{option.label}</span>
                                    <span className="text-2xl text-foreground font-bold my-2">{option.price}</span>
                                    <ul className="space-y-2 text-xs text-muted-foreground text-left w-full">
                                        {option.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                {feature.includes('Personalizados') || feature.includes('Fusiones') || feature.includes('Inspiración') ? <Wand2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> : feature.includes('Revisión') || feature.includes('Revisiones') ? <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> : feature.includes('Carátula') ? <ImageIcon className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> : feature.includes('Pista') ? <Disc className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> : <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />}
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                  </Label>
                                </FormItem>
                              ))}
                          </RadioGroup>
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
            </TooltipProvider>
        </CardContent>
    </Card>
  );
}
