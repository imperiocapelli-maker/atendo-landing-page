import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface PlanCheckoutButtonProps {
  planName: "essential" | "pro" | "premium" | "scale";
  currency?: string;
  language?: string;
  className?: string;
  children?: React.ReactNode;
}

// Mapeamento de nomes da Home para nomes reais dos planos
const planNameMap: Record<string, string> = {
  essential: "Básico",
  pro: "Profissional",
  premium: "Enterprise",
  scale: "Enterprise", // Scale é para contato direto
};

export default function PlanCheckoutButton({
  planName,
  currency,
  language,
  className,
  children,
}: PlanCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [planId, setPlanId] = useState<number | null>(null);

  // Buscar planos para encontrar o ID correto
  const { data: plans } = trpc.subscription.listPlans.useQuery();

  useEffect(() => {
    if (plans && planName !== "scale") {
      const realPlanName = planNameMap[planName];
      const plan = plans.find((p) => p.name === realPlanName);
      if (plan) {
        setPlanId(plan.id);
      }
    }
  }, [plans, planName]);

  const createCheckoutMutation = trpc.subscription.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
        setShowEmailModal(false);
        setEmail("");
      }
    },
    onError: (error) => {
      alert(`Erro ao criar sessão: ${error.message}`);
    },
  });

  const validateEmail = (emailValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleCheckout = () => {
    // Para o plano Scale, abrir contato direto em vez de checkout
    if (planName === "scale") {
      window.open("mailto:contato@atendo.com?subject=Quero%20contratar%20o%20plano%20Scale", "_blank");
      return;
    }
    setShowEmailModal(true);
  };

  const handleConfirmCheckout = async () => {
    if (!email.trim()) {
      alert("Por favor, insira seu email");
      return;
    }

    if (!validateEmail(email)) {
      alert("Por favor, insira um email válido");
      return;
    }

    if (!planId) {
      alert("Plano não encontrado");
      return;
    }

    setIsLoading(true);
    try {
      await createCheckoutMutation.mutateAsync({ planId, email });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleCheckout}
        disabled={isLoading || createCheckoutMutation.isPending || (planName !== "scale" && !planId)}
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

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Insira seu email</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleConfirmCheckout();
                }
              }}
              placeholder="seu@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEmailModal(false);
                  setEmail("");
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmCheckout}
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Continuar"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
