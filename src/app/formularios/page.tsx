import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Skull } from 'lucide-react';
import Link from 'next/link';

export default function FormulariosPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">Elige Tu Estilo</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          Cada historia tiene su propio ritmo. ¿Cuál es el tuyo? Selecciona el tipo de canción que mejor represente tu relato para comenzar a crear.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-2 border-emotional-pink/50">
          <CardHeader>
            <Heart className="mx-auto h-12 w-12 text-emotional-pink mb-4" />
            <CardTitle className="font-headline text-3xl">Canciones Emocionales</CardTitle>
            <CardDescription className="pt-2">
              Para aniversarios, dedicatorias, recuerdos y momentos que merecen una melodía inolvidable. Transforma tus sentimientos en una balada, pop o el género que prefieras.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="bg-emotional-pink text-primary-foreground hover:bg-emotional-pink/90">
              <Link href="/test-pago?type=emotional">
                Crear Canción Emocional
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-2 border-corridos-red/50 bg-secondary text-foreground">
          <CardHeader>
            <Skull className="mx-auto h-12 w-12 text-corridos-red mb-4" />
            <CardTitle className="font-headline text-3xl">Corridos Bélicos</CardTitle>
            <CardDescription className="pt-2 text-muted-foreground">
              Para narrar hazañas, celebrar la lealtad y contar historias de poder con el ritmo y la fuerza de los corridos tumbados. Tu vida, tu corrido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="bg-corridos-red text-white hover:bg-corridos-red/90">
              <Link href="/test-pago?type=corrido">
                Crear Corrido
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
