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
  calendlyUrl = "https://calendly.com/seu-usuario/demo",
}: CalendlyModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Carregar script do Calendly
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Agende sua Demonstração</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Escolha o melhor horário para uma conversa com nosso especialista. 
              Você receberá um link de videoconferência por email.
            </p>

            {/* Calendly Embed */}
            <div
              className="calendly-inline-widget"
              data-url={calendlyUrl}
              style={{ minHeight: "600px" }}
            />

            {!iframeLoaded && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando calendário...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
