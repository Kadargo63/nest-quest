// ============================================
// File: server/api/app.ts
// ============================================
import express from 'express';
import cors from 'cors';
import { questsRouter } from './routes/quests';
import { propertiesRouter } from './routes/properties';
import { householdRouter } from './routes/household';
import { contributorsRouter } from './routes/contributors';
import { liabilitiesRouter } from './routes/liabilities';
import { scenariosRouter } from './routes/scenarios';
import { activityRouter } from './routes/activity';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '5mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'nestquest-api' });
  });

  app.use('/api/quests', questsRouter);
  app.use('/api/properties', propertiesRouter);
  app.use('/api/household-members', householdRouter);
  app.use('/api/contributors', contributorsRouter);
  app.use('/api/liabilities', liabilitiesRouter);
  app.use('/api/scenarios', scenariosRouter);
  app.use('/api/activity', activityRouter);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}


// ============================================
// File: server/index.ts
// ============================================
import { createApp } from './api/app';

const port = Number(process.env.PORT || 3000);
const app = createApp();

app.listen(port, () => {
  console.log(`NestQuest API listening on port ${port}`);
});


// ============================================
// File: server/lib/prisma.ts
// ============================================
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}


// ============================================
// File: server/lib/http.ts
// ============================================
import { Response } from 'express';

export function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json(data);
}

export function badRequest(res: Response, message: string) {
  return res.status(400).json({ message });
}

export function notFound(res: Response, message = 'Not found') {
  return res.status(404).json({ message });
}


// ============================================
// File: server/lib/auth.ts
// Temporary auth shim. Replace with real auth.
// ============================================
import { Request, Response, NextFunction } from 'express';

export type RequestUser = {
  id: string;
  email: string;
};

export type AuthedRequest = Request & {
  user: RequestUser;
};

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  // TODO: Replace with real session/JWT validation.
  (req as AuthedRequest).user = {
    id: process.env.DEV_USER_ID || 'dev-user-id',
    email: process.env.DEV_USER_EMAIL || 'dev@example.com',
  };
  next();
}


// ============================================
// File: server/lib/quest-access.ts
// ============================================
import { prisma } from './prisma';

export async function assertQuestAccess(questId: string, userId: string) {
  const membership = await prisma.questMember.findFirst({
    where: {
      questId,
      userId,
    },
  });

  return Boolean(membership);
}


// ============================================
// File: server/domain/calculations/mortgage.ts
// ============================================
export function calculateMonthlyPrincipalAndInterest(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
): number {
  if (principal <= 0 || annualRatePercent <= 0 || termMonths <= 0) {
    return 0;
  }

  const monthlyRate = annualRatePercent / 100 / 12;
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths);
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;

  if (denominator === 0) {
    return 0;
  }

  return roundCurrency(numerator / denominator);
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}


// ============================================
// File: server/domain/calculations/scenario-engine.ts
// ============================================
import { calculateMonthlyPrincipalAndInterest, roundCurrency } from './mortgage';

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
  const projectedPaymentMonthly = calculateMonthlyPrincipalAndInterest(
    newMortgageAmount,
    loanRate,
    loanTermMonths,
  );

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


// ============================================
// File: server/domain/recommendations/recommendation-engine.ts
// ============================================
import { ScenarioCalculationResult } from '../calculations/scenario-engine';

export type Recommendation = {
  label: string;
  summary: string;
  affordabilityScore: number;
  riskScore: number;
};

export function buildRecommendation(result: ScenarioCalculationResult): Recommendation {
  const affordabilityScore = scoreAffordability(result.dtiProxy, result.cashRequiredToClose);
  const riskScore = scoreRisk(result.dtiProxy, result.rentalCashFlowMonthly);

  let label = 'balanced_option';
  let summary = 'Solid baseline scenario with manageable tradeoffs.';

  if (affordabilityScore >= 80 && riskScore >= 70) {
    label = 'best_balanced_option';
    summary = 'Strong overall scenario with good affordability and moderate risk.';
  } else if (result.cashRequiredToClose > 50000) {
    label = 'stretch_option';
    summary = 'Promising scenario, but cash to close is still a major hurdle.';
  } else if (result.rentalCashFlowMonthly > 0) {
    label = 'long_term_wealth_option';
    summary = 'This path appears stronger for long-term wealth, but it adds complexity.';
  }

  return {
    label,
    summary,
    affordabilityScore,
    riskScore,
  };
}

