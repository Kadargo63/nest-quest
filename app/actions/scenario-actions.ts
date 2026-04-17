'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateScenario } from '@/lib/calculations/scenario-engine';
import { buildRecommendation } from '@/lib/recommendations';
import { StrategyType } from '@prisma/client';

const createScenarioSchema = z.object({
  questId: z.string().min(1),
  name: z.string().min(1),
  currentPropertyId: z.string().optional(),
  targetPropertyId: z.string().optional(),
  strategyType: z.nativeEnum(StrategyType),
  expectedSalePrice: z.coerce.number().optional(),
  sellingCostPercent: z.coerce.number().optional(),
  rentEstimateMonthly: z.coerce.number().optional(),
  vacancyPercent: z.coerce.number().optional(),
  propertyManagementPercent: z.coerce.number().optional(),
  maintenanceReservePercent: z.coerce.number().optional(),
  downPaymentAmount: z.coerce.number().optional(),
  loanRate: z.coerce.number().optional(),
  loanTermMonths: z.coerce.number().optional(),
  closingCostsBuy: z.coerce.number().optional(),
  movingCosts: z.coerce.number().optional(),
});

export async function createScenarioAction(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = createScenarioSchema.parse({
    questId: formData.get('questId'),
    name: formData.get('name'),
    currentPropertyId: formData.get('currentPropertyId') || undefined,
    targetPropertyId: formData.get('targetPropertyId') || undefined,
    strategyType: formData.get('strategyType'),
    expectedSalePrice: formData.get('expectedSalePrice') || undefined,
    sellingCostPercent: formData.get('sellingCostPercent') || undefined,
    rentEstimateMonthly: formData.get('rentEstimateMonthly') || undefined,
    vacancyPercent: formData.get('vacancyPercent') || undefined,
    propertyManagementPercent: formData.get('propertyManagementPercent') || undefined,
    maintenanceReservePercent: formData.get('maintenanceReservePercent') || undefined,
    downPaymentAmount: formData.get('downPaymentAmount') || undefined,
    loanRate: formData.get('loanRate') || undefined,
    loanTermMonths: formData.get('loanTermMonths') || undefined,
    closingCostsBuy: formData.get('closingCostsBuy') || undefined,
    movingCosts: formData.get('movingCosts') || undefined,
  });

  await prisma.scenario.create({
    data: {
      ...parsed,
      createdByUserId: user.id,
      contributorMode: 'none',
    },
  });

  revalidatePath(`/quests/${parsed.questId}`);
}

export async function runScenarioAction(formData: FormData) {
  const scenarioId = String(formData.get('scenarioId'));
  const grossMonthlyIncome = Number(formData.get('grossMonthlyIncome') || 12000);

  const scenario = await prisma.scenario.findUnique({
    where: { id: scenarioId },
    include: {
      currentProperty: true,
      targetProperty: true,
      quest: {
        include: {
          liabilities: true,
          contributors: true,
        },
      },
    },
  });

  if (!scenario) throw new Error('Scenario not found');

  const currentMortgageLiability = scenario.quest.liabilities.find(
    (item) => item.linkedPropertyId === scenario.currentPropertyId && item.liabilityType === 'mortgage',
  );

  const nonHousingMonthlyDebt = scenario.quest.liabilities
    .filter((item) => item.liabilityType !== 'mortgage')
    .reduce((sum, item) => sum + Number(item.monthlyPayment), 0);

  const contributorDownPaymentSupport = scenario.quest.contributors
    .filter((item) => item.contributionType === 'down_payment_support')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const result = calculateScenario({
    currentEstimatedValue: Number(scenario.currentProperty?.estimatedValue || 0),
    currentMortgageBalance: Number(currentMortgageLiability?.currentBalance || 0),
    expectedSalePrice: Number(scenario.expectedSalePrice || 0),
    sellingCostPercent: Number(scenario.sellingCostPercent || 0),
    targetPrice: Number(scenario.targetProperty?.targetOfferPrice || scenario.targetProperty?.listingPrice || 0),
    downPaymentAmount: Number(scenario.downPaymentAmount || 0),
    loanRate: Number(scenario.loanRate || 0),
    loanTermMonths: Number(scenario.loanTermMonths || 360),
    taxMonthly: Number(scenario.targetProperty?.taxMonthly || 0),
    insuranceMonthly: Number(scenario.targetProperty?.insuranceMonthly || 0),
    hoaMonthly: Number(scenario.targetProperty?.hoaMonthly || 0),
    maintenanceMonthly: 0,
    nonHousingMonthlyDebt,
    grossMonthlyIncome,
    rentEstimateMonthly: Number(scenario.rentEstimateMonthly || 0),
    vacancyPercent: Number(scenario.vacancyPercent || 0),
    propertyManagementPercent: Number(scenario.propertyManagementPercent || 0),
    maintenanceReservePercent: Number(scenario.maintenanceReservePercent || 0),
    currentMortgagePayment: Number(currentMortgageLiability?.monthlyPayment || 0),
    buyerClosingCosts: Number(scenario.closingCostsBuy || 0),
    movingCosts: Number(scenario.movingCosts || 0),
    contributorDownPaymentSupport,
  });

  const recommendation = buildRecommendation(result);

  await prisma.scenarioResult.create({
    data: {
      scenarioId,
      netSaleProceeds: result.netSaleProceeds,
      equityDollars: result.equityDollars,
      equityPercent: result.equityPercent,
      retainedEquity: scenario.strategyType === 'rent_and_buy' ? result.equityDollars : 0,
      newMortgageAmount: result.newMortgageAmount,
      projectedPaymentMonthly: result.projectedPaymentMonthly,
      totalMonthlyHousingCost: result.totalMonthlyHousingCost,
      totalMonthlyDebt: result.totalMonthlyDebt,
      dtiProxy: result.dtiProxy,
      rentalCashFlowMonthly: result.rentalCashFlowMonthly,
      cashRequiredToClose: result.cashRequiredToClose,
      affordabilityScore: recommendation.affordabilityScore,
      riskScore: recommendation.riskScore,
      recommendationLabel: recommendation.label,
      recommendationSummary: recommendation.summary,
    },
  });

  revalidatePath(`/scenarios/${scenarioId}`);
  revalidatePath(`/quests/${scenario.questId}`);
}
