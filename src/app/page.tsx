import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Music, Heart, Skull, Cpu, Rocket, FileText, Send, CreditCard, Star, Quote, Gift, MicVocal, Building, PartyPopper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

const processSteps = [
  {
    icon: FileText,
    title: "1. Cuéntanos tu historia",
    description: "Rellena nuestro formulario con los detalles que harán tu canción única: a quién va dedicada, vuestra relación, anécdotas y el estilo que prefieres.",
  },
  {
    icon: Music,
    title: "2. Hacemos la magia",
    description: "Nuestra inteligencia artificial compone una letra y melodía que capturan la esencia de tu relato, adaptada al género que elegiste.",
  },
  {
    icon: CreditCard,
    title: "3. Realiza el pago",
    description: "Elige tu plan de entrega y realiza el pago de forma segura. Tu canción estará en camino.",
  },
  {
    icon: Send,
    title: "4. Recibe tu canción",
    description: "Recibirás un enlace para descargar tu canción en alta calidad. ¡Lista para compartir y disfrutar!",
  },
];

const useCases = [
    {
        icon: Gift,
        title: "Un Regalo Inolvidable",
        description: "Sorprende en un aniversario, cumpleaños o boda con una canción que narre vuestra historia de amor o amistad.",
        link: "/formularios?type=emotional",
    },
    {
        icon: MicVocal,
        title: "Tu Corrido Personal",
        description: "Inmortaliza tu legado, hazañas o la historia de tu familia en un corrido bélico o tumbado que imponga respeto.",
        link: "/formularios?type=corrido",
    },
    {
        icon: Building,
        title: "La Canción de tu Marca",
        description: "Crea un jingle pegadizo o un himno para tu empresa que conecte con tus clientes y refuerce tu identidad.",
        link: "/formularios",
    },
    {
        icon: PartyPopper,
        title: "Momentos Especiales",
        description: "Dale una banda sonora a una graduación, despedida, o cualquier evento que merezca ser recordado para siempre.",
        link: "/formularios?type=emotional",
    }
]

const examples = [
    {
      title: 'Rosas de Acero',
      description: 'Una balada rock sobre un amor que resiste a pesar de las dificultades.',
      type: 'Emocional',
      audioSrc: '/audio/placeholder-1.mp3',
      imageSrc: 'https://placehold.co/400x400.png',
      imageHint: 'metal rose',
    },
    {
      title: 'El Patrón de Culiacán',
      description: 'Un corrido tumbado que narra con respeto la vida de un líder.',
      type: 'Corrido',
      audioSrc: '/audio/placeholder-2.mp3',
      imageSrc: 'https://placehold.co/400x400.png',
      imageHint: 'man desert silhouette',
    },
];

const testimonials = [
  {
    name: "Ana Sofía V.",
    quote: "La canción para mi aniversario fue simplemente perfecta. Capturaron cada detalle de nuestra historia. ¡Lloré de la emoción! Mil gracias.",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "woman portrait"
  },
  {
    name: "Carlos G.",
    quote: "Pedí un corrido para el cumpleaños de mi compadre y quedó increíble. Suena profesional y la letra está con todo. 100% recomendado.",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "man portrait"
  },
   {
    name: "Laura M.",
    quote: "El servicio más original y rápido. En menos de 3 horas tenía un regalo súper especial para mi mejor amiga. Le encantó.",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "smiling woman"
  },
  {
    name: "Gerardo 'El Fuerte'",
    quote: "El corrido narra la historia de mi negocio desde cero. Suena con poder y respeto. Justo lo que quería para contar mi legado. ¡Fierro!",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "serious man portrait"
  },
  {
    name: "Marketing Digital Co.",
    quote: "El jingle que crearon para nuestra startup es increíblemente pegadizo. Nuestras métricas de marca han subido. ¡Gran inversión!",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "company logo"
  },
  {
    name: "Familia Pérez",
    quote: "Le regalamos una canción a nuestra hija por su graduación, contando sus logros. Fue el momento más emotivo de la fiesta. Invaluable.",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "happy family"
  },
  {
    name: "Familia Mendoza",
    quote: "Encargamos un corrido para mi padre, contando la historia de cómo sacó adelante a la familia. Se le salieron las lágrimas. Un trabajo de primera.",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "older man smiling"
  },
  {
    name: "Ricardo S.",
    quote: "No sabía cómo pedir perdón, y una canción fue la mejor manera de expresar mis sentimientos. Gracias por ayudarme a reconectar.",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "thoughtful man"
  },
  {
    name: "J.L. Guerrero",
    quote: "Necesitaba un corrido que sonara a los de antes, con una buena historia. Dieron en el clavo. La instrumentación y la voz, impecables.",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "man cowboy hat"
  },
  {
    name: "Elena R.",
    quote: "Pedí una canción para recordar a mi abuelo. Usaron las historias que les conté y crearon un tesoro que guardaré para siempre.",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "woman looking distance"
  },
  {
    name: "Los Novios Felices",
    quote: "Nuestra canción personalizada fue el primer baile en nuestra boda. No hubo un ojo seco en el lugar. Mágico es poco decir.",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "couple dancing"
  },
  {
    name: "Mateo B.",
    quote: "No necesitaba una ocasión especial, solo quería decirle a mi pareja lo mucho que la quiero. La canción fue un detalle espectacular.",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "man smiling"
  },
];