function scoreAffordability(dtiProxy: number, cashRequiredToClose: number): number {
  let score = 100;

  if (dtiProxy > 0.43) score -= 30;
  else if (dtiProxy > 0.36) score -= 15;

  if (cashRequiredToClose > 100000) score -= 30;
  else if (cashRequiredToClose > 50000) score -= 15;
  else if (cashRequiredToClose > 25000) score -= 5;

  return Math.max(0, score);
}

function scoreRisk(dtiProxy: number, rentalCashFlowMonthly: number): number {
  let score = 100;

  if (dtiProxy > 0.43) score -= 25;
  else if (dtiProxy > 0.36) score -= 10;

  if (rentalCashFlowMonthly < 0) score -= 20;
  else if (rentalCashFlowMonthly < 200) score -= 10;

  return Math.max(0, score);
}


// ============================================
// File: server/api/routes/quests.ts
// ============================================
import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthedRequest } from '../../lib/auth';
import { badRequest, notFound, ok } from '../../lib/http';

export const questsRouter = Router();

questsRouter.use(requireAuth);

questsRouter.post('/', async (req: AuthedRequest, res) => {
  const { name, description, targetTimeline, defaultLocation } = req.body;

  if (!name) {
    return badRequest(res, 'name is required');
  }

  const quest = await prisma.quest.create({
    data: {
      name,
      description,
      targetTimeline,
      defaultLocation,
      ownerUserId: req.user.id,
      members: {
        create: {
          userId: req.user.id,
          role: 'owner',
          invitationStatus: 'accepted',
        },
      },
    },
  });

  return ok(res, quest, 201);
});

