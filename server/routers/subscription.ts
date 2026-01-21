import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { subscriptions, subscriptionPlans, payments } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import Stripe from "stripe";
import { SUBSCRIPTION_PLANS } from "../products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export const subscriptionRouter = router({
  // Listar todos os planos de assinatura disponíveis
  listPlans: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const plans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, 1));
    return plans.map((plan: typeof subscriptionPlans.$inferSelect) => ({
      ...plan,
      features: plan.features ? JSON.parse(plan.features) : [],
    }));
  }),

  // Obter plano específico
  getPlan: publicProcedure.input(z.number()).query(async ({ input: planId }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const plan = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, planId));
    if (!plan.length) throw new Error("Plano não encontrado");
    return {
      ...plan[0],
      features: plan[0].features ? JSON.parse(plan[0].features) : [],
    };
  }),

  // Obter assinatura atual do usuário
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (!subscription.length) return null;

    const plan = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.id, subscription[0].planId));

    return {
      ...subscription[0],
      plan: plan[0],
    };
  }),

  // Criar sessão de checkout para assinatura (público - sem requerer login)
  createCheckoutSession: publicProcedure
    .input(z.object({ planId: z.number(), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const plan = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, input.planId));
      if (!plan.length) throw new Error("Plano não encontrado");

      const session = await stripe.checkout.sessions.create({
        customer_email: input.email,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: plan[0].stripePriceId,
            quantity: 1,
          },
        ],
        success_url: `${ctx.req.headers.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.req.headers.origin}/planos?canceled=true`,
        metadata: {
          plan_id: input.planId.toString(),
          customer_email: input.email,
        },
        allow_promotion_codes: true,
      });

      return {
        checkoutUrl: session.url,
        sessionId: session.id,
      };
    }),

  // Listar histórico de pagamentos do usuário
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const paymentHistory = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, ctx.user.id));

    return paymentHistory.sort((a: typeof payments.$inferSelect, b: typeof payments.$inferSelect) => b.createdAt.getTime() - a.createdAt.getTime());
  }),

  // Cancelar assinatura
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (!subscription.length) throw new Error("Nenhuma assinatura ativa encontrada");

    const stripeSubscription = await stripe.subscriptions.cancel(subscription[0].stripeSubscriptionId);

    await db
      .update(subscriptions)
      .set({
        status: "canceled",
        canceledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription[0].id));

    return {
      success: true,
      message: "Assinatura cancelada com sucesso",
    };
  }),

  // Obter status de pagamento (para verificar após checkout)
  getPaymentStatus: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      return {
        status: session.payment_status,
        subscriptionId: session.subscription,
      };
    }),
});
