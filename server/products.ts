/**
 * Definição de Produtos e Planos de Assinatura Stripe
 * Centralize aqui todos os produtos e preços para fácil manutenção
 */

export const STRIPE_PRODUCTS = {
  BASIC: {
    name: "Básico",
    description: "Perfeito para começar",
    price: 99.99,
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID || "",
    stripeProductId: process.env.STRIPE_BASIC_PRODUCT_ID || "",
    billingInterval: "monthly" as const,
    features: [
      "Até 10 clientes",
      "Agendamentos básicos",
      "Relatórios simples",
      "Suporte por email",
    ],
  },
  PROFESSIONAL: {
    name: "Profissional",
    description: "Mais popular",
    price: 199.99,
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || "",
    stripeProductId: process.env.STRIPE_PROFESSIONAL_PRODUCT_ID || "",
    billingInterval: "monthly" as const,
    features: [
      "Até 100 clientes",
      "Agendamentos avançados",
      "Relatórios detalhados",
      "Precificação inteligente",
      "Suporte prioritário",
      "Integrações",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    description: "Para grandes operações",
    price: 499.99,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
    stripeProductId: process.env.STRIPE_ENTERPRISE_PRODUCT_ID || "",
    billingInterval: "monthly" as const,
    features: [
      "Clientes ilimitados",
      "Todas as funcionalidades",
      "API customizada",
      "Suporte 24/7",
      "Gerenciador dedicado",
      "Integrações ilimitadas",
    ],
  },
  SCALE: {
    name: "Scale",
    description: "Para empresas em crescimento",
    price: 399.99,
    stripePriceId: process.env.STRIPE_SCALE_PRICE_ID || "",
    stripeProductId: process.env.STRIPE_SCALE_PRODUCT_ID || "",
    billingInterval: "monthly" as const,
    features: [
      "Tudo do Premium",
      "API Customizada",
      "Integrações Ilimitadas",
      "Suporte Dedicado",
      "Treinamento Personalizado",
    ],
  },
};

export const SUBSCRIPTION_PLANS = Object.entries(STRIPE_PRODUCTS).map(([key, plan]) => ({
  id: key,
  ...plan,
}));


/**
 * Função para seed dos planos no banco de dados
 * Cria os produtos e preços no Stripe se não existirem
 */
import Stripe from "stripe";
import { getDb } from "./db";
import { subscriptionPlans } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export async function seedSubscriptionPlans() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-12-15.clover" as any,
  });

  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  console.log("🚀 Seeding subscription plans...\n");

  for (const [key, plan] of Object.entries(STRIPE_PRODUCTS)) {
    try {
      // Verificar se o plano já existe
      const existing = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.name, plan.name))
        .limit(1);

      if (existing.length > 0) {
        console.log(`✅ Plan "${plan.name}" already exists, skipping...\n`);
        continue;
      }

      console.log(`📦 Creating plan: ${plan.name}`);

      // Criar produto no Stripe
      console.log(`   → Creating Stripe product...`);
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          plan_key: key,
        },
      });
      console.log(`   ✅ Product created: ${product.id}`);

      // Criar preço no Stripe
      console.log(`   → Creating Stripe price...`);
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(plan.price * 100), // Convert to cents
        currency: "brl",
        recurring: {
          interval: "month",
          interval_count: 1,
        },
        metadata: {
          plan_key: key,
        },
      });
      console.log(`   ✅ Price created: ${price.id}`);

      // Inserir plano no banco de dados
      console.log(`   → Inserting plan into database...`);
      await db.insert(subscriptionPlans).values({
        name: plan.name,
        description: plan.description,
        price: plan.price.toString(),
        stripePriceId: price.id,
        stripeProductId: product.id,
        billingInterval: plan.billingInterval,
        features: JSON.stringify(plan.features),
        isActive: 1,
      });
      console.log(`   ✅ Plan inserted into database\n`);
    } catch (error) {
      console.error(`❌ Error creating plan "${plan.name}":`, error);
    }
  }

  console.log("✅ Seeding completed!");
}
