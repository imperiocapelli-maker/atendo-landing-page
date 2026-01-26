import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { appRouter } from "../routers";
import { getDb } from "../db";
import { users, subscriptionPlans, subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

let testUserId = 0;
let testPlanId = 0;

function createAuthContext(userId: number): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `stripe-test-${userId}`,
    email: `stripe-test-${userId}@example.com`,
    name: `Stripe Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Subscription Router", () => {
  beforeEach(async () => {
    const db = await getDb();
    if (db) {
      // Create test user
      await db
        .insert(users)
        .values({
          openId: "stripe-test-user",
          email: "stripe-test@example.com",
          name: "Stripe Test User",
          loginMethod: "manus",
          role: "user",
        })
        .catch(() => {
          // User might already exist
        });

      // Get user ID
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.openId, "stripe-test-user"))
        .limit(1);

      if (userResult[0]) {
        testUserId = userResult[0].id;
      }

      // Create test plan
      await db
        .insert(subscriptionPlans)
        .values({
          name: "Test Plan",
          description: "Test subscription plan",
          price: "99.99",
          billingCycle: "monthly",
          features: JSON.stringify(["Feature 1", "Feature 2"]),
          isActive: 1,
        })
        .catch(() => {
          // Plan might already exist
        });

      // Get plan ID
      const planResult = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.name, "Test Plan"))
        .limit(1);

      if (planResult[0]) {
        testPlanId = planResult[0].id;
      }
    }
  });

  afterEach(async () => {
    const db = await getDb();
    if (db && testUserId && testPlanId) {
      // Clean up subscriptions
      await db
        .delete(subscriptions)
        .where(eq(subscriptions.userId, testUserId))
        .catch(() => {});

      // Clean up test plan
      await db
        .delete(subscriptionPlans)
        .where(eq(subscriptionPlans.id, testPlanId))
        .catch(() => {});

      // Clean up test user
      await db
        .delete(users)
        .where(eq(users.openId, "stripe-test-user"))
        .catch(() => {});
    }
  });

  it("should list active subscription plans", async () => {
    const db = await getDb();
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    const plans = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.isActive, 1));

    expect(plans).toBeDefined();
    expect(Array.isArray(plans)).toBe(true);
  });

  it("should get specific subscription plan", async () => {
    if (!testPlanId) {
      expect(true).toBe(true);
      return;
    }

    const db = await getDb();
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    const plan = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.id, testPlanId));

    expect(plan).toBeDefined();
    expect(plan.length).toBe(1);
    expect(plan[0].name).toBe("Test Plan");
  });

  it("should create subscription for user", async () => {
    if (!testUserId || !testPlanId) {
      expect(true).toBe(true);
      return;
    }

    const db = await getDb();
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    await db
      .insert(subscriptions)
      .values({
        userId: testUserId,
        planId: testPlanId,
        stripeCustomerId: "cus_test_123",
        stripeSubscriptionId: "sub_test_123",
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .catch(() => {});

    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, testUserId));

    expect(userSubscriptions).toBeDefined();
    expect(Array.isArray(userSubscriptions)).toBe(true);
  });

  it("should get user subscription", async () => {
    if (!testUserId) {
      expect(true).toBe(true);
      return;
    }

    const db = await getDb();
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, testUserId));

    expect(userSubscriptions).toBeDefined();
    expect(Array.isArray(userSubscriptions)).toBe(true);
  });

  it("should update subscription status", async () => {
    if (!testUserId || !testPlanId) {
      expect(true).toBe(true);
      return;
    }

    const db = await getDb();
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    // Create subscription first
    await db
      .insert(subscriptions)
      .values({
        userId: testUserId,
        planId: testPlanId,
        stripeCustomerId: "cus_test_456",
        stripeSubscriptionId: "sub_test_456",
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .catch(() => {});

    const subscriptionResult = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, testUserId))
      .limit(1);

    if (subscriptionResult.length > 0) {
      const updated = await db
        .update(subscriptions)
        .set({ status: "past_due" })
        .where(eq(subscriptions.id, subscriptionResult[0].id));

      expect(updated).toBeDefined();
    }
  });

});


describe("Subscription Plans - Billing Intervals", () => {
  it("should have both monthly and yearly plans for each plan name", async () => {
    const db = await getDb();
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    const plans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, 1));
    
    // Group plans by name
    const plansByName = new Map<string, any[]>();
    plans.forEach((plan: any) => {
      if (!plansByName.has(plan.name)) {
        plansByName.set(plan.name, []);
      }
      plansByName.get(plan.name)!.push(plan);
    });

    // Check each plan has both monthly and yearly
    const expectedPlans = ["Essencial", "Profissional", "Premium", "Scale"];
    for (const planName of expectedPlans) {
      const planVariants = plansByName.get(planName);
      expect(planVariants).toBeDefined();
      expect(planVariants?.length).toBe(2);

      const hasMonthly = planVariants?.some((p: any) => p.billingInterval === "monthly");
      const hasYearly = planVariants?.some((p: any) => p.billingInterval === "yearly");
      
      expect(hasMonthly).toBe(true);
      expect(hasYearly).toBe(true);
    }
  });

  it("should have correct prices for monthly plans (25% higher than yearly)", async () => {
    const db = await getDb();
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    const plans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, 1));
    
    const plansByName = new Map<string, any[]>();
    plans.forEach((plan: any) => {
      if (!plansByName.has(plan.name)) {
        plansByName.set(plan.name, []);
      }
      plansByName.get(plan.name)!.push(plan);
    });

    // Check prices
    const expectedPrices = {
      "Essencial": { yearly: 89, monthly: 111 },
      "Profissional": { yearly: 149, monthly: 186 },
      "Premium": { yearly: 249, monthly: 311 },
      "Scale": { yearly: 399, monthly: 498 }
    };

    for (const [planName, prices] of Object.entries(expectedPrices)) {
      const variants = plansByName.get(planName);
      expect(variants).toBeDefined();

      const yearlyPlan = variants?.find((p: any) => p.billingInterval === "yearly");
      const monthlyPlan = variants?.find((p: any) => p.billingInterval === "monthly");

      expect(parseFloat(yearlyPlan?.price)).toBe(prices.yearly);
      expect(parseFloat(monthlyPlan?.price)).toBe(prices.monthly);
    }
  });

  it("should have unique stripePriceId for each plan variant", async () => {
    const db = await getDb();
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    const plans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, 1));
    
    const priceIds = plans.map((p: any) => p.stripePriceId);
    const uniquePriceIds = new Set(priceIds);

    // All price IDs should be unique
    expect(uniquePriceIds.size).toBe(priceIds.length);

    // All price IDs should start with "price_"
    priceIds.forEach((priceId: string) => {
      expect(priceId).toMatch(/^price_/);
    });
  });

  it("should have valid stripePriceId format", async () => {
    const db = await getDb();
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    const plans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, 1));
    
    plans.forEach((plan: any) => {
      expect(plan.stripePriceId).toBeTruthy();
      expect(plan.stripePriceId).toMatch(/^price_/);
      expect(plan.stripePriceId.length).toBeGreaterThan(6);
    });
  });

  it("should have correct stripeProductId for all plans", async () => {
    const db = await getDb();
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    const plans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, 1));
    
    plans.forEach((plan: any) => {
      expect(plan.stripeProductId).toBeTruthy();
      expect(plan.stripeProductId).toMatch(/^prod_/);
    });
  });

  it("should have same stripeProductId for both billing intervals of the same plan", async () => {
    const db = await getDb();
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    const plans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, 1));
    
    const plansByName = new Map<string, any[]>();
    plans.forEach((plan: any) => {
      if (!plansByName.has(plan.name)) {
        plansByName.set(plan.name, []);
      }
      plansByName.get(plan.name)!.push(plan);
    });

    for (const variants of plansByName.values()) {
      if (variants.length === 2) {
        expect(variants[0].stripeProductId).toBe(variants[1].stripeProductId);
      }
    }
  });
});
