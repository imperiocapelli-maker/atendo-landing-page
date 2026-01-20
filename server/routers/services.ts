import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  upsertPricingSettings,
  getPricingSettings,
} from "../db";

export const servicesRouter = router({
  // Criar serviço
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        commissionPercentage: z.number().min(0).max(100).default(0),
        productCost: z.number().min(0).default(0),
        currentPrice: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await createService(ctx.user.id, input as any);
    }),

  // Obter todos os serviços
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await getServices(ctx.user.id);
  }),

  // Obter um serviço
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await getService(input.id, ctx.user.id);
    }),

  // Atualizar serviço
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        commissionPercentage: z.number().min(0).max(100).optional(),
        productCost: z.number().min(0).optional(),
        currentPrice: z.number().min(0).optional(),
        suggestedPrice: z.number().min(0).optional(),
        profitMargin: z.number().optional(),
        profitAmount: z.number().optional(),
        isActive: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await updateService(id, ctx.user.id, data as any);
    }),

  // Deletar serviço
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await deleteService(input.id, ctx.user.id);
    }),

  // Salvar configurações de precificação
  savePricingSettings: protectedProcedure
    .input(
      z.object({
        rentCost: z.number().min(0).default(0),
        employeeCount: z.number().int().min(0).default(0),
        averageSalary: z.number().min(0).default(0),
        utilitiesCost: z.number().min(0).default(0),
        insuranceCost: z.number().min(0).default(0),
        maintenanceCost: z.number().min(0).default(0),
        marketingCost: z.number().min(0).default(0),
        materialsCost: z.number().min(0).default(0),
        softwareLicenses: z.number().min(0).default(0),
        otherCosts: z.number().min(0).default(0),
        desiredProfitMargin: z.number().min(0).max(200).default(30),
        cardTaxPercentage: z.number().min(0).max(100).default(0),
        taxPercentage: z.number().min(0).max(100).default(0),
        workingDaysPerMonth: z.number().int().min(1).max(31).default(22),
        workingHoursPerDay: z.number().min(0.5).max(24).default(8),
        currency: z.string().default("BRL"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await upsertPricingSettings(ctx.user.id, input as any);
    }),

  // Obter configurações de precificação
  getPricingSettings: protectedProcedure.query(async ({ ctx }) => {
    return await getPricingSettings(ctx.user.id);
  }),
});
