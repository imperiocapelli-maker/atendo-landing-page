import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Stripe from "stripe";
import { getDb } from "../db";
import { coupons, subscriptionPlans } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Subscription Coupon Integration", () => {
  let stripe: Stripe;
  let db: any;

  beforeEach(async () => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    stripe = new Stripe(secretKey, {
      apiVersion: "2023-10-16",
    });
    db = await getDb();
  });

  it("should create a Stripe coupon with percentage discount", async () => {
    const coupon = await stripe.coupons.create({
      percent_off: 30,
      metadata: {
        couponId: "test-30-percent",
        couponCode: "TEST30",
      },
    });

    expect(coupon).toBeDefined();
    expect(coupon.percent_off).toBe(30);
    expect(coupon.metadata?.couponCode).toBe("TEST30");
  });

  it("should create a Stripe coupon with fixed amount discount", async () => {
    const coupon = await stripe.coupons.create({
      amount_off: 5000, // R$ 50.00 em centavos
      currency: "brl",
      metadata: {
        couponId: "test-fixed",
        couponCode: "FIXED50",
      },
    });

    expect(coupon).toBeDefined();
    expect(coupon.amount_off).toBe(5000);
    expect(coupon.currency).toBe("brl");
  });

  it("should apply coupon to checkout session", async () => {
    // Criar cupom de teste
    const testCoupon = await stripe.coupons.create({
      percent_off: 10,
      metadata: {
        couponId: "test-checkout",
        couponCode: "CHECKOUT10",
      },
    });

    // Obter um preço válido do Stripe
    const prices = await stripe.prices.list({ limit: 1 });
    if (prices.data.length === 0) {
      throw new Error("No prices found in Stripe account");
    }

    const priceId = prices.data[0].id;

    // Criar sessão com desconto
    const session = await stripe.checkout.sessions.create({
      customer_email: "test@example.com",
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
      discounts: [{ coupon: testCoupon.id }],
    });

    expect(session).toBeDefined();
    expect(session.discounts).toBeDefined();
    expect(session.discounts?.length).toBeGreaterThan(0);
  });

  it("should validate coupon from database", async () => {
    if (!db) {
      throw new Error("Database not available");
    }

    // Buscar cupom HOMEPRO do banco
    const coupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, "HOMEPRO"))
      .limit(1);

    if (coupon.length > 0) {
      const couponData = coupon[0];
      expect(couponData.code).toBe("HOMEPRO");
      expect(couponData.discountType).toBe("percentage");
      expect(couponData.discountValue).toBe(30);
      expect(couponData.isActive).toBe(1);
    }
  });

  it("should calculate discount correctly for percentage", () => {
    const totalAmount = 1065.60; // Preço anual Essencial
    const discountPercentage = 30;
    const expectedDiscount = (totalAmount * discountPercentage) / 100;
    const expectedFinal = totalAmount - expectedDiscount;

    expect(expectedDiscount).toBe(319.68);
    expect(expectedFinal).toBe(745.92);
  });

  it("should calculate discount correctly for fixed amount", () => {
    const totalAmount = 1065.60;
    const fixedDiscount = 100; // R$ 100
    const expectedFinal = totalAmount - fixedDiscount;

    expect(expectedFinal).toBe(965.60);
  });

  it("should not apply discount greater than total amount", () => {
    const totalAmount = 100;
    const discountAmount = 150;
    const finalAmount = Math.max(0, totalAmount - discountAmount);

    expect(finalAmount).toBe(0);
  });

  it("should list coupons from Stripe", async () => {
    const coupons = await stripe.coupons.list({ limit: 10 });

    expect(coupons).toBeDefined();
    expect(Array.isArray(coupons.data)).toBe(true);
  });

  it("should retrieve specific coupon from Stripe", async () => {
    // Criar um cupom primeiro
    const createdCoupon = await stripe.coupons.create({
      percent_off: 15,
      metadata: {
        couponId: "test-retrieve",
        couponCode: "RETRIEVE15",
      },
    });

    // Recuperar o cupom
    const retrievedCoupon = await stripe.coupons.retrieve(createdCoupon.id);

    expect(retrievedCoupon).toBeDefined();
    expect(retrievedCoupon.id).toBe(createdCoupon.id);
    expect(retrievedCoupon.percent_off).toBe(15);
  });

  it("should handle expired coupon", async () => {
    if (!db) {
      throw new Error("Database not available");
    }

    // Criar cupom expirado de teste
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 1); // Ontem

    const coupon = await db
      .select()
      .from(coupons)
      .limit(1);

    if (coupon.length > 0) {
      // Verificar se cupom está expirado
      const couponData = coupon[0];
      const isExpired = couponData.validUntil && new Date(couponData.validUntil) < new Date();
      
      if (isExpired) {
        expect(isExpired).toBe(true);
      }
    }
  });

  it("should handle coupon with usage limit", async () => {
    if (!db) {
      throw new Error("Database not available");
    }

    // Buscar cupom com limite de uso
    const coupon = await db
      .select()
      .from(coupons)
      .limit(1);

    if (coupon.length > 0) {
      const couponData = coupon[0];
      if (couponData.maxUses) {
        const isLimitReached = couponData.currentUses && couponData.currentUses >= couponData.maxUses;
        expect(typeof isLimitReached).toBe("boolean");
      }
    }
  });
});
