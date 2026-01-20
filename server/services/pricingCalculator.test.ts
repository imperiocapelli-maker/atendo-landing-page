import { describe, it, expect } from "vitest";
import { PricingCalculator } from "./pricingCalculator";

describe("PricingCalculator", () => {
  const mockCosts = {
    rentCost: 2000,
    employeeCount: 2,
    averageSalary: 3000,
    utilitiesCost: 500,
    insuranceCost: 300,
    maintenanceCost: 200,
    marketingCost: 400,
    materialsCost: 1000,
    softwareLicenses: 200,
    otherCosts: 100,
  };

  const mockConfig = {
    desiredProfitMargin: 30,
    workingDaysPerMonth: 22,
    workingHoursPerDay: 8,
    averageServiceDuration: 60,
  };

  it("should calculate total monthly cost correctly", () => {
    const total = PricingCalculator.calculateTotalMonthlyCost(mockCosts);
    
    // Esperado: 2000 (aluguel) + 6000 (2*3000 salários) + 500 + 300 + 200 + 400 + 1000 + 200 + 100 = 10700
    expect(total).toBe(10700);
  });

  it("should calculate cost per unit correctly", () => {
    const total = PricingCalculator.calculateTotalMonthlyCost(mockCosts);
    const { costPerDay, costPerHour } = PricingCalculator.calculateCostsPerUnit(
      total,
      mockConfig.workingDaysPerMonth,
      mockConfig.workingHoursPerDay
    );

    // costPerDay = 10700 / 22 = 486.36
    expect(costPerDay).toBeCloseTo(486.36, 1);
    
    // costPerHour = 486.36 / 8 = 60.82
    expect(costPerHour).toBeCloseTo(60.82, 1);
  });

  it("should calculate cost per service correctly", () => {
    const total = PricingCalculator.calculateTotalMonthlyCost(mockCosts);
    const { costPerHour } = PricingCalculator.calculateCostsPerUnit(
      total,
      mockConfig.workingDaysPerMonth,
      mockConfig.workingHoursPerDay
    );
    
    const costPerService = PricingCalculator.calculateCostPerService(
      costPerHour,
      mockConfig.averageServiceDuration
    );

    // 60.82 * (60/60) = 60.82
    expect(costPerService).toBeCloseTo(60.82, 1);
  });

  it("should calculate suggested price with profit margin", () => {
    const total = PricingCalculator.calculateTotalMonthlyCost(mockCosts);
    const { costPerHour } = PricingCalculator.calculateCostsPerUnit(
      total,
      mockConfig.workingDaysPerMonth,
      mockConfig.workingHoursPerDay
    );
    const costPerService = PricingCalculator.calculateCostPerService(
      costPerHour,
      mockConfig.averageServiceDuration
    );

    const suggestedPrice = PricingCalculator.calculateSuggestedPrice(
      costPerService,
      mockConfig.desiredProfitMargin
    );

    // 60.82 * 1.30 = 79.07
    expect(suggestedPrice).toBeCloseTo(79.07, 1);
  });

  it("should calculate services per period correctly", () => {
    const { servicesPerDay, servicesPerMonth } = PricingCalculator.calculateServicesPerPeriod(
      mockConfig.workingHoursPerDay,
      mockConfig.averageServiceDuration,
      mockConfig.workingDaysPerMonth
    );

    // servicesPerDay = 8 * 60 / 60 = 8
    expect(servicesPerDay).toBe(8);
    
    // servicesPerMonth = 8 * 22 = 176
    expect(servicesPerMonth).toBe(176);
  });

  it("should calculate complete pricing correctly", () => {
    const result = PricingCalculator.calculatePricing(mockCosts, mockConfig);

    expect(result).toHaveProperty("totalMonthlyCost");
    expect(result).toHaveProperty("costPerDay");
    expect(result).toHaveProperty("costPerHour");
    expect(result).toHaveProperty("costPerService");
    expect(result).toHaveProperty("suggestedServicePrice");
    expect(result).toHaveProperty("suggestedHourlyRate");
    expect(result).toHaveProperty("servicesPerDay");
    expect(result).toHaveProperty("servicesPerMonth");
    expect(result).toHaveProperty("projectedMonthlyRevenue");
    expect(result).toHaveProperty("projectedMonthlyProfit");
    expect(result).toHaveProperty("profitMarginAchieved");
    expect(result).toHaveProperty("costBreakdown");

    // Verificar valores
    expect(result.totalMonthlyCost).toBe(10700);
    expect(result.servicesPerMonth).toBe(176);
    expect(result.suggestedServicePrice).toBeCloseTo(79.07, 1);
    
    // Verificar que a margem de lucro está próxima da desejada (pode ser um pouco menor devido aos custos fixos)
    expect(result.profitMarginAchieved).toBeGreaterThan(20);
    expect(result.profitMarginAchieved).toBeLessThan(35);
  });

  it("should handle zero costs", () => {
    const zeroCosts = {
      rentCost: 0,
      employeeCount: 0,
      averageSalary: 0,
      utilitiesCost: 0,
      insuranceCost: 0,
      maintenanceCost: 0,
      marketingCost: 0,
      materialsCost: 0,
      softwareLicenses: 0,
      otherCosts: 0,
    };

    const total = PricingCalculator.calculateTotalMonthlyCost(zeroCosts);
    expect(total).toBe(0);
  });

  it("should calculate cost breakdown correctly", () => {
    const result = PricingCalculator.calculatePricing(mockCosts, mockConfig);

    expect(result.costBreakdown.personnel).toBe(6000);
    expect(result.costBreakdown.rent).toBe(2000);
    expect(result.costBreakdown.utilities).toBe(500);
    expect(result.costBreakdown.insurance).toBe(300);
    expect(result.costBreakdown.maintenance).toBe(200);
    expect(result.costBreakdown.marketing).toBe(400);
    expect(result.costBreakdown.materials).toBe(1000);
    expect(result.costBreakdown.software).toBe(200);
    expect(result.costBreakdown.other).toBe(100);
  });
});
