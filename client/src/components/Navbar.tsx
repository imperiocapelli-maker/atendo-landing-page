import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="text-2xl font-heading font-extrabold text-primary cursor-pointer flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-soft">
              A
            </div>
            Atendo
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#funcionalidades" className="text-foreground/80 hover:text-primary font-medium transition-colors">Funcionalidades</a>
          <a href="#planos" className="text-foreground/80 hover:text-primary font-medium transition-colors">Planos</a>
          <a href="#sobre" className="text-foreground/80 hover:text-primary font-medium transition-colors">Sobre</a>
          <Button variant="ghost" className="font-bold text-primary hover:bg-primary/10">Entrar</Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-soft hover:shadow-soft-hover transition-all transform hover:-translate-y-0.5">
            Começar Agora
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border p-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
          <a href="#funcionalidades" className="text-lg font-medium p-2 hover:bg-muted rounded-lg" onClick={() => setIsOpen(false)}>Funcionalidades</a>
          <a href="#planos" className="text-lg font-medium p-2 hover:bg-muted rounded-lg" onClick={() => setIsOpen(false)}>Planos</a>
          <a href="#sobre" className="text-lg font-medium p-2 hover:bg-muted rounded-lg" onClick={() => setIsOpen(false)}>Sobre</a>
          <div className="flex flex-col gap-2 mt-2">
            <Button variant="outline" className="w-full justify-center">Entrar</Button>
            <Button className="w-full justify-center bg-primary text-white">Começar Agora</Button>
          </div>
        </div>
      )}
    </nav>
  );
}
