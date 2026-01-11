import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { createCheckoutSession, PLAN_PRICES } from "../stripe";
import { getDb } from "../db";
import { orders } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const paymentRouter = router({
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        planName: z.enum(["essential", "pro", "premium", "scale"]),
        currency: z.enum(["BRL", "ARS", "PYG"]),
        language: z.enum(["pt", "es"]),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const sessionId = await createCheckoutSession({
        planName: input.planName,
        currency: input.currency,
        language: input.language,
        userId: ctx.user.id,
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
      });

      // Store order in database
      const db = await getDb();
      if (db) {
        const basePrice = PLAN_PRICES[input.planName];
        // Simple conversion (in production, use real exchange rates)
        const rates: Record<string, number> = {
          BRL: 1,
          ARS: 0.0087,
          PYG: 7.5,
        };
        const convertedPrice =
          Math.round(basePrice * (rates[input.currency] || 1) * 100) / 100;

        await db.insert(orders).values({
          userId: ctx.user.id,
          planName: input.planName,
          planPrice: basePrice.toString() as any,
          currency: input.currency,
          convertedPrice: convertedPrice.toString() as any,
          stripeSessionId: sessionId,
          status: "pending",
          language: input.language,
        });
      }

      return {
        sessionId,
        publishableKey: process.env.STRIPE_PUBLIC_KEY || "",
      };
    }),

  getOrderHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id));

    return userOrders;
  }),

  getOrderStatus: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.stripeSessionId, input.sessionId))
        .limit(1);

      if (order.length === 0) return null;
      if (order[0].userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return order[0];
    }),
});
