"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Music } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/ejemplos", label: "Ejemplos" },
    { href: "/proceso", label: "Proceso" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Music className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">DualMuse</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === link.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
           <Link href="/test-pago" passHref>
            <Button className="font-bold bg-accent-gold text-corridos-black hover:bg-accent-gold/90 transition-transform duration-300 hover:scale-105 shadow-md">
                Crear Canción
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
