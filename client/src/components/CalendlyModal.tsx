import { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendlyUrl?: string;
}

export default function CalendlyModal({
  isOpen,
  onClose,
  calendlyUrl = "https://calendly.com/agendo-suporte",
}: CalendlyModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Carregar script do Calendly
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = () => {
        // Após carregar o script, reinicializar o widget
        if (window.Calendly) {
          window.Calendly.initInlineWidgets();
          setIframeLoaded(true);
        }
      };
      document.body.appendChild(script);

      return () => {
        try {
          document.body.removeChild(script);
        } catch (e) {
          // Script já foi removido
        }
      };
    }
  }, [isOpen]);

  // Reinicializar widget quando a URL muda
  useEffect(() => {
    if (isOpen && window.Calendly) {
      window.Calendly.initInlineWidgets();
    }
  }, [calendlyUrl, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] sm:max-h-[95vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Agende sua Demonstração</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0 ml-2"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-6">
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Escolha o melhor horário para uma conversa com nosso especialista. 
              Você receberá um link de videoconferência por email.
            </p>

            {/* Calendly Embed - Responsivo */}
            <div
              className="calendly-inline-widget"
              data-url={calendlyUrl}
              style={{ minHeight: "500px", width: "100%" }}
            />

            {!iframeLoaded && (
              <div className="flex items-center justify-center h-32 sm:h-48">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-2 sm:mb-4"></div>
                  <p className="text-xs sm:text-sm text-gray-600">Carregando calendário...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 sm:p-6 bg-gray-50 flex justify-end shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 sm:px-6 text-sm sm:text-base"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}

// Adicionar tipagem para window.Calendly
declare global {
  interface Window {
    Calendly: any;
  }
}
