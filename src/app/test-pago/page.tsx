"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SongCreationForm } from "@/components/SongCreationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

function TestPagoFormLoader() {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <h2 className="font-headline text-3xl font-bold">Cargando formulario...</h2>
                <p className="text-muted-foreground">Preparando el estudio de creación.</p>
            </div>
        </div>
    )
}

function TestPagoForm() {
  const searchParams = useSearchParams();
  const songType = searchParams.get("type");

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-2 border-accent-gold/20">
          <CardHeader className="text-center bg-secondary/30 p-8 rounded-t-lg">
            <CardTitle className="font-headline text-4xl md:text-5xl font-bold">Crea Tu Canción Única</CardTitle>
            <CardDescription className="text-lg mt-2">
              Rellena los campos y deja que nuestra IA transforme tu historia en música.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <SongCreationForm songTypeParam={songType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function TestPagoPage() {
  return (
    <Suspense fallback={<TestPagoFormLoader />}>
      <TestPagoForm />
    </Suspense>
  );
}
