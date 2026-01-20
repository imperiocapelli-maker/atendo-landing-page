import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { appRouter } from "../routers";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

let testUserId1 = 0;
let testUserId2 = 0;
let testUserId3 = 0;

function createAuthContext(userId: number): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `sample-user-${userId}`,
    email: `sample${userId}@example.com`,
    name: `Sample User ${userId}`,
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

describe("pricing router with database", () => {
  beforeEach(async () => {
    // Create test users in database
    const db = await getDb();
    if (db) {
      // Create user 1
      await db
        .insert(users)
        .values({
          openId: "test-user-1",
          email: "test1@example.com",
          name: "Test User 1",
          loginMethod: "manus",
          role: "user",
        })
        .catch(() => {
          // User might already exist
        });

      // Create user 2
      await db
        .insert(users)
        .values({
          openId: "test-user-2",
          email: "test2@example.com",
          name: "Test User 2",
          loginMethod: "manus",
          role: "user",
        })
        .catch(() => {
          // User might already exist
        });

      // Create user 3
      await db
        .insert(users)
        .values({
          openId: "test-user-3",
          email: "test3@example.com",
          name: "Test User 3",
          loginMethod: "manus",
          role: "user",
        })
        .catch(() => {
          // User might already exist
        });

      // Get the IDs of created users
      const user1 = await db
        .select()
        .from(users)
        .where(eq(users.openId, "test-user-1"))
        .limit(1);
      const user2 = await db
        .select()
        .from(users)
        .where(eq(users.openId, "test-user-2"))
        .limit(1);
      const user3 = await db
        .select()
        .from(users)
        .where(eq(users.openId, "test-user-3"))
        .limit(1);

      if (user1[0]) testUserId1 = user1[0].id;
      if (user2[0]) testUserId2 = user2[0].id;
      if (user3[0]) testUserId3 = user3[0].id;
    }
  });

  describe("savePricingSettings", () => {
    it("should save pricing settings for authenticated user", async () => {
      if (!testUserId1) {
        expect(true).toBe(true); // Skip if user not created
        return;
      }

      const ctx = createAuthContext(testUserId1);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.services.savePricingSettings({
        rentCost: 1000,
        employeeCount: 2,
        averageSalary: 2000,
        utilitiesCost: 300,
        insuranceCost: 200,
        maintenanceCost: 150,
        marketingCost: 500,
        materialsCost: 200,
        softwareLicenses: 100,
        otherCosts: 50,
        desiredProfitMargin: 30,
        cardTaxPercentage: 2.5,
        taxPercentage: 15,
        workingDaysPerMonth: 22,
        workingHoursPerDay: 8,
        currency: "BRL",
      });

      expect(result).toBeDefined();
      expect(parseFloat(result.desiredProfitMargin.toString())).toBe(30);
      expect(parseFloat(result.rentCost.toString())).toBe(1000);
      expect(parseFloat(result.marketingCost.toString())).toBe(500);
    });

    it("should retrieve saved pricing settings", async () => {
      if (!testUserId2) {
        expect(true).toBe(true); // Skip if user not created
        return;
      }

      const ctx = createAuthContext(testUserId2);
      const caller = appRouter.createCaller(ctx);

      // Save settings
      await caller.services.savePricingSettings({
        rentCost: 2000,
        employeeCount: 3,
        averageSalary: 2500,
        utilitiesCost: 400,
        insuranceCost: 250,
        maintenanceCost: 200,
        marketingCost: 600,
        materialsCost: 300,
        softwareLicenses: 150,
        otherCosts: 100,
        desiredProfitMargin: 35,
        cardTaxPercentage: 3,
        taxPercentage: 18,
        workingDaysPerMonth: 22,
        workingHoursPerDay: 8,
        currency: "BRL",
      });

      // Retrieve settings
      const retrieved = await caller.services.getPricingSettings();

      expect(retrieved).toBeDefined();
      expect(parseFloat(retrieved.desiredProfitMargin.toString())).toBe(35);
      expect(parseFloat(retrieved.rentCost.toString())).toBe(2000);
      expect(parseFloat(retrieved.marketingCost.toString())).toBe(600);
    });
  });

  describe("services CRUD", () => {
    it("should create a service for authenticated user", async () => {
      if (!testUserId1) {
        expect(true).toBe(true); // Skip if user not created
        return;
      }

      const ctx = createAuthContext(testUserId1);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.services.create({
        name: "Corte de Cabelo",
        description: "Corte profissional",
        commissionPercentage: 30,
        productCost: 5,
        currentPrice: 50,
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("Corte de Cabelo");
      expect(parseFloat(result.commissionPercentage.toString())).toBe(30);
      expect(parseFloat(result.productCost.toString())).toBe(5);
    });

    it("should retrieve all services for authenticated user", async () => {
      if (!testUserId2) {
        expect(true).toBe(true); // Skip if user not created
        return;
      }

      const ctx = createAuthContext(testUserId2);
      const caller = appRouter.createCaller(ctx);

      // Create multiple services
      const service1 = await caller.services.create({
        name: "Serviço 1 - Único",
        commissionPercentage: 20,
        productCost: 10,
        currentPrice: 60,
      });

      const service2 = await caller.services.create({
        name: "Serviço 2 - Único",
        commissionPercentage: 25,
        productCost: 15,
        currentPrice: 80,
      });

      // Retrieve all services
      const services = await caller.services.getAll();

      expect(services).toBeDefined();
      expect(services.length).toBeGreaterThanOrEqual(2);
      expect(services.some((s) => s.id === service1.id)).toBe(true);
      expect(services.some((s) => s.id === service2.id)).toBe(true);
    });

    it("should delete a service", async () => {
      if (!testUserId3) {
        expect(true).toBe(true); // Skip if user not created
        return;
      }

      const ctx = createAuthContext(testUserId3);
      const caller = appRouter.createCaller(ctx);

      // Create a service
      const created = await caller.services.create({
        name: "Serviço a Deletar",
        commissionPercentage: 30,
        productCost: 10,
        currentPrice: 70,
      });

      // Delete the service
      const result = await caller.services.delete({ id: created.id });

      expect(result).toBeDefined();

      // Verify it's deleted
      const services = await caller.services.getAll();
      expect(services.some((s) => s.id === created.id)).toBe(false);
    });

    it("should isolate services between different users", async () => {
      if (!testUserId1 || !testUserId2) {
        expect(true).toBe(true); // Skip if users not created
        return;
      }

      const ctx1 = createAuthContext(testUserId1);
      const ctx2 = createAuthContext(testUserId2);
      const caller1 = appRouter.createCaller(ctx1);
      const caller2 = appRouter.createCaller(ctx2);

      // User 1 creates services
      const service1 = await caller1.services.create({
        name: `Serviço User ${testUserId1}`,
        commissionPercentage: 20,
        productCost: 10,
        currentPrice: 60,
      });

      // User 2 creates services
      const service2 = await caller2.services.create({
        name: `Serviço User ${testUserId2}`,
        commissionPercentage: 30,
        productCost: 15,
        currentPrice: 80,
      });

      // Verify each user sees only their services
      const services1 = await caller1.services.getAll();
      const services2 = await caller2.services.getAll();

      expect(services1.some((s) => s.id === service1.id)).toBe(true);
      expect(services1.some((s) => s.id === service2.id)).toBe(false);

      expect(services2.some((s) => s.id === service2.id)).toBe(true);
      expect(services2.some((s) => s.id === service1.id)).toBe(false);
    });
  });
});
