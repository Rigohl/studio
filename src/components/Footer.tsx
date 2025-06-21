import Link from "next/link";
import { Music } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Music />
          <p className="text-center text-sm leading-loose md:text-left">
            © {new Date().getFullYear()} DualMuse. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground">Términos de Servicio</Link>
          <Link href="/privacy" className="hover:text-foreground">Política de Privacidad</Link>
        </div>
      </div>
    </footer>
  );
}
