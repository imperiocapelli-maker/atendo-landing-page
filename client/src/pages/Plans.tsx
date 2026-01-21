import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Loader2 } from "lucide-react";

export default function Plans() {
  usePageTitle("Planos | Atendo");
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Listar planos disponíveis
  const { data: plans, isLoading: plansLoading } = trpc.subscription.listPlans.useQuery();

  // Criar sessão de checkout
  const createCheckoutMutation = trpc.subscription.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
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

  const handleSubscribe = async (planId: number) => {
    setEmailError("");

    // Validar email
    if (!email.trim()) {
      setEmailError("Por favor, insira seu email");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Por favor, insira um email válido");
      return;
    }

    setLoadingPlanId(planId);
    try {
      await createCheckoutMutation.mutateAsync({ planId, email });
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

      {/* Email Input Section */}
      <div className="container mx-auto px-4 py-8 bg-blue-50">
        <div className="max-w-md mx-auto">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Seu Email (para receber acesso após pagamento)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            placeholder="seu@email.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
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
                  disabled={loadingPlanId === plan.id || !email}
                  className="w-full"
                  variant={plan.name.includes("Profissional") ? "default" : "outline"}
                >
                  {loadingPlanId === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Assinar Agora"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Perguntas Frequentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como funciona o acesso após pagamento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Após confirmar o pagamento, você receberá um email com suas credenciais de acesso. Você poderá fazer login imediatamente e começar a usar o Atendo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Qual é a política de reembolso?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Oferecemos reembolso de 7 dias se você não estiver satisfeito. Entre em contato com nosso suporte para solicitar.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso mudar de plano?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Claro! Você pode fazer upgrade ou downgrade a qualquer momento. A mudança será refletida no próximo período de faturamento.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vocês oferecem suporte?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sim! Todos os planos incluem suporte por email. Planos Profissional e Enterprise têm suporte prioritário.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
