import Stripe from "stripe";
import { ENV } from "./_core/env";

// Initialize Stripe client
let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
}

// Plan pricing in BRL (base currency)
export const PLAN_PRICES = {
  essential: 89,
  pro: 149,
  premium: 249,
  scale: 399,
} as const;

// Exchange rates (update these based on real rates or fetch from API)
export const EXCHANGE_RATES = {
  BRL: 1,
  ARS: 0.0087, // 1 BRL = 0.0087 ARS (approximate)
  PYG: 7.5, // 1 BRL = 7.5 PYG (approximate)
} as const;

export function convertPrice(
  priceInBRL: number,
  targetCurrency: string
): number {
  const rate = EXCHANGE_RATES[targetCurrency as keyof typeof EXCHANGE_RATES];
  if (!rate) {
    throw new Error(`Unsupported currency: ${targetCurrency}`);
  }
  return Math.round(priceInBRL * rate * 100) / 100;
}

export interface CreateCheckoutSessionParams {
  planName: keyof typeof PLAN_PRICES;
  currency: string;
  language: string;
  userId: number;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<string> {
  const stripe = getStripeClient();
  const basePrice = PLAN_PRICES[params.planName];
  const convertedPrice = convertPrice(basePrice, params.currency);

  // Convert to cents for Stripe
  const amountInCents = Math.round(convertedPrice * 100);

  // Map currency to Stripe currency code
  const stripeCurrency = params.currency.toLowerCase();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: stripeCurrency,
          product_data: {
            name: `Atendo - Plano ${params.planName.charAt(0).toUpperCase() + params.planName.slice(1)}`,
            description: `Acesso ao sistema Atendo por 1 mês`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    locale: params.language === "es" ? "es" : "pt-BR",
    client_reference_id: `user-${params.userId}-${params.planName}`,
    metadata: {
      userId: params.userId.toString(),
      planName: params.planName,
      originalCurrency: "BRL",
      originalPrice: basePrice.toString(),
      targetCurrency: params.currency,
      language: params.language,
    },
  });

  if (!session.id) {
    throw new Error("Failed to create Stripe checkout session");
  }

  return session.id;
}

export async function retrieveSession(sessionId: string) {
  const stripe = getStripeClient();
  return stripe.checkout.sessions.retrieve(sessionId);
}

export async function handleWebhookEvent(
  event: Stripe.Event
): Promise<{ success: boolean; message: string }> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        success: true,
        message: `Payment completed for session ${session.id}`,
      };
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        success: true,
        message: `Session expired: ${session.id}`,
      };
    }
    default:
      return {
        success: true,
        message: `Unhandled event type: ${event.type}`,
      };
  }
}
