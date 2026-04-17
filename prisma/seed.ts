import { PrismaClient, QuestRole, PropertyRole, WatchlistStatus, HouseholdRole, HouseholdStatus, ContributorType, ConfidenceLevel, LiabilityType, DreamCategory, DreamPriority, StrategyType, ContributorMode } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const rob = await prisma.user.upsert({
    where: { email: 'rob@example.com' },
    update: {},
    create: { email: 'rob@example.com', displayName: 'Rob' },
  });

  const husband = await prisma.user.upsert({
    where: { email: 'husband@example.com' },
    update: {},
    create: { email: 'husband@example.com', displayName: 'Husband' },
  });

  const mom = await prisma.user.upsert({
    where: { email: 'mom@example.com' },
    update: {},
    create: { email: 'mom@example.com', displayName: 'Mom' },
  });

  const quest = await prisma.quest.create({
    data: {
      name: 'Rob + Husband NestQuest',
      description: 'Primary shared planning workspace for move, garden, and multigenerational scenarios.',
      ownerUserId: rob.id,
      targetTimeline: '12-18 months',
      defaultLocation: 'Dallas-Fort Worth',
      members: {
        create: [
          { userId: rob.id, role: QuestRole.owner, invitationStatus: 'accepted' },
          { userId: husband.id, role: QuestRole.co_planner, invitationStatus: 'accepted' },
          { userId: mom.id, role: QuestRole.contributor, invitationStatus: 'accepted' },
        ],
      },
    },
  });

  const currentHome = await prisma.property.create({
    data: {
      questId: quest.id,
      propertyRole: PropertyRole.current_primary,
      addressLine1: '101 Current Home Dr',
      city: 'Fort Worth',
      state: 'TX',
      postalCode: '76101',
      estimatedValue: 410000,
      purchasePrice: 315000,
      squareFeet: 2100,
      lotSize: 0.22,
      yardSize: 4500,
      beds: 4,
      baths: 2.5,
      yearBuilt: 2008,
      garageSpaces: 2,
      taxMonthly: 650,
      insuranceMonthly: 185,
      hoaMonthly: 55,
      watchlistStatus: WatchlistStatus.researching,
      sourceType: 'manual',
      createdByUserId: rob.id,
      fitProfile: {
        create: {
          multigenerationalFit: 'medium',
          privacyFit: 'low',
          agingInPlaceFit: 'low',
          accessibilityFit: 'low',
          expansionPotential: 'medium',
          dreamFitSummary: 'Usable but limited for greenhouse, parents, and larger garden vision.',
        },
      },
      landProfile: {
        create: {
          sunlightQuality: 'medium',
          soilQuality: 'fair',
          drainageQuality: 'good',
          floodRisk: 'low',
          slopeUsability: 'high',
          greenhouseFeasibility: 'medium',
          conservatoryFeasibility: 'low',
          gardenFeasibility: 'medium',
          beehiveSuitability: 'low',
          pollinatorPotential: 'medium',
          irrigationFeasibility: 'medium',
          hoaOrZoningConstraintRisk: 'medium',
          sourceType: 'manual',
        },
      },
    },
  });

  await prisma.liability.createMany({
    data: [
      { questId: quest.id, linkedPropertyId: currentHome.id, liabilityType: LiabilityType.mortgage, lenderName: 'Primary Mortgage Co', currentBalance: 248000, interestRate: 3.25, monthlyPayment: 1540, variablePaymentFlag: false, notes: 'Current primary mortgage' },
      { questId: quest.id, liabilityType: LiabilityType.student_loan, lenderName: 'Federal Student Aid', currentBalance: 28500, interestRate: 5.1, monthlyPayment: 320, variablePaymentFlag: false },
      { questId: quest.id, liabilityType: LiabilityType.credit_card, lenderName: 'Rewards Card', currentBalance: 8900, interestRate: 21.99, monthlyPayment: 240, variablePaymentFlag: true },
      { questId: quest.id, liabilityType: LiabilityType.auto_loan, lenderName: 'Auto Bank', currentBalance: 14500, interestRate: 4.2, monthlyPayment: 365, variablePaymentFlag: false },
    ],
  });

  const momMember = await prisma.householdMember.create({
    data: {
      questId: quest.id,
      displayName: 'Mom',
      role: HouseholdRole.parent,
      status: HouseholdStatus.future_household,
      estimatedMoveInTimeline: '12-24 months',
      bedroomNeed: 'private suite preferred',
      bathroomNeed: 'easy access',
      accessibilityNeedLevel: 'medium',
      privacyNeedLevel: 'high',
      notes: 'May contribute monthly if she joins the household.',
    },
  });

  await prisma.householdMember.create({
    data: {
      questId: quest.id,
      displayName: 'Mother-in-law',
      role: HouseholdRole.in_law,
      status: HouseholdStatus.future_household,
      estimatedMoveInTimeline: '6-12 months',
      bedroomNeed: 'private bedroom',
      bathroomNeed: 'shared ok',
      accessibilityNeedLevel: 'medium',
      privacyNeedLevel: 'medium',
      notes: 'Move-in expected sooner than parents.',
    },
  });

  await prisma.financialContributor.create({
    data: {
      questId: quest.id,
      linkedUserId: mom.id,
      linkedHouseholdMemberId: momMember.id,
      contributionType: ContributorType.fixed_monthly,
      amount: 900,
      startTimeline: 'when moved in',
      confidenceLevel: ConfidenceLevel.medium,
      notes: 'Mom contribution if shared household plan moves forward.',
      enteredByUserId: mom.id,
    },
  });

  await prisma.dreamTarget.createMany({
    data: [
      { questId: quest.id, name: 'Greenhouse or room to build one', category: DreamCategory.greenhouse, priority: DreamPriority.must_have },
      { questId: quest.id, name: 'Lush backyard garden', category: DreamCategory.garden, priority: DreamPriority.must_have },
      { questId: quest.id, name: 'Beehive suitability', category: DreamCategory.homestead, priority: DreamPriority.strong_preference },
      { questId: quest.id, name: 'Multigenerational living capacity', category: DreamCategory.multigenerational, priority: DreamPriority.must_have },
      { questId: quest.id, name: 'Low flood risk', category: DreamCategory.other, priority: DreamPriority.non_negotiable },
    ],
  });

  const targetA = await prisma.property.create({
    data: {
      questId: quest.id,
      propertyRole: PropertyRole.target_candidate,
      addressLine1: '22 Garden Terrace',
      city: 'Aledo',
      state: 'TX',
      postalCode: '76008',
      listingUrl: 'https://example.com/listings/22-garden-terrace',
      listingPrice: 575000,
      targetOfferPrice: 560000,
      squareFeet: 3120,
      lotSize: 0.62,
      yardSize: 18000,
      beds: 5,
      baths: 3.5,
      yearBuilt: 2016,
      garageSpaces: 3,
      hoaMonthly: 40,
      taxMonthly: 880,
      insuranceMonthly: 240,
      watchlistStatus: WatchlistStatus.serious_contender,
      sourceType: 'listing_url',
      createdByUserId: rob.id,
      fitProfile: {
        create: {
          multigenerationalFit: 'high',
          privacyFit: 'high',
          agingInPlaceFit: 'medium',
          accessibilityFit: 'medium',
          expansionPotential: 'high',
          dreamFitSummary: 'Strong candidate for greenhouse, garden, and future parent/in-law support.',
        },
      },
      landProfile: {
        create: {
          sunlightQuality: 'high',
          soilQuality: 'good',
          drainageQuality: 'good',
          floodRisk: 'low',
          slopeUsability: 'high',
          greenhouseFeasibility: 'high',
          conservatoryFeasibility: 'medium',
          gardenFeasibility: 'high',
          beehiveSuitability: 'high',
          pollinatorPotential: 'high',
          irrigationFeasibility: 'medium',
          hoaOrZoningConstraintRisk: 'low',
          sourceType: 'external_data',
        },
      },
    },
  });

  const targetB = await prisma.property.create({
    data: {
      questId: quest.id,
      propertyRole: PropertyRole.target_candidate,
      addressLine1: '88 Courtyard Lane',
      city: 'Benbrook',
      state: 'TX',
      postalCode: '76126',
      listingUrl: 'https://example.com/listings/88-courtyard-lane',
      listingPrice: 495000,
      targetOfferPrice: 485000,
      squareFeet: 2680,
      lotSize: 0.31,
      yardSize: 8200,
      beds: 4,
      baths: 3,
      yearBuilt: 2012,
      garageSpaces: 2,
      hoaMonthly: 0,
      taxMonthly: 710,
      insuranceMonthly: 210,
      watchlistStatus: WatchlistStatus.interested,
      sourceType: 'listing_url',
      createdByUserId: rob.id,
      fitProfile: {
        create: {
          multigenerationalFit: 'medium',
          privacyFit: 'medium',
          agingInPlaceFit: 'medium',
          accessibilityFit: 'medium',
          expansionPotential: 'medium',
          dreamFitSummary: 'Good courtyard and lifestyle potential, but less ideal for beehives and extended family layout.',
        },
      },
      landProfile: {
        create: {
          sunlightQuality: 'medium',
          soilQuality: 'fair',
          drainageQuality: 'good',
          floodRisk: 'low',
          slopeUsability: 'medium',
          greenhouseFeasibility: 'medium',
          conservatoryFeasibility: 'high',
          gardenFeasibility: 'medium',
          beehiveSuitability: 'low',
          pollinatorPotential: 'medium',
          irrigationFeasibility: 'medium',
          hoaOrZoningConstraintRisk: 'low',
          sourceType: 'manual',
        },
      },
    },
  });

  const sellScenario = await prisma.scenario.create({
    data: {
      questId: quest.id,
      name: 'Sell current home and buy Garden Terrace',
      currentPropertyId: currentHome.id,
      targetPropertyId: targetA.id,
      strategyType: StrategyType.sell_and_buy,
      expectedSalePrice: 405000,
      sellingCostPercent: 7,
      downPaymentPercent: 20,
      downPaymentAmount: 112000,
      loanRate: 6.5,
      loanTermMonths: 360,
      closingCostsBuy: 12000,
      closingCostsSell: 28000,
      movingCosts: 5500,
      contributorMode: ContributorMode.partial,
      moveInTimeline: '6-9 months',
      notes: 'Primary balanced scenario using sale proceeds.',
      createdByUserId: rob.id,
    },
  });

  await prisma.scenarioResult.create({
    data: {
      scenarioId: sellScenario.id,
      netSaleProceeds: 128650,
      equityDollars: 162000,
      equityPercent: 0.395,
      retainedEquity: 0,
      newMortgageAmount: 448000,
      projectedPaymentMonthly: 2832,
      totalMonthlyHousingCost: 3962,
      totalMonthlyDebt: 4887,
      dtiProxy: 0.39,
      rentalCashFlowMonthly: 0,
      cashRequiredToClose: 32950,
      oneYearOutcome: 18500,
      fiveYearOutcome: 128000,
      affordabilityScore: 76,
      riskScore: 69,
      dreamFitScore: 91,
      multigenerationalFitScore: 84,
      landSuitabilityScore: 90,
      portfolioGrowthScore: 62,
      recommendationLabel: 'best_balanced_option',
      recommendationSummary: 'Strong overall fit with garden, greenhouse, beehive, and multigenerational upside. Requires disciplined cash-to-close planning but is achievable with sale proceeds.',
    },
  });

  const rentScenario = await prisma.scenario.create({
    data: {
      questId: quest.id,
      name: 'Rent current home and buy Garden Terrace',
      currentPropertyId: currentHome.id,
      targetPropertyId: targetA.id,
      strategyType: StrategyType.rent_and_buy,
      expectedSalePrice: 405000,
      rentEstimateMonthly: 2650,
      vacancyPercent: 5,
      propertyManagementPercent: 8,
      maintenanceReservePercent: 7,
      downPaymentPercent: 15,
      downPaymentAmount: 84000,
      loanRate: 6.75,
      loanTermMonths: 360,
      closingCostsBuy: 12000,
      movingCosts: 6500,
      contributorMode: ContributorMode.partial,
      moveInTimeline: '9-12 months',
      notes: 'Long-term wealth path with more complexity.',
      createdByUserId: husband.id,
    },
  });

  await prisma.scenarioResult.create({
    data: {
      scenarioId: rentScenario.id,
      netSaleProceeds: 0,
      equityDollars: 162000,
      equityPercent: 0.395,
      retainedEquity: 162000,
      newMortgageAmount: 476000,
      projectedPaymentMonthly: 3087,
      totalMonthlyHousingCost: 4217,
      totalMonthlyDebt: 5142,
      dtiProxy: 0.41,
      rentalCashFlowMonthly: 155,
      cashRequiredToClose: 102500,
      oneYearOutcome: 24200,
      fiveYearOutcome: 176500,
      affordabilityScore: 58,
      riskScore: 51,
      dreamFitScore: 91,
      multigenerationalFitScore: 84,
      landSuitabilityScore: 90,
      portfolioGrowthScore: 86,
      recommendationLabel: 'best_long_term_wealth_option',
      recommendationSummary: 'Best long-term wealth path if cash flow remains stable. Harder near-term close due to higher cash requirement and more moving pieces.',
    },
  });

  await prisma.propertyComment.createMany({
    data: [
      { propertyId: targetA.id, userId: rob.id, body: 'This backyard looks ideal for greenhouse placement and a larger pollinator garden.', tag: 'garden' },
      { propertyId: targetA.id, userId: husband.id, body: 'Layout seems promising for mother-in-law and future parents, especially with extra bedroom separation.', tag: 'parents' },
      { propertyId: targetB.id, userId: mom.id, body: 'I like the courtyard concept, but this feels less flexible if more family joins later.', tag: 'fit' },
    ],
  });

  console.log('Seed complete');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
