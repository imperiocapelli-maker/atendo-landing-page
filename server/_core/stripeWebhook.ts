import Stripe from "stripe";
import { Request, Response } from "express";
import { getDb } from "../db";
import { subscriptions, payments, subscriptionPlans } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // Detectar eventos de teste
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  try {
    const db = await getDb();
    if (!db) {
      console.error("[Webhook] Database not available");
      return res.status(500).json({ error: "Database not available" });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[Webhook] Checkout session completed:", session.id);

        const userId = parseInt((session as any).metadata?.user_id || "0");
        const planId = parseInt((session as any).metadata?.plan_id || "0");

        if (!userId || !planId) {
          console.error("[Webhook] Missing userId or planId in metadata");
          return res.status(400).json({ error: "Missing metadata" });
        }

        // Criar/atualizar assinatura
        const existingSubscription = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, userId));

        if (existingSubscription.length > 0) {
          // Atualizar assinatura existente
          await db
            .update(subscriptions)
            .set({
              planId,
              status: "active",
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, existingSubscription[0].id));
        } else {
          // Criar nova assinatura
          await db.insert(subscriptions).values({
            userId,
            planId,
            stripeCustomerId: (session as any).customer as string,
            stripeSubscriptionId: (session as any).subscription as string,
            status: "active",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          });
        }

        console.log("[Webhook] Subscription created/updated for user:", userId);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("[Webhook] Invoice paid:", invoice.id);

        // Registrar pagamento
        if ((invoice as any).subscription) {
          const subscription = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.stripeSubscriptionId, (invoice as any).subscription as string));

          if (subscription.length > 0) {
            const plan = await db
              .select()
              .from(subscriptionPlans)
              .where(eq(subscriptionPlans.id, subscription[0].planId));

            if (plan.length > 0) {
              await db.insert(payments).values({
                userId: subscription[0].userId,
                subscriptionId: subscription[0].id,
                stripePaymentIntentId: (invoice as any).payment_intent as string,
                stripeInvoiceId: invoice.id,
                amount: ((invoice as any).amount_paid / 100).toString(), // Converter de centavos
                currency: ((invoice as any).currency || "BRL").toUpperCase(),
                status: "succeeded",
              });
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("[Webhook] Subscription deleted:", subscription.id);

        // Atualizar status da assinatura
        await db
          .update(subscriptions)
          .set({
            status: "canceled",
            canceledAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("[Webhook] Subscription updated:", subscription.id);

        // Atualizar status da assinatura
        let status: "active" | "past_due" | "canceled" | "paused" = "active";
        if (subscription.status === "past_due") status = "past_due";
        if (subscription.status === "canceled") status = "canceled";
        if (subscription.pause_collection) status = "paused";

        await db
          .update(subscriptions)
          .set({
            status,
            currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("[Webhook] Invoice payment failed:", invoice.id);

        // Atualizar status da assinatura para past_due
        if ((invoice as any).subscription) {
          await db
            .update(subscriptions)
            .set({
              status: "past_due",
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, (invoice as any).subscription as string));
        }
        break;
      }

      default:
        console.log("[Webhook] Unhandled event type:", event.type);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
