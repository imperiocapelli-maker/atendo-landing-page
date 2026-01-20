import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { PricingCalculator } from "../services/pricingCalculator";
import {
  upsertFixedCosts,
  getFixedCosts,
  upsertPricingConfig,
  getPricingConfig,
  createPricingHistory,
  getPricingHistory,
  getLatestPricingHistory,
} from "../db";

export const pricingRouter = router({
  // Salvar custos fixos
  saveFixedCosts: protectedProcedure
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
        currency: z.string().default("BRL"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await upsertFixedCosts(ctx.user.id, input as any);
    }),

  // Obter custos fixos
  getFixedCosts: protectedProcedure.query(async ({ ctx }) => {
    return await getFixedCosts(ctx.user.id);
  }),

  // Salvar configuração de precificação
  savePricingConfig: protectedProcedure
    .input(
      z.object({
        desiredProfitMargin: z.number().min(0).max(200).default(30),
        workingDaysPerMonth: z.number().int().min(1).max(31).default(22),
        workingHoursPerDay: z.number().min(0.5).max(24).default(8),
        averageServiceDuration: z.number().int().min(5).max(480).default(60),
        currency: z.string().default("BRL"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await upsertPricingConfig(ctx.user.id, input as any);
    }),

  // Obter configuração de precificação
  getPricingConfig: protectedProcedure.query(async ({ ctx }) => {
    return await getPricingConfig(ctx.user.id);
  }),

  // Calcular precificação
  calculatePricing: protectedProcedure.mutation(async ({ ctx }) => {
    const costs = await getFixedCosts(ctx.user.id);
    const config = await getPricingConfig(ctx.user.id);

    if (!costs || !config) {
      throw new Error("Custos fixos ou configuração de precificação não encontrados");
    }

    const result = PricingCalculator.calculatePricing(
      {
        rentCost: parseFloat(costs.rentCost.toString()),
        employeeCount: costs.employeeCount,
        averageSalary: parseFloat(costs.averageSalary.toString()),
        utilitiesCost: parseFloat(costs.utilitiesCost.toString()),
        insuranceCost: parseFloat(costs.insuranceCost.toString()),
        maintenanceCost: parseFloat(costs.maintenanceCost.toString()),
        marketingCost: parseFloat(costs.marketingCost.toString()),
        materialsCost: parseFloat(costs.materialsCost.toString()),
        softwareLicenses: parseFloat(costs.softwareLicenses.toString()),
        otherCosts: parseFloat(costs.otherCosts.toString()),
      },
      {
        desiredProfitMargin: parseFloat(config.desiredProfitMargin.toString()),
        workingDaysPerMonth: config.workingDaysPerMonth,
        workingHoursPerDay: parseFloat(config.workingHoursPerDay.toString()),
        averageServiceDuration: parseFloat(config.averageServiceDuration.toString()),
      }
    );

    // Salvar no histórico
    const history = await createPricingHistory({
      userId: ctx.user.id,
      totalMonthlyCost: result.totalMonthlyCost.toString(),
      costPerDay: result.costPerDay.toString(),
      costPerHour: result.costPerHour.toString(),
      costPerService: result.costPerService.toString(),
      suggestedServicePrice: result.suggestedServicePrice.toString(),
      suggestedHourlyRate: result.suggestedHourlyRate.toString(),
      projectedMonthlyRevenue: result.projectedMonthlyRevenue.toString(),
      projectedMonthlyProfit: result.projectedMonthlyProfit.toString(),
      profitMarginAchieved: result.profitMarginAchieved.toString(),
      currency: costs.currency,
    } as any)

    return result;
  }),

  // Obter histórico de precificação
  getPricingHistory: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(10) }))
    .query(async ({ ctx, input }) => {
      return await getPricingHistory(ctx.user.id, input.limit);
    }),

  // Obter última precificação
  getLatestPricing: protectedProcedure.query(async ({ ctx }) => {
    return await getLatestPricingHistory(ctx.user.id);
  }),
});
