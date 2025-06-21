import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function ConfirmacionPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center p-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <CardTitle className="font-headline text-4xl font-bold mt-4">Resumen del Pedido</CardTitle>
            <CardDescription className="text-lg mt-2">
              Estás a un paso de tener tu canción. Revisa los detalles y completa el pago.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-bold">Detalles de la Canción</h3>
              <div className="flex justify-between"><span className="text-muted-foreground">Tipo:</span><span>Canción Emocional</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Para:</span><span>Mamá</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Entrega:</span><span>3 Horas</span></div>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-bold">Resumen de Pago</h3>
               <div className="flex justify-between"><span className="text-muted-foreground">Subtotal:</span><span>$XX.XX</span></div>
               <div className="flex justify-between"><span className="text-muted-foreground">IVA:</span><span>$XX.XX</span></div>
               <div className="flex justify-between font-bold text-lg"><span className="text-foreground">Total:</span><span>$XX.XX</span></div>
            </div>
            
            <Button size="lg" className="w-full text-lg font-bold bg-accent-gold text-accent-foreground hover:bg-accent-gold/90">
              Pagar con Stripe
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Serás redirigido a Stripe para completar tu compra de forma segura.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