export default function Home() {
  return (
    <div className="flex flex-col text-foreground bg-background">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Músico componiendo en un estudio oscuro"
          fill
          className="object-cover opacity-20"
          data-ai-hint="musician studio dark"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-4 animate-fade-in-down">
            Tu Historia Hecha Canción
          </h1>
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up">
            Creamos canciones únicas y personalizadas, desde baladas emotivas hasta corridos con fuerza. Transforma tus momentos en música inolvidable.
          </p>
          <Link href="/formularios" passHref>
            <Button size="lg" className="bg-accent-gold text-accent-foreground font-bold hover:bg-accent-gold/90 transition-transform duration-300 hover:scale-105 shadow-lg animate-fade-in">
                Crear mi Canción
            </Button>
          </Link>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline text-4xl font-bold">Una Canción Para Cada Ocasión</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tu vida tiene una banda sonora. Nosotros te ayudamos a componerla.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <Link key={index} href={useCase.link} passHref legacyBehavior>
                    <a className="block transform transition-transform duration-300 hover:-translate-y-2 group h-full">
                        <Card className="bg-secondary/50 border-border/50 text-center p-6 flex flex-col items-center h-full">
                            <div className="mb-4 bg-background p-3 rounded-full border-2 border-accent-gold/30">
                                <Icon className="w-10 h-10 text-accent-gold" />
                            </div>
                            <h3 className="font-headline text-2xl font-semibold">{useCase.title}</h3>
                            <p className="mt-2 text-muted-foreground flex-grow">{useCase.description}</p>
                            <p className="mt-4 font-semibold text-accent-gold group-hover:underline">
                                Crear ahora <span aria-hidden="true">&rarr;</span>
                            </p>
                        </Card>
                    </a>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="proceso" className="py-20 sm:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline text-4xl font-bold">De tu Idea a una Canción en 4 Pasos</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Crear una canción personalizada nunca fue tan fácil.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent-gold/20 text-accent-gold mb-4 border-2 border-accent-gold/50">
                     <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-headline text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* Examples Section */}
       <section id="ejemplos" className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline text-4xl font-bold">Galería de Éxitos</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Escucha algunas de las canciones que hemos creado. Cada una cuenta una historia única, como la tuya.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {examples.map((example, index) => (
              <Card key={index} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-secondary/50 border-border/50">
                 <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4 md:p-6">
                   <Image 
                    src={example.imageSrc} 
                    alt={`Carátula de ${example.title}`} 
                    width={100} 
                    height={100} 
                    className="rounded-lg aspect-square object-cover" 
                    data-ai-hint={example.imageHint}
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <CardTitle className="font-headline text-2xl">{example.title}</CardTitle>
                    <CardDescription className="mt-1">{example.description}</CardDescription>
                    <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${example.type === 'Emocional' ? 'bg-emotional-pink text-primary-foreground' : 'bg-corridos-red text-white'}`}>
                      {example.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <audio controls className="w-full">
                    <source src={example.audioSrc} type="audio/mpeg" />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/ejemplos" passHref>
                <Button variant="outline" size="lg">Ver más ejemplos</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 sm:py-24 bg-secondary/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline text-4xl font-bold">Lo que Dicen Nuestros Clientes</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Historias reales, emociones reales.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="flex gap-8 overflow-x-auto pb-8 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory scrollbar-hide">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="snap-start flex-shrink-0 w-[90vw] sm:w-[380px]">
                <Card className="bg-background/80 border-border/50 flex flex-col justify-between h-full min-h-[240px]">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                       <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                          data-ai-hint={testimonial.avatarHint}
                        />
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <div className="flex text-accent-gold">
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                          </div>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                      <Quote className="w-8 h-8 text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-secondary/30 to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-secondary/30 to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
           <h2 className="font-headline text-4xl font-bold">¿Listo para crear tu obra maestra?</h2>
           <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            No esperes más para darle vida a tu historia. El proceso es rápido, fácil y el resultado te emocionará.
           </p>
           <Link href="/formularios" passHref>
            <Button size="lg" className="bg-accent-gold text-accent-foreground font-bold hover:bg-accent-gold/90 transition-transform duration-300 hover:scale-105 shadow-lg">
                Empezar ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
