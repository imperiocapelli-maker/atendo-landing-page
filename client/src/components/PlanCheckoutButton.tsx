import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { getLoginUrl } from "@/const";

interface PlanCheckoutButtonProps {
  planName: "essential" | "pro" | "premium" | "scale";
  currency: string;
  language: string;
  className?: string;
  children?: React.ReactNode;
}

export default function PlanCheckoutButton({
  planName,
  currency,
  language,
  className,
  children,
}: PlanCheckoutButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const createCheckoutMutation =
    trpc.payment.createCheckoutSession.useMutation();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    setIsLoading(true);
    try {
      const currentUrl = window.location.origin;
      const result = await createCheckoutMutation.mutateAsync({
        planName,
        currency: currency as "BRL" | "ARS" | "PYG",
        language: language as "pt" | "es",
        successUrl: `${currentUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${currentUrl}/checkout/cancel`,
      });

      // Redirect to Stripe Checkout
      if (result.publishableKey) {
        // Load Stripe.js dynamically
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/";
        script.async = true;
        script.onload = () => {
          const stripe = (window as any).Stripe(result.publishableKey);
          stripe.redirectToCheckout({ sessionId: result.sessionId });
        };
        document.body.appendChild(script);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || createCheckoutMutation.isPending}
      className={className}
    >
      {isLoading || createCheckoutMutation.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        children || "Começar Agora"
      )}
    </Button>
  );
}
