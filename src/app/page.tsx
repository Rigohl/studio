import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Music, Heart, Skull } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="group relative w-full h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 transition-all duration-700 ease-in-out">
          <div className="bg-gradient-to-br from-emotional-pink via-white to-emotional-mint transition-all duration-700 ease-in-out group-hover:scale-105 flex flex-col justify-center items-center p-8 text-center text-corridos-black">
            <Heart className="w-24 h-24 mb-4 text-white drop-shadow-lg" />
            <h1 className="font-headline text-5xl md:text-7xl font-bold mb-4">Canciones Emocionales</h1>
            <p className="font-body text-lg max-w-md mb-8">Transforma tus historias en melodías que tocan el alma. Perfectas para dedicar y recordar.</p>
            <Link href="/test-pago?type=emotional" passHref>
              <Button size="lg" className="bg-white text-emotional-pink font-bold hover:bg-white/90 transition-transform duration-300 hover:scale-105 shadow-lg">Crear Canción Emocional</Button>
            </Link>
          </div>
          <div className="bg-gradient-to-tr from-corridos-black via-zinc-800 to-corridos-red transition-all duration-700 ease-in-out group-hover:scale-105 flex flex-col justify-center items-center p-8 text-center text-white">
            <Skull className="w-24 h-24 mb-4 drop-shadow-lg" />
            <h1 className="font-headline text-5xl md:text-7xl font-bold mb-4">Corridos Bélicos</h1>
            <p className="font-body text-lg max-w-md mb-8">Narra tus hazañas y vivencias con la fuerza y el estilo de un corrido tumbado.</p>
            <Link href="/test-pago?type=corrido" passHref>
              <Button size="lg" className="bg-white text-corridos-red font-bold hover:bg-white/90 transition-transform duration-300 hover:scale-105 shadow-lg">Crear Corrido</Button>
            </Link>
          </div>
        </div>
        <div className="absolute w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-accent-gold group-hover:scale-110 transition-transform duration-300 ease-in-out">
          <Music className="w-8 h-8 text-accent-gold" />
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-4xl font-bold mb-4">Tu Música, Tu Historia</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              En DualMuse, combinamos tus emociones y relatos con inteligencia artificial de vanguardia para crear piezas musicales únicas. Ya sea una balada que toque el corazón o un corrido que narre tu poder, nosotros le ponemos la música.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/ejemplos" passHref>
                <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="font-headline">Ejemplos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Escucha canciones creadas por nuestra IA y encuentra tu inspiración.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/proceso" passHref>
                <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="font-headline">Nuestro Proceso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Descubre lo fácil que es crear tu canción en solo 4 simples pasos.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/test-pago" passHref>
                <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="font-headline">Crea tu Canción</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Rellena nuestro formulario y deja que la magia de la IA haga el resto.</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
        </div>
      </section>
    </div>
  );
}
