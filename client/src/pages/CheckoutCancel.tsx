import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Pagamento Cancelado
          </h1>
          <p className="text-gray-600">
            Você cancelou o processo de pagamento. Sua assinatura não foi
            processada.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          Se você encontrou algum problema, entre em contato com nosso suporte
          via WhatsApp.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => (window.location.href = "/#planos")}
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            Voltar aos Planos
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full"
          >
            Voltar para Home
          </Button>
        </div>
      </div>
    </div>
  );
}
