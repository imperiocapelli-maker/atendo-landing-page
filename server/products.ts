/**
 * Definição de Produtos e Planos de Assinatura Stripe
 * Centralize aqui todos os produtos e preços para fácil manutenção
 */

export const STRIPE_PRODUCTS = {
  BASIC: {
    name: "Plano Básico",
    description: "Perfeito para pequenos negócios começando",
    price: 29.90,
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID || "price_basic_placeholder",
    stripeProductId: process.env.STRIPE_BASIC_PRODUCT_ID || "prod_basic_placeholder",
    billingInterval: "monthly" as const,
    features: [
      "Dashboard de Precificação",
      "Até 10 serviços",
      "Relatórios básicos",
      "Suporte por email",
    ],
  },
  PROFESSIONAL: {
    name: "Plano Profissional",
    description: "Para negócios em crescimento",
    price: 79.90,
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || "price_professional_placeholder",
    stripeProductId: process.env.STRIPE_PROFESSIONAL_PRODUCT_ID || "prod_professional_placeholder",
    billingInterval: "monthly" as const,
    features: [
      "Dashboard de Precificação avançado",
      "Serviços ilimitados",
      "Histórico de preços",
      "Análise de lucratividade",
      "Integração com WhatsApp",
      "Suporte prioritário",
    ],
  },
  ENTERPRISE: {
    name: "Plano Enterprise",
    description: "Solução completa para grandes operações",
    price: 199.90,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise_placeholder",
    stripeProductId: process.env.STRIPE_ENTERPRISE_PRODUCT_ID || "prod_enterprise_placeholder",
    billingInterval: "monthly" as const,
    features: [
      "Todos os recursos do Profissional",
      "API customizada",
      "Integração com CRM",
      "Relatórios avançados",
      "Múltiplos usuários",
      "Suporte 24/7 dedicado",
      "Consultoria de precificação",
    ],
  },
};

export const SUBSCRIPTION_PLANS = Object.entries(STRIPE_PRODUCTS).map(([key, plan]) => ({
  id: key,
  ...plan,
}));
