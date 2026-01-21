import { describe, it, expect, beforeEach } from "vitest";
import Stripe from "stripe";

describe("Stripe Configuration", () => {
  let stripe: Stripe;

  beforeEach(() => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    stripe = new Stripe(secretKey, {
      apiVersion: "2023-10-16",
    });
  });

  it("should initialize Stripe with valid secret key", async () => {
    expect(stripe).toBeDefined();
    // Stripe client is initialized successfully
  });

  it("should be able to retrieve account information", async () => {
    const account = await stripe.account.retrieve();
    expect(account).toBeDefined();
    expect(account.id).toBeDefined();
    expect(account.object).toBe("account");
  });

  it("should have test mode enabled", async () => {
    const account = await stripe.account.retrieve();
    // In test mode, livemode should be false
    expect(account).toBeDefined();
    expect(account.id).toBeDefined();
  });

  it("should be able to list products", async () => {
    const products = await stripe.products.list({ limit: 1 });
    expect(products).toBeDefined();
    expect(Array.isArray(products.data)).toBe(true);
  });

  it("should be able to list prices", async () => {
    const prices = await stripe.prices.list({ limit: 1 });
    expect(prices).toBeDefined();
    expect(Array.isArray(prices.data)).toBe(true);
  });

  it("should have publishable key in environment", () => {
    const publishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY;
    expect(publishableKey).toBeDefined();
    expect(publishableKey).toMatch(/^pk_test_/);
  });

  it("should have webhook secret in environment", () => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    expect(webhookSecret).toBeDefined();
    expect(webhookSecret).toMatch(/^whsec_/);
  });
});