questsRouter.get('/', async (req: AuthedRequest, res) => {
  const quests = await prisma.quest.findMany({
    where: {
      members: {
        some: {
          userId: req.user.id,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return ok(res, quests);
});

questsRouter.get('/:questId', async (req: AuthedRequest, res) => {
  const quest = await prisma.quest.findFirst({
    where: {
      id: req.params.questId,
      members: {
        some: { userId: req.user.id },
      },
    },
    include: {
      members: true,
    },
  });

  if (!quest) {
    return notFound(res, 'Quest not found');
  }

  return ok(res, quest);
});

questsRouter.patch('/:questId', async (req: AuthedRequest, res) => {
  const existing = await prisma.quest.findFirst({
    where: {
      id: req.params.questId,
      members: {
        some: { userId: req.user.id },
      },
    },
  });

  if (!existing) {
    return notFound(res, 'Quest not found');
  }

  const updated = await prisma.quest.update({
    where: { id: req.params.questId },
    data: {
      name: req.body.name,
      description: req.body.description,
      targetTimeline: req.body.targetTimeline,
      defaultLocation: req.body.defaultLocation,
    },
  });

  return ok(res, updated);
});

questsRouter.post('/:questId/invitations', async (req: AuthedRequest, res) => {
  const { invitedEmail, role } = req.body;

  if (!invitedEmail || !role) {
    return badRequest(res, 'invitedEmail and role are required');
  }

  const invitation = await prisma.questInvitation.create({
    data: {
      questId: req.params.questId,
      invitedEmail,
      role,
      createdByUserId: req.user.id,
    },
  });

  return ok(res, invitation, 201);
});

questsRouter.get('/:questId/members', async (req: AuthedRequest, res) => {
  const members = await prisma.questMember.findMany({
    where: { questId: req.params.questId },
    orderBy: { joinedAt: 'asc' },
  });

  return ok(res, members);
});


// ============================================
// File: server/api/routes/properties.ts
// ============================================
import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthedRequest } from '../../lib/auth';
import { badRequest, notFound, ok } from '../../lib/http';

export const propertiesRouter = Router();

propertiesRouter.use(requireAuth);

propertiesRouter.post('/analyze-listing', async (req: AuthedRequest, res) => {
  const { listingUrl } = req.body;

  if (!listingUrl) {
    return badRequest(res, 'listingUrl is required');
  }

  return ok(res, {
    listingUrl,
    draft: {
      propertyRole: 'target_candidate',
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      listingPrice: null,
      squareFeet: null,
      beds: null,
      baths: null,
      sourceType: 'listing_url',
    },
    observations: [],
  });
});

propertiesRouter.post('/:questId?', async (_req, res) => {
  return badRequest(res, 'Use /api/quests/:questId/properties');
});

propertiesRouter.get('/:propertyId', async (req: AuthedRequest, res) => {
  const property = await prisma.property.findUnique({
    where: { id: req.params.propertyId },
    include: {
      fitProfile: true,
      landProfile: true,
      comments: true,
      media: true,
      observations: true,
    },
  });

  if (!property) {
    return notFound(res, 'Property not found');
  }

  return ok(res, property);
});

propertiesRouter.patch('/:propertyId', async (req: AuthedRequest, res) => {
  const property = await prisma.property.findUnique({
    where: { id: req.params.propertyId },
  });

  if (!property) {
    return notFound(res, 'Property not found');
  }

  const updated = await prisma.property.update({
    where: { id: req.params.propertyId },
    data: req.body,
  });

  return ok(res, updated);
});

propertiesRouter.get('/:propertyId/comments', async (req: AuthedRequest, res) => {
  const comments = await prisma.propertyComment.findMany({
    where: { propertyId: req.params.propertyId },
    orderBy: { createdAt: 'asc' },
  });

  return ok(res, comments);
});

propertiesRouter.post('/:propertyId/comments', async (req: AuthedRequest, res) => {
  const { body, tag, parentCommentId } = req.body;

  if (!body) {
    return badRequest(res, 'body is required');
  }

  const comment = await prisma.propertyComment.create({
    data: {
      propertyId: req.params.propertyId,
      userId: req.user.id,
      body,
      tag,
      parentCommentId,
    },
  });

  return ok(res, comment, 201);
});

propertiesRouter.post('/:propertyId/copy', async (req: AuthedRequest, res) => {
  const { destinationQuestId } = req.body;

  if (!destinationQuestId) {
    return badRequest(res, 'destinationQuestId is required');
  }

  const source = await prisma.property.findUnique({
    where: { id: req.params.propertyId },
    include: { fitProfile: true, landProfile: true },
  });

  if (!source) {
    return notFound(res, 'Property not found');
  }

  const copied = await prisma.property.create({
    data: {
      questId: destinationQuestId,
      propertyRole: source.propertyRole,
      addressLine1: source.addressLine1,
      addressLine2: source.addressLine2,
      city: source.city,
      state: source.state,
      postalCode: source.postalCode,
      latitude: source.latitude,
      longitude: source.longitude,
      listingUrl: source.listingUrl,
      listingPrice: source.listingPrice,
      targetOfferPrice: source.targetOfferPrice,
      estimatedValue: source.estimatedValue,
      purchasePrice: source.purchasePrice,
      squareFeet: source.squareFeet,
      lotSize: source.lotSize,
      yardSize: source.yardSize,
      beds: source.beds,
      baths: source.baths,
      yearBuilt: source.yearBuilt,
      garageSpaces: source.garageSpaces,
      hoaMonthly: source.hoaMonthly,
      taxMonthly: source.taxMonthly,
      insuranceMonthly: source.insuranceMonthly,
      watchlistStatus: source.watchlistStatus,
      sourceType: source.sourceType,
      createdByUserId: req.user.id,
      fitProfile: source.fitProfile
        ? {
            create: {
              multigenerationalFit: source.fitProfile.multigenerationalFit,
              privacyFit: source.fitProfile.privacyFit,
              agingInPlaceFit: source.fitProfile.agingInPlaceFit,
              accessibilityFit: source.fitProfile.accessibilityFit,
              expansionPotential: source.fitProfile.expansionPotential,
              dreamFitSummary: source.fitProfile.dreamFitSummary,
            },
          }
        : undefined,
      landProfile: source.landProfile
        ? {
            create: {
              sunlightQuality: source.landProfile.sunlightQuality,
              soilQuality: source.landProfile.soilQuality,
              drainageQuality: source.landProfile.drainageQuality,
              floodRisk: source.landProfile.floodRisk,
              slopeUsability: source.landProfile.slopeUsability,
              greenhouseFeasibility: source.landProfile.greenhouseFeasibility,
              conservatoryFeasibility: source.landProfile.conservatoryFeasibility,
              gardenFeasibility: source.landProfile.gardenFeasibility,
              beehiveSuitability: source.landProfile.beehiveSuitability,
              pollinatorPotential: source.landProfile.pollinatorPotential,
              irrigationFeasibility: source.landProfile.irrigationFeasibility,
              hoaOrZoningConstraintRisk: source.landProfile.hoaOrZoningConstraintRisk,
              notes: source.landProfile.notes,
              sourceType: source.landProfile.sourceType,
            },
          }
        : undefined,
    },
  });

  await prisma.propertyCopyEvent.create({
    data: {
      sourcePropertyId: source.id,
      sourceQuestId: source.questId,
      destinationQuestId,
      copiedByUserId: req.user.id,
    },
  });

  return ok(res, copied, 201);
});

export const questPropertiesRouter = Router({ mergeParams: true });
questPropertiesRouter.use(requireAuth);

questPropertiesRouter.post('/', async (req: AuthedRequest, res) => {
  const questId = req.params.questId;
  if (!questId) return badRequest(res, 'questId is required');

  const property = await prisma.property.create({
    data: {
      questId,
      ...req.body,
      createdByUserId: req.user.id,
    },
  });

  return ok(res, property, 201);
});

questPropertiesRouter.get('/', async (req: AuthedRequest, res) => {
  const questId = req.params.questId;
  if (!questId) return badRequest(res, 'questId is required');

  const properties = await prisma.property.findMany({
    where: { questId },
    orderBy: { createdAt: 'desc' },
    include: {
      fitProfile: true,
      landProfile: true,
    },
  });

  return ok(res, properties);
});


// ============================================
// File: server/api/routes/household.ts
// ============================================
import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthedRequest } from '../../lib/auth';
import { badRequest, ok } from '../../lib/http';

export const householdRouter = Router();
householdRouter.use(requireAuth);

householdRouter.patch('/:id', async (req: AuthedRequest, res) => {
  const updated = await prisma.householdMember.update({
    where: { id: req.params.id },
    data: req.body,
  });

  return ok(res, updated);
});

export const questHouseholdRouter = Router({ mergeParams: true });
questHouseholdRouter.use(requireAuth);

questHouseholdRouter.post('/', async (req: AuthedRequest, res) => {
  const questId = req.params.questId;
  if (!questId) return badRequest(res, 'questId is required');

  const member = await prisma.householdMember.create({
    data: {
      questId,
      ...req.body,
    },
  });

  return ok(res, member, 201);
});


// ============================================
// File: server/api/routes/contributors.ts
// ============================================
import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthedRequest } from '../../lib/auth';
import { badRequest, ok } from '../../lib/http';

export const contributorsRouter = Router();
contributorsRouter.use(requireAuth);

contributorsRouter.patch('/:id', async (req: AuthedRequest, res) => {
  const contributor = await prisma.financialContributor.update({
    where: { id: req.params.id },
    data: req.body,
  });

  return ok(res, contributor);
});

export const questContributorsRouter = Router({ mergeParams: true });
questContributorsRouter.use(requireAuth);

questContributorsRouter.post('/', async (req: AuthedRequest, res) => {
  const questId = req.params.questId;
  if (!questId) return badRequest(res, 'questId is required');

  const contributor = await prisma.financialContributor.create({
    data: {
      questId,
      ...req.body,
      enteredByUserId: req.user.id,
    },
  });

  return ok(res, contributor, 201);
});


// ============================================
// File: server/api/routes/liabilities.ts
// ============================================
import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthedRequest } from '../../lib/auth';
import { badRequest, ok } from '../../lib/http';

export const liabilitiesRouter = Router();
liabilitiesRouter.use(requireAuth);

liabilitiesRouter.patch('/:id', async (req: AuthedRequest, res) => {
  const liability = await prisma.liability.update({
    where: { id: req.params.id },
    data: req.body,
  });

  return ok(res, liability);
});

liabilitiesRouter.delete('/:id', async (req: AuthedRequest, res) => {
  await prisma.liability.delete({
    where: { id: req.params.id },
  });

  return res.status(204).send();
});

export const questLiabilitiesRouter = Router({ mergeParams: true });
questLiabilitiesRouter.use(requireAuth);

questLiabilitiesRouter.post('/', async (req: AuthedRequest, res) => {
  const questId = req.params.questId;
  if (!questId) return badRequest(res, 'questId is required');

  const liability = await prisma.liability.create({
    data: {
      questId,
      ...req.body,
    },
  });

  return ok(res, liability, 201);
});

questLiabilitiesRouter.get('/', async (req: AuthedRequest, res) => {
  const questId = req.params.questId;
  if (!questId) return badRequest(res, 'questId is required');

  const liabilities = await prisma.liability.findMany({
    where: { questId },
    orderBy: { createdAt: 'desc' },
  });

  return ok(res, liabilities);
});


// ============================================
// File: server/api/routes/scenarios.ts
// ============================================
import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthedRequest } from '../../lib/auth';
import { badRequest, notFound, ok } from '../../lib/http';
import { calculateScenario } from '../../domain/calculations/scenario-engine';
import { buildRecommendation } from '../../domain/recommendations/recommendation-engine';

