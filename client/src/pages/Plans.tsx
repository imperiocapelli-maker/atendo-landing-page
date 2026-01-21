import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Loader2 } from "lucide-react";

export default function Plans() {
  usePageTitle("Planos | Atendo");
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Listar planos disponíveis
  const { data: plans, isLoading: plansLoading } = trpc.subscription.listPlans.useQuery();

  // Criar sessão de checkout
  const createCheckoutMutation = trpc.subscription.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
        setSelectedPlanId(null);
        setEmail("");
      }
    },
    onError: (error) => {
      setEmailError(`Erro ao criar sessão: ${error.message}`);
    },
  });

  const validateEmail = (emailValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleSubscribe = async (planId: number) => {
    setSelectedPlanId(planId);
    setEmail("");
    setEmailError("");
  };

  const handleConfirmSubscription = async () => {
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Por favor, insira seu email");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Por favor, insira um email válido");
      return;
    }

    setLoadingPlanId(selectedPlanId);
    try {
      await createCheckoutMutation.mutateAsync({ planId: selectedPlanId!, email });
    } finally {
      setLoadingPlanId(null);
    }
  };

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Planos de Assinatura</h1>
          <p className="text-xl text-blue-100">Escolha o plano perfeito para seu negócio</p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans?.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.name.includes("Profissional") ? "ring-2 ring-primary md:scale-105" : ""
              }`}
            >
              {plan.name.includes("Profissional") && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Preço */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-primary">
                    R$ {typeof plan.price === "string" ? parseFloat(plan.price).toFixed(2) : (plan.price as number).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">por mês</p>
                </div>

                {/* Features */}
                <div className="mb-8 flex-1">
                  <p className="font-semibold mb-4">Inclui:</p>
                  <ul className="space-y-3">
                    {plan.features && typeof plan.features === "string"
                      ? JSON.parse(plan.features).map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))
                      : Array.isArray(plan.features)
                      ? plan.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))
                      : null}
                  </ul>
                </div>

                {/* Button */}
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Assinar Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Email Modal */}
      {selectedPlanId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Insira seu email</CardTitle>
              <button
                onClick={() => {
                  setSelectedPlanId(null);
                  setEmail("");
                  setEmailError("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleConfirmSubscription();
                    }
                  }}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPlanId(null);
                    setEmail("");
                    setEmailError("");
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmSubscription}
                  disabled={loadingPlanId === selectedPlanId}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {loadingPlanId === selectedPlanId ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Continuar"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Perguntas Frequentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">Como funciona o acesso após pagamento?</h3>
              <p className="text-sm text-muted-foreground">
                Após confirmar o pagamento, você receberá um email com suas credenciais de acesso. Você poderá fazer login imediatamente e começar a usar o Atendo.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Qual é a política de reembolso?</h3>
              <p className="text-sm text-muted-foreground">
                Oferecemos reembolso de 7 dias se você não estiver satisfeito. Entre em contato com nosso suporte para solicitar.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Posso mudar de plano?</h3>
              <p className="text-sm text-muted-foreground">
                Claro! Você pode fazer upgrade ou downgrade a qualquer momento. A mudança será refletida no próximo período de faturamento.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Vocês oferecem suporte?</h3>
              <p className="text-sm text-muted-foreground">
                Sim! Todos os planos incluem suporte por email. Planos Profissional e Enterprise têm suporte prioritário.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
