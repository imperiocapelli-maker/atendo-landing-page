import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { subscriptionPlans, subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const subscriptionRouter = router({
  // Listar planos de assinatura
  listPlans: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const plans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, 1));
    return plans.map((plan) => {
      const price = typeof plan.price === "string" ? parseFloat(plan.price) : plan.price;
      return {
        ...plan,
        price: price, // Preços já estão em reais no banco
      };
    });
  }),

  // Obter plano específico
  getPlan: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const plan = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, input.id));
      if (!plan.length) throw new Error("Plano não encontrado");
      const price = typeof plan[0].price === "string" ? parseFloat(plan[0].price) : plan[0].price;
      return {
        ...plan[0],
        price: price, // Preços já estão em reais no banco
      };
    }),

  // Criar sessão de checkout
  createCheckoutSession: publicProcedure
    .input(z.object({ stripePriceId: z.string(), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const session = await stripe.checkout.sessions.create({
        customer_email: input.email,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: input.stripePriceId,
            quantity: 1,
          },
        ],
        success_url: `${ctx.req.headers.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.req.headers.origin}/planos?canceled=true`,
        metadata: {
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
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id));
    return paymentHistory;
  }),

  // Cancelar assinatura
  cancelSubscription: protectedProcedure
    .input(z.object({ subscriptionId: z.string() }))
    .mutation(async ({ input }) => {
      await stripe.subscriptions.update(input.subscriptionId, {
        cancel_at_period_end: true,
      });
      return { success: true };
    }),
});
