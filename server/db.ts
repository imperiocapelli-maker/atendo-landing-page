import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, InsertLead, leads, InsertCalendlyWebhook, calendlyWebhooksTable, InsertFixedCost, fixedCosts, InsertPricingConfig, pricingConfig, InsertPricingHistory, pricingHistory, services, InsertService, pricingSettings, InsertPricingSettings } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Lead functions
export async function createLead(lead: InsertLead) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create lead: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(leads).values(lead);
    // Retornar o lead criado
    const createdLeads = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(1);
    return createdLeads[0];
  } catch (error) {
    console.error("[Database] Failed to create lead:", error);
    throw error;
  }
}

export async function getLeads(limit = 100) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get leads: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get leads:", error);
    return [];
  }
}

export async function getLeadsByStatus(status: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get leads: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(leads)
      .where(eq(leads.status, status as any))
      .orderBy(desc(leads.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get leads by status:", error);
    return [];
  }
}

export async function updateLeadStatus(leadId: number, status: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update lead: database not available");
    return undefined;
  }

  try {
    const result = await db
      .update(leads)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(leads.id, leadId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update lead status:", error);
    throw error;
  }
}

export async function updateLeadWebhookStatus(leadId: number, webhookStatus: string, response?: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update lead: database not available");
    return undefined;
  }

  try {
    const result = await db
      .update(leads)
      .set({
        zapierWebhookSent: webhookStatus as any,
        zapierWebhookResponse: response,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update lead webhook status:", error);
    throw error;
  }
}

// TODO: add feature queries here as your schema grows.

// Calendly Webhook functions
export async function createCalendlyWebhook(webhook: InsertCalendlyWebhook) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create webhook: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(calendlyWebhooksTable).values(webhook);
    const createdWebhooks = await db.select().from(calendlyWebhooksTable).orderBy(desc(calendlyWebhooksTable.createdAt)).limit(1);
    return createdWebhooks[0];
  } catch (error) {
    console.error("[Database] Failed to create webhook:", error);
    throw error;
  }
}

export async function getCalendlyWebhooks(limit = 50) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get webhooks: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(calendlyWebhooksTable)
      .orderBy(desc(calendlyWebhooksTable.createdAt))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get webhooks:", error);
    return [];
  }
}

export async function updateCalendlyWebhookStatus(webhookId: number, notificationStatus: string, error?: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update webhook: database not available");
    return undefined;
  }

  try {
    const result = await db
      .update(calendlyWebhooksTable)
      .set({
        notificationSent: notificationStatus as any,
        notificationError: error,
        updatedAt: new Date(),
      })
      .where(eq(calendlyWebhooksTable.id, webhookId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update webhook status:", error);
    throw error;
  }
}


// Fixed Costs functions
export async function upsertFixedCosts(userId: number, costs: InsertFixedCost) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert fixed costs: database not available");
    return undefined;
  }

  try {
    const existing = await db.select().from(fixedCosts).where(eq(fixedCosts.userId, userId)).limit(1);
    
    if (existing.length > 0) {
      await db.update(fixedCosts).set({ ...costs, updatedAt: new Date() }).where(eq(fixedCosts.userId, userId));
    } else {
      await db.insert(fixedCosts).values({ ...costs, userId });
    }
    
    const result = await db.select().from(fixedCosts).where(eq(fixedCosts.userId, userId)).limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to upsert fixed costs:", error);
    throw error;
  }
}

export async function getFixedCosts(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get fixed costs: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(fixedCosts).where(eq(fixedCosts.userId, userId)).limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to get fixed costs:", error);
    return undefined;
  }
}

// Pricing Config functions
export async function upsertPricingConfig(userId: number, config: InsertPricingConfig) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert pricing config: database not available");
    return undefined;
  }

  try {
    const existing = await db.select().from(pricingConfig).where(eq(pricingConfig.userId, userId)).limit(1);
    
    if (existing.length > 0) {
      await db.update(pricingConfig).set({ ...config, updatedAt: new Date() }).where(eq(pricingConfig.userId, userId));
    } else {
      await db.insert(pricingConfig).values({ ...config, userId });
    }
    
    const result = await db.select().from(pricingConfig).where(eq(pricingConfig.userId, userId)).limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to upsert pricing config:", error);
    throw error;
  }
}

export async function getPricingConfig(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get pricing config: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(pricingConfig).where(eq(pricingConfig.userId, userId)).limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to get pricing config:", error);
    return undefined;
  }
}

// Pricing History functions
export async function createPricingHistory(history: InsertPricingHistory) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create pricing history: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(pricingHistory).values(history);
    const created = await db.select().from(pricingHistory).orderBy(desc(pricingHistory.createdAt)).limit(1);
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create pricing history:", error);
    throw error;
  }
}

export async function getPricingHistory(userId: number, limit = 10) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get pricing history: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(pricingHistory)
      .where(eq(pricingHistory.userId, userId))
      .orderBy(desc(pricingHistory.createdAt))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get pricing history:", error);
    return [];
  }
}

export async function getLatestPricingHistory(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get pricing history: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(pricingHistory)
      .where(eq(pricingHistory.userId, userId))
      .orderBy(desc(pricingHistory.createdAt))
      .limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to get latest pricing history:", error);
    return undefined;
  }
}


// ============ SERVICES ============

export async function createService(userId: number, data: InsertService) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create service: database not available");
    return undefined;
  }

  try {
    await db.insert(services).values({ ...data, userId } as InsertService);
    const result = await db.select().from(services).where(eq(services.userId, userId)).orderBy(desc(services.createdAt)).limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create service:", error);
    throw error;
  }
}

export async function getServices(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get services: database not available");
    return [];
  }

  try {
    return await db.select().from(services).where(eq(services.userId, userId)).execute();
  } catch (error) {
    console.error("[Database] Failed to get services:", error);
    return [];
  }
}

export async function getService(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get service: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(services)
      .where(and(eq(services.id, id), eq(services.userId, userId)))
      .execute();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to get service:", error);
    return undefined;
  }
}

export async function updateService(id: number, userId: number, data: Partial<InsertService>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update service: database not available");
    return undefined;
  }

  try {
    await db
      .update(services)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(services.id, id), eq(services.userId, userId)))
      .execute();
    return await getService(id, userId);
  } catch (error) {
    console.error("[Database] Failed to update service:", error);
    throw error;
  }
}

export async function deleteService(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete service: database not available");
    return undefined;
  }

  try {
    return await db
      .delete(services)
      .where(and(eq(services.id, id), eq(services.userId, userId)))
      .execute();
  } catch (error) {
    console.error("[Database] Failed to delete service:", error);
    throw error;
  }
}

// ============ PRICING SETTINGS ============

export async function upsertPricingSettings(userId: number, data: Partial<InsertPricingSettings>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert pricing settings: database not available");
    return undefined;
  }

  try {
    const existing = await db
      .select()
      .from(pricingSettings)
      .where(eq(pricingSettings.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(pricingSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(pricingSettings.userId, userId))
        .execute();
    } else {
      await db
        .insert(pricingSettings)
        .values({ ...data, userId } as InsertPricingSettings)
        .execute();
    }

    const result = await db
      .select()
      .from(pricingSettings)
      .where(eq(pricingSettings.userId, userId))
      .limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to upsert pricing settings:", error);
    throw error;
  }
}

export async function getPricingSettings(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get pricing settings: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(pricingSettings)
      .where(eq(pricingSettings.userId, userId))
      .limit(1)
      .execute();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to get pricing settings:", error);
    return undefined;
  }
}
