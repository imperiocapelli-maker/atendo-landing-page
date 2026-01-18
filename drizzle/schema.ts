import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  planName: varchar("planName", { length: 64 }).notNull(),
  planPrice: decimal("planPrice", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  convertedPrice: decimal("convertedPrice", { precision: 10, scale: 2 }).notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }).notNull().unique(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "canceled"]).default("pending").notNull(),
  language: varchar("language", { length: 5 }).default("pt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  formattedPhone: varchar("formattedPhone", { length: 30 }).notNull(),
  country: varchar("country", { length: 2 }).notNull(),
  language: varchar("language", { length: 5 }).default("pt").notNull(),
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  source: varchar("source", { length: 50 }).default("exit_intent").notNull(),
  status: mysqlEnum("status", ["new", "contacted", "interested", "converted", "rejected"]).default("new").notNull(),
  zapierWebhookSent: mysqlEnum("zapierWebhookSent", ["pending", "sent", "failed"]).default("pending").notNull(),
  zapierWebhookResponse: text("zapierWebhookResponse"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export const calendlyWebhooksTable = mysqlTable("calendlyWebhooks", {
  id: int("id").autoincrement().primaryKey(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  payload: text("payload").notNull(),
  inviteeName: varchar("inviteeName", { length: 255 }).notNull(),
  inviteeEmail: varchar("inviteeEmail", { length: 320 }).notNull(),
  inviteePhone: varchar("inviteePhone", { length: 20 }).notNull(),
  scheduledAt: timestamp("scheduledAt").notNull(),
  notificationSent: mysqlEnum("notificationSent", ["pending", "sent", "failed"]).default("pending").notNull(),
  notificationError: text("notificationError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CalendlyWebhook = typeof calendlyWebhooksTable.$inferSelect;
export type InsertCalendlyWebhook = typeof calendlyWebhooksTable.$inferInsert;
