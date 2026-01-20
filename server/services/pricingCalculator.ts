import { Decimal } from "decimal.js";

export interface CostCalculationInput {
  rentCost: number;
  employeeCount: number;
  averageSalary: number;
  utilitiesCost: number;
  insuranceCost: number;
  maintenanceCost: number;
  marketingCost: number;
  materialsCost: number;
  softwareLicenses: number;
  otherCosts: number;
}

export interface PricingConfigInput {
  desiredProfitMargin: number; // Percentual (ex: 30 = 30%)
  workingDaysPerMonth: number;
  workingHoursPerDay: number;
  averageServiceDuration: number; // em minutos
}

export interface PricingCalculationResult {
  // Custos
  totalMonthlyCost: number;
  costPerDay: number;
  costPerHour: number;
  costPerService: number;
  
  // Preços Sugeridos
  suggestedServicePrice: number;
  suggestedHourlyRate: number;
  
  // Projeção
  servicesPerDay: number;
  servicesPerMonth: number;
  projectedMonthlyRevenue: number;
  projectedMonthlyProfit: number;
  profitMarginAchieved: number;
  
  // Breakdown
  costBreakdown: {
    personnel: number;
    rent: number;
    utilities: number;
    insurance: number;
    maintenance: number;
    marketing: number;
    materials: number;
    software: number;
    other: number;
  };
}

export class PricingCalculator {
  /**
   * Calcula o custo total mensal baseado nos custos fixos
   */
  static calculateTotalMonthlyCost(costs: CostCalculationInput): number {
    
    const personnel = new Decimal(costs.averageSalary).times(costs.employeeCount);
    const rent = new Decimal(costs.rentCost);
    const utilities = new Decimal(costs.utilitiesCost);
    const insurance = new Decimal(costs.insuranceCost);
    const maintenance = new Decimal(costs.maintenanceCost);
    const marketing = new Decimal(costs.marketingCost);
    const materials = new Decimal(costs.materialsCost);
    const software = new Decimal(costs.softwareLicenses);
    const other = new Decimal(costs.otherCosts);
    
    const total = personnel
      .plus(rent)
      .plus(utilities)
      .plus(insurance)
      .plus(maintenance)
      .plus(marketing)
      .plus(materials)
      .plus(software)
      .plus(other);
    
    return parseFloat(total.toString());
  }

  /**
   * Calcula custos por unidade de tempo
   */
  static calculateCostsPerUnit(
    totalMonthlyCost: number,
    workingDaysPerMonth: number,
    workingHoursPerDay: number
  ) {
    const costPerDay = new Decimal(totalMonthlyCost).dividedBy(workingDaysPerMonth);
    const costPerHour = costPerDay.dividedBy(workingHoursPerDay);
    
    return {
      costPerDay: parseFloat(costPerDay.toString()),
      costPerHour: parseFloat(costPerHour.toString()),
    };
  }

  /**
   * Calcula custo por serviço
   */
  static calculateCostPerService(
    costPerHour: number,
    averageServiceDuration: number
  ): number {
    const durationInHours = new Decimal(averageServiceDuration).dividedBy(60);
    const costPerService = new Decimal(costPerHour).times(durationInHours);
    
    return parseFloat(costPerService.toString());
  }

  /**
   * Calcula preço sugerido com margem de lucro
   */
  static calculateSuggestedPrice(
    costPerService: number,
    desiredProfitMargin: number
  ): number {
    const marginMultiplier = new Decimal(100).plus(desiredProfitMargin).dividedBy(100);
    const suggestedPrice = new Decimal(costPerService).times(marginMultiplier);
    
    return parseFloat(suggestedPrice.toFixed(2));
  }

  /**
   * Calcula taxa horária sugerida
   */
  static calculateSuggestedHourlyRate(
    costPerHour: number,
    desiredProfitMargin: number
  ): number {
    const marginMultiplier = new Decimal(100).plus(desiredProfitMargin).dividedBy(100);
    const suggestedRate = new Decimal(costPerHour).times(marginMultiplier);
    
    return parseFloat(suggestedRate.toFixed(2));
  }

  /**
   * Calcula quantidade de serviços por período
   */
  static calculateServicesPerPeriod(
    workingHoursPerDay: number,
    averageServiceDuration: number,
    workingDaysPerMonth: number
  ) {
    const servicesPerDay = new Decimal(workingHoursPerDay)
      .times(60)
      .dividedBy(averageServiceDuration)
      .toNumber();
    
    const servicesPerMonth = new Decimal(servicesPerDay)
      .times(workingDaysPerMonth)
      .toNumber();
    
    return {
      servicesPerDay: Math.floor(servicesPerDay),
      servicesPerMonth: Math.floor(servicesPerMonth),
    };
  }

  /**
   * Calcula projeção de receita e lucro
   */
  static calculateProjection(
    suggestedServicePrice: number,
    servicesPerMonth: number,
    totalMonthlyCost: number
  ) {
    const revenue = new Decimal(suggestedServicePrice).times(servicesPerMonth);
    const profit = revenue.minus(totalMonthlyCost);
    const profitMargin = profit.dividedBy(revenue).times(100);
    
    return {
      projectedMonthlyRevenue: parseFloat(revenue.toFixed(2)),
      projectedMonthlyProfit: parseFloat(profit.toFixed(2)),
      profitMarginAchieved: parseFloat(profitMargin.toFixed(2)),
    };
  }

  /**
   * Função principal que calcula tudo
   */
  static calculatePricing(
    costs: CostCalculationInput,
    config: PricingConfigInput
  ): PricingCalculationResult {
    // Calcular custos
    const totalMonthlyCost = this.calculateTotalMonthlyCost(costs);
    const { costPerDay, costPerHour } = this.calculateCostsPerUnit(
      totalMonthlyCost,
      config.workingDaysPerMonth,
      config.workingHoursPerDay
    );
    const costPerService = this.calculateCostPerService(costPerHour, config.averageServiceDuration);
    
    // Calcular preços sugeridos
    const suggestedServicePrice = this.calculateSuggestedPrice(costPerService, config.desiredProfitMargin);
    const suggestedHourlyRate = this.calculateSuggestedHourlyRate(costPerHour, config.desiredProfitMargin);
    
    // Calcular quantidade de serviços
    const { servicesPerDay, servicesPerMonth } = this.calculateServicesPerPeriod(
      config.workingHoursPerDay,
      config.averageServiceDuration,
      config.workingDaysPerMonth
    );
    
    // Calcular projeção
    const { projectedMonthlyRevenue, projectedMonthlyProfit, profitMarginAchieved } = this.calculateProjection(
      suggestedServicePrice,
      servicesPerMonth,
      totalMonthlyCost
    );
    
    // Breakdown de custos
    const personnel = new Decimal(costs.averageSalary).times(costs.employeeCount).toNumber();
    
    return {
      totalMonthlyCost,
      costPerDay,
      costPerHour,
      costPerService,
      suggestedServicePrice,
      suggestedHourlyRate,
      servicesPerDay,
      servicesPerMonth,
      projectedMonthlyRevenue,
      projectedMonthlyProfit,
      profitMarginAchieved,
      costBreakdown: {
        personnel,
        rent: costs.rentCost,
        utilities: costs.utilitiesCost,
        insurance: costs.insuranceCost,
        maintenance: costs.maintenanceCost,
        marketing: costs.marketingCost,
        materials: costs.materialsCost,
        software: costs.softwareLicenses,
        other: costs.otherCosts,
      },
    };
  }
}