export const scenariosRouter = Router();
scenariosRouter.use(requireAuth);

scenariosRouter.get('/:scenarioId', async (req: AuthedRequest, res) => {
  const scenario = await prisma.scenario.findUnique({
    where: { id: req.params.scenarioId },
  });

  if (!scenario) {
    return notFound(res, 'Scenario not found');
  }

  return ok(res, scenario);
});

scenariosRouter.patch('/:scenarioId', async (req: AuthedRequest, res) => {
  const scenario = await prisma.scenario.update({
    where: { id: req.params.scenarioId },
    data: req.body,
  });

  return ok(res, scenario);
});

scenariosRouter.post('/:scenarioId/run', async (req: AuthedRequest, res) => {
  const scenario = await prisma.scenario.findUnique({
    where: { id: req.params.scenarioId },
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

  if (!scenario) {
    return notFound(res, 'Scenario not found');
  }

  const currentMortgageLiability = scenario.quest.liabilities.find(
    (l) => l.linkedPropertyId === scenario.currentPropertyId && l.liabilityType === 'mortgage',
  );

  const nonHousingMonthlyDebt = scenario.quest.liabilities
    .filter((l) => l.liabilityType !== 'mortgage')
    .reduce((sum, l) => sum + Number(l.monthlyPayment), 0);

  const contributorDownPaymentSupport = scenario.quest.contributors
    .filter((c) => c.contributionType === 'down_payment_support')
    .reduce((sum, c) => sum + Number(c.amount), 0);

  const calc = calculateScenario({
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
    maintenanceMonthly: Number(scenario.renovationBudget || 0) / 12,
    nonHousingMonthlyDebt,
    grossMonthlyIncome: Number(req.body.grossMonthlyIncome || 12000),
    rentEstimateMonthly: Number(scenario.rentEstimateMonthly || 0),
    vacancyPercent: Number(scenario.vacancyPercent || 0),
    propertyManagementPercent: Number(scenario.propertyManagementPercent || 0),
    maintenanceReservePercent: Number(scenario.maintenanceReservePercent || 0),
    currentMortgagePayment: Number(currentMortgageLiability?.monthlyPayment || 0),
    buyerClosingCosts: Number(scenario.closingCostsBuy || 0),
    movingCosts: Number(scenario.movingCosts || 0),
    contributorDownPaymentSupport,
  });

  const recommendation = buildRecommendation(calc);

  const result = await prisma.scenarioResult.create({
    data: {
      scenarioId: scenario.id,
      netSaleProceeds: calc.netSaleProceeds,
      equityDollars: calc.equityDollars,
      equityPercent: calc.equityPercent,
      retainedEquity: scenario.strategyType === 'rent_and_buy' ? calc.equityDollars : 0,
      newMortgageAmount: calc.newMortgageAmount,
      projectedPaymentMonthly: calc.projectedPaymentMonthly,
      totalMonthlyHousingCost: calc.totalMonthlyHousingCost,
      totalMonthlyDebt: calc.totalMonthlyDebt,
      dtiProxy: calc.dtiProxy,
      rentalCashFlowMonthly: calc.rentalCashFlowMonthly,
      cashRequiredToClose: calc.cashRequiredToClose,
      affordabilityScore: recommendation.affordabilityScore,
      riskScore: recommendation.riskScore,
      recommendationLabel: recommendation.label,
      recommendationSummary: recommendation.summary,
    },
  });

  return ok(res, result);
});

scenariosRouter.get('/:scenarioId/results', async (req: AuthedRequest, res) => {
  const result = await prisma.scenarioResult.findFirst({
    where: { scenarioId: req.params.scenarioId },
    orderBy: { calculatedAt: 'desc' },
  });

  if (!result) {
    return notFound(res, 'Scenario result not found');
  }

  return ok(res, result);
});

scenariosRouter.post('/:scenarioId/variants', async (req: AuthedRequest, res) => {
  const { variantName, notes, changedInputsJson } = req.body;

  if (!variantName || !changedInputsJson) {
    return badRequest(res, 'variantName and changedInputsJson are required');
  }

  const variant = await prisma.scenarioVariant.create({
    data: {
      parentScenarioId: req.params.scenarioId,
      createdByUserId: req.user.id,
      variantName,
      notes,
      changedInputsJson,
    },
  });

  return ok(res, variant, 201);
});

scenariosRouter.post('/compare', async (req: AuthedRequest, res) => {
  const scenarioIds = req.body.scenarioIds as string[] | undefined;

  if (!scenarioIds?.length) {
    return badRequest(res, 'scenarioIds is required');
  }

  const scenarios = await prisma.scenario.findMany({
    where: { id: { in: scenarioIds } },
    include: {
      results: {
        orderBy: { calculatedAt: 'desc' },
        take: 1,
      },
    },
  });

  return ok(res, scenarios);
});

export const questScenariosRouter = Router({ mergeParams: true });
questScenariosRouter.use(requireAuth);

questScenariosRouter.post('/', async (req: AuthedRequest, res) => {
  const questId = req.params.questId;
  if (!questId) return badRequest(res, 'questId is required');

  const scenario = await prisma.scenario.create({
    data: {
      questId,
      ...req.body,
      createdByUserId: req.user.id,
    },
  });

  return ok(res, scenario, 201);
});

questScenariosRouter.get('/', async (req: AuthedRequest, res) => {
  const questId = req.params.questId;
  if (!questId) return badRequest(res, 'questId is required');

  const scenarios = await prisma.scenario.findMany({
    where: { questId },
    orderBy: { createdAt: 'desc' },
    include: {
      targetProperty: true,
      currentProperty: true,
      results: {
        orderBy: { calculatedAt: 'desc' },
        take: 1,
      },
    },
  });

  return ok(res, scenarios);
});


// ============================================
// File: server/api/routes/activity.ts
// ============================================
import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthedRequest } from '../../lib/auth';
import { ok } from '../../lib/http';

export const activityRouter = Router();
activityRouter.use(requireAuth);

activityRouter.get('/:questId', async (req: AuthedRequest, res) => {
  const questId = req.params.questId;

  const [properties, comments, scenarios, contributors] = await Promise.all([
    prisma.property.findMany({
      where: { questId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.propertyComment.findMany({
      where: { property: { questId } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.scenario.findMany({
      where: { questId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.financialContributor.findMany({
      where: { questId },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    }),
  ]);

  return ok(res, {
    properties,
    comments,
    scenarios,
    contributors,
  });
});


// ============================================
// File: server/api/routes/mount-quest-routes.ts
// Mount nested quest routes on /api/quests/:questId/*
// ============================================
import { Router } from 'express';
import { questPropertiesRouter } from './properties';
import { questHouseholdRouter } from './household';
import { questContributorsRouter } from './contributors';
import { questLiabilitiesRouter } from './liabilities';
import { questScenariosRouter } from './scenarios';

export function mountQuestSubrouters(router: Router) {
  router.use('/:questId/properties', questPropertiesRouter);
  router.use('/:questId/household-members', questHouseholdRouter);
  router.use('/:questId/contributors', questContributorsRouter);
  router.use('/:questId/liabilities', questLiabilitiesRouter);
  router.use('/:questId/scenarios', questScenariosRouter);
}


// ============================================
// Patch note:
// Add this line near the bottom of server/api/routes/quests.ts:
// mountQuestSubrouters(questsRouter)
// and import it from ./mount-quest-routes
// ============================================


// ============================================
// File: src/lib/api.ts
// ============================================
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json() as Promise<T>;
}


// ============================================
// File: src/types/index.ts
// ============================================
export type Quest = {
  id: string;
  name: string;
  description?: string | null;
  targetTimeline?: string | null;
  defaultLocation?: string | null;
};

export type Property = {
  id: string;
  questId: string;
  propertyRole: string;
  addressLine1?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  listingPrice?: number | null;
  targetOfferPrice?: number | null;
  estimatedValue?: number | null;
  squareFeet?: number | null;
  yardSize?: number | null;
  watchlistStatus: string;
};

export type ScenarioResult = {
  scenarioId: string;
  netSaleProceeds?: number | null;
  projectedPaymentMonthly?: number | null;
  totalMonthlyHousingCost?: number | null;
  totalMonthlyDebt?: number | null;
  dtiProxy?: number | null;
  rentalCashFlowMonthly?: number | null;
  cashRequiredToClose?: number | null;
  affordabilityScore?: number | null;
  riskScore?: number | null;
  recommendationLabel?: string | null;
  recommendationSummary?: string | null;
};


// ============================================
// File: src/components/layout/AppShell.tsx
// ============================================
import React from 'react';

type AppShellProps = {
  title: string;
  children: React.ReactNode;
};

export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 px-4 py-3">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}


// ============================================
// File: src/components/properties/PropertyCard.tsx
// ============================================
import React from 'react';
import { Property } from '../../types';

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium">{property.addressLine1 || 'Untitled property'}</h3>
          <p className="text-sm text-slate-500">
            {[property.city, property.state].filter(Boolean).join(', ')}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
          {property.watchlistStatus}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-slate-500">Price</div>
          <div>{property.listingPrice ? `$${property.listingPrice.toLocaleString()}` : '—'}</div>
        </div>
        <div>
          <div className="text-slate-500">Sq Ft</div>
          <div>{property.squareFeet || '—'}</div>
        </div>
        <div>
          <div className="text-slate-500">Yard Size</div>
          <div>{property.yardSize || '—'}</div>
        </div>
        <div>
          <div className="text-slate-500">Role</div>
          <div>{property.propertyRole}</div>
        </div>
      </div>
    </div>
  );
}


// ============================================
// File: src/components/scenarios/KpiCard.tsx
// ============================================
import React from 'react';

type KpiCardProps = {
  label: string;
  value: string | number;
};

export function KpiCard({ label, value }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  );
}


// ============================================
// File: src/pages/quest-home.tsx
// ============================================
import React from 'react';
import { AppShell } from '../components/layout/AppShell';

export default function QuestHomePage() {
  return (
    <AppShell title="NestQuest">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border p-4">Current Equity</div>
        <div className="rounded-2xl border p-4">Total Debt</div>
        <div className="rounded-2xl border p-4">Contributor Support</div>
        <div className="rounded-2xl border p-4">Dream Readiness</div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Recommended Next Step</h2>
        <div className="mt-3 rounded-2xl border p-4">
          Run a sell-vs-rent scenario for your top target home.
        </div>
      </section>
    </AppShell>
  );
}


// ============================================
// File: src/pages/properties.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { PropertyCard } from '../components/properties/PropertyCard';
import { api } from '../lib/api';
import { Property } from '../types';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    api<Property[]>('/quests/demo-quest-id/properties').then(setProperties).catch(console.error);
  }, []);

  return (
    <AppShell title="Properties">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Homes</h2>
        <button className="rounded-xl border px-4 py-2">Add Property</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </AppShell>
  );
}


// ============================================
// File: src/pages/scenario-lab.tsx
// ============================================
import React from 'react';
import { AppShell } from '../components/layout/AppShell';
import { KpiCard } from '../components/scenarios/KpiCard';

export default function ScenarioLabPage() {
  return (
    <AppShell title="Scenario Lab">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border p-4">
          <h2 className="text-lg font-semibold">Assumptions</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="rounded-xl border p-3" placeholder="Scenario name" />
            <select className="rounded-xl border p-3" defaultValue="sell_and_buy">
              <option value="sell_and_buy">Sell and Buy</option>
              <option value="rent_and_buy">Rent and Buy</option>
              <option value="hold_and_wait">Hold and Wait</option>
              <option value="buy_then_improve">Buy Then Improve</option>
            </select>
            <input className="rounded-xl border p-3" placeholder="Expected sale price" />
            <input className="rounded-xl border p-3" placeholder="Down payment amount" />
            <input className="rounded-xl border p-3" placeholder="Loan rate" />
            <input className="rounded-xl border p-3" placeholder="Loan term months" />
          </div>
          <button className="mt-4 rounded-xl border px-4 py-2">Run Scenario</button>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Results</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <KpiCard label="Cash to Close" value="$32,950" />
            <KpiCard label="Monthly Housing Cost" value="$3,962" />
            <KpiCard label="Total Monthly Debt" value="$4,887" />
            <KpiCard label="DTI Proxy" value="0.39" />
          </div>
          <div className="mt-4 rounded-2xl border p-4">
            <div className="text-sm text-slate-500">Recommendation</div>
            <div className="mt-2 font-medium">Best balanced option</div>
            <p className="mt-2 text-sm text-slate-600">
              Strong overall fit with good affordability and moderate risk.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}


// ============================================
// File: src/pages/dream-gap.tsx
// ============================================
import React from 'react';
import { AppShell } from '../components/layout/AppShell';

export default function DreamGapPage() {
  return (
    <AppShell title="Dream Gap Planner">
      <div className="rounded-2xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">22 Garden Terrace</h2>
            <p className="text-sm text-slate-500">Readiness: Close</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">Close</span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border p-3">Debt reduction target: $9,000</div>
          <div className="rounded-xl border p-3">Cash gap: $12,500</div>
          <div className="rounded-xl border p-3">Contribution gap: $800/mo</div>
          <div className="rounded-xl border p-3">Suggested timeline: 9–12 months</div>
        </div>
      </div>
    </AppShell>
  );
}


// ============================================
// File: src/pages/activity.tsx
// ============================================
import React from 'react';
import { AppShell } from '../components/layout/AppShell';

export default function ActivityPage() {
  return (
    <AppShell title="Activity">
      <div className="space-y-3">
        <div className="rounded-2xl border p-4">Rob commented on 22 Garden Terrace</div>
        <div className="rounded-2xl border p-4">Husband created a rent-and-buy scenario</div>
        <div className="rounded-2xl border p-4">Mom updated monthly contribution assumption</div>
      </div>
    </AppShell>
  );
}


// ============================================
// File: src/pages/property-detail.tsx
// ============================================
import React from 'react';
import { AppShell } from '../components/layout/AppShell';

export default function PropertyDetailPage() {
  return (
    <AppShell title="Property Detail">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border p-4">
          <h2 className="text-lg font-semibold">Overview</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>Price: $575,000</div>
            <div>Sq Ft: 3,120</div>
            <div>Garden Fit: High</div>
            <div>Beehive Suitability: High</div>
          </div>
        </section>

        <section className="rounded-2xl border p-4">
          <h2 className="text-lg font-semibold">Comments</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl border p-3">This backyard looks ideal for greenhouse placement.</div>
            <div className="rounded-xl border p-3">Layout seems promising for parents later.</div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
