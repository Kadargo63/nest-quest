import { calculateMonthlyPrincipalAndInterest, roundCurrency } from '@/lib/calculations/mortgage';

export type ScenarioCalculationInput = {
  currentEstimatedValue?: number;
  currentMortgageBalance?: number;
  expectedSalePrice?: number;
  sellingCostPercent?: number;
  targetPrice?: number;
  downPaymentAmount?: number;
  loanRate?: number;
  loanTermMonths?: number;
  taxMonthly?: number;
  insuranceMonthly?: number;
  hoaMonthly?: number;
  maintenanceMonthly?: number;
  nonHousingMonthlyDebt?: number;
  grossMonthlyIncome?: number;
  rentEstimateMonthly?: number;
  vacancyPercent?: number;
  propertyManagementPercent?: number;
  maintenanceReservePercent?: number;
  currentMortgagePayment?: number;
  buyerClosingCosts?: number;
  movingCosts?: number;
  contributorDownPaymentSupport?: number;
};

export type ScenarioCalculationResult = {
  equityDollars: number;
  equityPercent: number;
  netSaleProceeds: number;
  newMortgageAmount: number;
  projectedPaymentMonthly: number;
  totalMonthlyHousingCost: number;
  totalMonthlyDebt: number;
  dtiProxy: number;
  rentalCashFlowMonthly: number;
  cashRequiredToClose: number;
};

export function calculateScenario(input: ScenarioCalculationInput): ScenarioCalculationResult {
  const currentEstimatedValue = input.currentEstimatedValue ?? 0;
  const currentMortgageBalance = input.currentMortgageBalance ?? 0;
  const expectedSalePrice = input.expectedSalePrice ?? 0;
  const sellingCostPercent = input.sellingCostPercent ?? 0;
  const targetPrice = input.targetPrice ?? 0;
  const downPaymentAmount = input.downPaymentAmount ?? 0;
  const loanRate = input.loanRate ?? 0;
  const loanTermMonths = input.loanTermMonths ?? 360;
  const taxMonthly = input.taxMonthly ?? 0;
  const insuranceMonthly = input.insuranceMonthly ?? 0;
  const hoaMonthly = input.hoaMonthly ?? 0;
  const maintenanceMonthly = input.maintenanceMonthly ?? 0;
  const nonHousingMonthlyDebt = input.nonHousingMonthlyDebt ?? 0;
  const grossMonthlyIncome = input.grossMonthlyIncome ?? 0;
  const rentEstimateMonthly = input.rentEstimateMonthly ?? 0;
  const vacancyPercent = input.vacancyPercent ?? 0;
  const propertyManagementPercent = input.propertyManagementPercent ?? 0;
  const maintenanceReservePercent = input.maintenanceReservePercent ?? 0;
  const currentMortgagePayment = input.currentMortgagePayment ?? 0;
  const buyerClosingCosts = input.buyerClosingCosts ?? 0;
  const movingCosts = input.movingCosts ?? 0;
  const contributorDownPaymentSupport = input.contributorDownPaymentSupport ?? 0;

  const equityDollars = roundCurrency(currentEstimatedValue - currentMortgageBalance);
  const equityPercent = currentEstimatedValue > 0 ? roundCurrency(equityDollars / currentEstimatedValue) : 0;
  const sellingCosts = roundCurrency(expectedSalePrice * (sellingCostPercent / 100));
  const netSaleProceeds = roundCurrency(expectedSalePrice - sellingCosts - currentMortgageBalance);

  const newMortgageAmount = roundCurrency(Math.max(0, targetPrice - downPaymentAmount));
  const projectedPaymentMonthly = calculateMonthlyPrincipalAndInterest(newMortgageAmount, loanRate, loanTermMonths);
  const totalMonthlyHousingCost = roundCurrency(
    projectedPaymentMonthly + taxMonthly + insuranceMonthly + hoaMonthly + maintenanceMonthly,
  );
  const totalMonthlyDebt = roundCurrency(totalMonthlyHousingCost + nonHousingMonthlyDebt);
  const dtiProxy = grossMonthlyIncome > 0 ? roundCurrency(totalMonthlyDebt / grossMonthlyIncome) : 0;

  const vacancyReserve = roundCurrency(rentEstimateMonthly * (vacancyPercent / 100));
  const propertyManagement = roundCurrency(rentEstimateMonthly * (propertyManagementPercent / 100));
  const maintenanceReserve = roundCurrency(rentEstimateMonthly * (maintenanceReservePercent / 100));
  const rentalCashFlowMonthly = roundCurrency(
    rentEstimateMonthly - vacancyReserve - propertyManagement - maintenanceReserve - currentMortgagePayment,
  );

  const cashRequiredToClose = roundCurrency(
    Math.max(0, downPaymentAmount + buyerClosingCosts + movingCosts - netSaleProceeds - contributorDownPaymentSupport),
  );

  return {
    equityDollars,
    equityPercent,
    netSaleProceeds,
    newMortgageAmount,
    projectedPaymentMonthly,
    totalMonthlyHousingCost,
    totalMonthlyDebt,
    dtiProxy,
    rentalCashFlowMonthly,
    cashRequiredToClose,
  };
}
