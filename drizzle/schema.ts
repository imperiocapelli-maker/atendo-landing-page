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

// Tabela de Custos Fixos por Usuário
export const fixedCosts = mysqlTable("fixedCosts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Custos de Aluguel/Espaço
  rentCost: decimal("rentCost", { precision: 10, scale: 2 }).default("0").notNull(),
  rentFrequency: mysqlEnum("rentFrequency", ["monthly", "yearly"]).default("monthly").notNull(),
  
  // Custos de Pessoal
  employeeCount: int("employeeCount").default(0).notNull(),
  averageSalary: decimal("averageSalary", { precision: 10, scale: 2 }).default("0").notNull(),
  
  // Custos Operacionais
  utilitiesCost: decimal("utilitiesCost", { precision: 10, scale: 2 }).default("0").notNull(), // Água, luz, internet
  insuranceCost: decimal("insuranceCost", { precision: 10, scale: 2 }).default("0").notNull(),
  maintenanceCost: decimal("maintenanceCost", { precision: 10, scale: 2 }).default("0").notNull(),
  marketingCost: decimal("marketingCost", { precision: 10, scale: 2 }).default("0").notNull(),
  
  // Custos de Materiais/Insumos
  materialsCost: decimal("materialsCost", { precision: 10, scale: 2 }).default("0").notNull(),
  
  // Custos de Tecnologia
  softwareLicenses: decimal("softwareLicenses", { precision: 10, scale: 2 }).default("0").notNull(),
  
  // Outros custos
  otherCosts: decimal("otherCosts", { precision: 10, scale: 2 }).default("0").notNull(),
  otherCostsDescription: text("otherCostsDescription"),
  
  // Metadados
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FixedCost = typeof fixedCosts.$inferSelect;
export type InsertFixedCost = typeof fixedCosts.$inferInsert;

// Tabela de Configuração de Precificação
export const pricingConfig = mysqlTable("pricingConfig", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Configurações de Precificação
  desiredProfitMargin: decimal("desiredProfitMargin", { precision: 5, scale: 2 }).default("30").notNull(), // Percentual de lucro desejado
  workingDaysPerMonth: int("workingDaysPerMonth").default(22).notNull(),
  workingHoursPerDay: decimal("workingHoursPerDay", { precision: 4, scale: 2 }).default("8").notNull(),
  
  // Configurações de Serviços
  averageServiceDuration: decimal("averageServiceDuration", { precision: 5, scale: 2 }).default("60").notNull(), // em minutos
  
  // Metadados
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PricingConfig = typeof pricingConfig.$inferSelect;
export type InsertPricingConfig = typeof pricingConfig.$inferInsert;

// Tabela de Histórico de Cálculos
export const pricingHistory = mysqlTable("pricingHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Custos Calculados
  totalMonthlyCost: decimal("totalMonthlyCost", { precision: 10, scale: 2 }).notNull(),
  costPerDay: decimal("costPerDay", { precision: 10, scale: 2 }).notNull(),
  costPerHour: decimal("costPerHour", { precision: 10, scale: 2 }).notNull(),
  costPerService: decimal("costPerService", { precision: 10, scale: 2 }).notNull(),
  
  // Preços Sugeridos
  suggestedServicePrice: decimal("suggestedServicePrice", { precision: 10, scale: 2 }).notNull(),
  suggestedHourlyRate: decimal("suggestedHourlyRate", { precision: 10, scale: 2 }).notNull(),
  
  // Projeção de Lucro
  projectedMonthlyRevenue: decimal("projectedMonthlyRevenue", { precision: 10, scale: 2 }).notNull(),
  projectedMonthlyProfit: decimal("projectedMonthlyProfit", { precision: 10, scale: 2 }).notNull(),
  profitMarginAchieved: decimal("profitMarginAchieved", { precision: 5, scale: 2 }).notNull(),
  
  // Metadados
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PricingHistory = typeof pricingHistory.$inferSelect;
export type InsertPricingHistory = typeof pricingHistory.$inferInsert;

// Tabela de Serviços para o Dashboard de Precificação
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Informações do Serviço
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Custos e Comissões
  commissionPercentage: decimal("commissionPercentage", { precision: 5, scale: 2 }).default("0").notNull(),
  productCost: decimal("productCost", { precision: 10, scale: 2 }).default("0").notNull(),
  
  // Preço
  currentPrice: decimal("currentPrice", { precision: 10, scale: 2 }).notNull(),
  suggestedPrice: decimal("suggestedPrice", { precision: 10, scale: 2 }),
  
  // Métricas
  profitMargin: decimal("profitMargin", { precision: 5, scale: 2 }),
  profitAmount: decimal("profitAmount", { precision: 10, scale: 2 }),
  
  // Status
  isActive: int("isActive").default(1).notNull(),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

// Tabela de Configuração de Precificação por Usuário
export const pricingSettings = mysqlTable("pricingSettings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  
  // Custos Fixos
  rentCost: decimal("rentCost", { precision: 10, scale: 2 }).default("0").notNull(),
  employeeCount: int("employeeCount").default(0).notNull(),
  averageSalary: decimal("averageSalary", { precision: 10, scale: 2 }).default("0").notNull(),
  utilitiesCost: decimal("utilitiesCost", { precision: 10, scale: 2 }).default("0").notNull(),
  insuranceCost: decimal("insuranceCost", { precision: 10, scale: 2 }).default("0").notNull(),
  maintenanceCost: decimal("maintenanceCost", { precision: 10, scale: 2 }).default("0").notNull(),
  marketingCost: decimal("marketingCost", { precision: 10, scale: 2 }).default("0").notNull(),
  materialsCost: decimal("materialsCost", { precision: 10, scale: 2 }).default("0").notNull(),
  softwareLicenses: decimal("softwareLicenses", { precision: 10, scale: 2 }).default("0").notNull(),
  otherCosts: decimal("otherCosts", { precision: 10, scale: 2 }).default("0").notNull(),
  
  // Configurações de Precificação
  desiredProfitMargin: decimal("desiredProfitMargin", { precision: 5, scale: 2 }).default("30").notNull(),
  cardTaxPercentage: decimal("cardTaxPercentage", { precision: 5, scale: 2 }).default("0").notNull(),
  taxPercentage: decimal("taxPercentage", { precision: 5, scale: 2 }).default("0").notNull(),
  
  // Configurações de Horário
  workingDaysPerMonth: int("workingDaysPerMonth").default(22).notNull(),
  workingHoursPerDay: decimal("workingHoursPerDay", { precision: 4, scale: 2 }).default("8").notNull(),
  
  // Metadados
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PricingSettings = typeof pricingSettings.$inferSelect;
export type InsertPricingSettings = typeof pricingSettings.$inferInsert;

// Tabela de Planos de Assinatura
export const subscriptionPlans = mysqlTable("subscriptionPlans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  stripePriceId: varchar("stripePriceId", { length: 255 }).notNull().unique(),
  stripeProductId: varchar("stripeProductId", { length: 255 }).notNull(),
  billingInterval: mysqlEnum("billingInterval", ["monthly", "yearly"]).default("monthly").notNull(),
  features: text("features"), // JSON array de features
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

// Tabela de Assinaturas de Usuários
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: int("planId").notNull().references(() => subscriptionPlans.id, { onDelete: "restrict" }),
  
  // Stripe IDs
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }).notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).notNull().unique(),
  
  // Status da Assinatura
  status: mysqlEnum("status", ["active", "past_due", "canceled", "paused"]).default("active").notNull(),
  
  // Datas
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  canceledAt: timestamp("canceledAt"),
  
  // Metadados
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// Tabela de Pagamentos/Invoices
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: int("subscriptionId").references(() => subscriptions.id, { onDelete: "set null" }),
  
  // Stripe IDs
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).notNull().unique(),
  stripeInvoiceId: varchar("stripeInvoiceId", { length: 255 }),
  
  // Informações de Pagamento
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  status: mysqlEnum("status", ["succeeded", "processing", "requires_payment_method", "failed"]).default("processing").notNull(),
  
  // Metadados
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
