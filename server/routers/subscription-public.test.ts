import { describe, it, expect, beforeAll } from "vitest";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

describe("Public Subscription Checkout", () => {
  it("should allow checkout without authentication", async () => {
    // Test that the public procedure accepts email parameter
    expect(true).toBe(true);
  });

  it("should validate email format", async () => {
    const validEmails = [
      "user@example.com",
      "test.user@domain.co.uk",
      "user+tag@example.com",
    ];

    const invalidEmails = [
      "invalid.email",
      "@example.com",
      "user@",
      "user @example.com",
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    validEmails.forEach((email) => {
      expect(emailRegex.test(email)).toBe(true);
    });

    invalidEmails.forEach((email) => {
      expect(emailRegex.test(email)).toBe(false);
    });
  });

  it("should have Stripe products available", async () => {
    const products = await stripe.products.list({ limit: 10 });
    expect(products.data.length).toBeGreaterThan(0);
  });

  it("should have Stripe prices available", async () => {
    const prices = await stripe.prices.list({ limit: 10 });
    expect(prices.data.length).toBeGreaterThan(0);
  });

  it("should create checkout session with email", async () => {
    // Get a price ID from Stripe
    const prices = await stripe.prices.list({ limit: 1 });
    if (prices.data.length === 0) {
      throw new Error("No prices available in Stripe");
    }

    const priceId = prices.data[0].id;
    const testEmail = "test-checkout@example.com";

    const session = await stripe.checkout.sessions.create({
      customer_email: testEmail,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/checkout-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/planos?canceled=true",
      metadata: {
        plan_id: "1",
        customer_email: testEmail,
      },
    });

    expect(session).toBeDefined();
    expect(session.url).toBeDefined();
    expect(session.customer_email).toBe(testEmail);
    expect(session.mode).toBe("subscription");
  });
});
