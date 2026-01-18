import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  
  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="cursor-pointer flex items-center gap-2">
            <img src="/logo-atendo.png" alt="Atendo Logo" className="h-10 w-auto" />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#funcionalidades" className="text-foreground/80 hover:text-primary font-medium transition-colors">{t("navbar.funcionalidades")}</a>
          <a href="#planos" className="text-foreground/80 hover:text-primary font-medium transition-colors">{t("navbar.planos")}</a>
          <a href="#sobre" className="text-foreground/80 hover:text-primary font-medium transition-colors">{t("navbar.sobre")}</a>
          <Button variant="ghost" className="font-bold text-primary hover:bg-primary/10">{t("navbar.entrar")}</Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-soft hover:shadow-soft-hover transition-all transform hover:-translate-y-0.5">
            {t("navbar.comecaAgora")}
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
          <a href="#funcionalidades" className="text-lg font-medium p-2 hover:bg-muted rounded-lg" onClick={() => setIsOpen(false)}>{t("navbar.funcionalidades")}</a>
          <a href="#planos" className="text-lg font-medium p-2 hover:bg-muted rounded-lg" onClick={() => setIsOpen(false)}>{t("navbar.planos")}</a>
          <a href="#sobre" className="text-lg font-medium p-2 hover:bg-muted rounded-lg" onClick={() => setIsOpen(false)}>{t("navbar.sobre")}</a>
          <div className="flex flex-col gap-2 mt-2">
            <Button variant="outline" className="w-full justify-center">{t("navbar.entrar")}</Button>
            <Button className="w-full justify-center bg-primary text-white">{t("navbar.comecaAgora")}</Button>
          </div>
        </div>
      )}
    </nav>
  );
}
