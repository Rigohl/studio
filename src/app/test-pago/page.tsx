import { SongCreationForm } from "@/components/SongCreationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestPagoPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-2 border-accent-gold/20">
          <CardHeader className="text-center bg-gray-50/50 p-8 rounded-t-lg">
            <CardTitle className="font-headline text-4xl md:text-5xl font-bold">Crea Tu Canción Única</CardTitle>
            <CardDescription className="text-lg mt-2">
              Rellena los campos y deja que nuestra IA transforme tu historia en música.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <SongCreationForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
