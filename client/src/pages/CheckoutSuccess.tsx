import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRoute } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

export default function CheckoutSuccess() {
  const [, params] = useRoute("/checkout/success?session_id=:sessionId");
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getOrderStatusQuery = trpc.payment.getOrderStatus.useQuery(
    { sessionId: params?.sessionId || "" },
    { enabled: !!params?.sessionId }
  );

  useEffect(() => {
    if (getOrderStatusQuery.data) {
      setOrderStatus(getOrderStatusQuery.data);
      setIsLoading(false);
    }
  }, [getOrderStatusQuery.data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Pagamento Realizado!
          </h1>
          <p className="text-gray-600">
            Sua assinatura ao plano{" "}
            <strong>{orderStatus?.planName.toUpperCase()}</strong> foi ativada com
            sucesso.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">Plano:</span>
            <span className="font-semibold">{orderStatus?.planName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Valor:</span>
            <span className="font-semibold">
              {orderStatus?.currency} {orderStatus?.convertedPrice}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-semibold text-green-600">
              {orderStatus?.status}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Um email de confirmação foi enviado para seu endereço de email
          registrado.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            Voltar para Home
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/dashboard")}
            className="w-full"
          >
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
