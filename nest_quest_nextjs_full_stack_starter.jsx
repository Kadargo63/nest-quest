// =====================================================
// File: package.json
// =====================================================
{
  "name": "nestquest",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "prisma": "latest",
    "tsx": "latest",
    "typescript": "latest"
  }
}

// =====================================================
// File: tsconfig.json
// =====================================================
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

// =====================================================
// File: next.config.ts
// =====================================================
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;

// =====================================================
// File: .env.example
// =====================================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nestquest"
DEV_USER_EMAIL="rob@example.com"

// =====================================================
// File: lib/prisma.ts
// =====================================================
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// =====================================================
// File: lib/auth.ts
// Temporary server-side auth shim for local development.
// Replace with NextAuth/Auth.js/Clerk/etc.
// =====================================================
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const email = process.env.DEV_USER_EMAIL || 'rob@example.com';

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error(`No dev user found for email: ${email}`);
  }

  return user;
}

// =====================================================
// File: lib/utils.ts
// =====================================================
export function currency(value: number | string | null | undefined) {
  const num = Number(value || 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
}

export function percent(value: number | string | null | undefined) {
  const num = Number(value || 0);
  return `${Math.round(num * 100)}%`;
}

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

// =====================================================
// File: lib/calculations/mortgage.ts
// =====================================================
export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateMonthlyPrincipalAndInterest(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
): number {
  if (principal <= 0 || annualRatePercent <= 0 || termMonths <= 0) return 0;

  const monthlyRate = annualRatePercent / 100 / 12;
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths);
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;

  if (denominator === 0) return 0;

  return roundCurrency(numerator / denominator);
}

// =====================================================
// File: lib/calculations/scenario-engine.ts
// =====================================================
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

// =====================================================
// File: lib/recommendations.ts
// =====================================================
import { ScenarioCalculationResult } from '@/lib/calculations/scenario-engine';

export function buildRecommendation(result: ScenarioCalculationResult) {
  const affordabilityScore = scoreAffordability(result.dtiProxy, result.cashRequiredToClose);
  const riskScore = scoreRisk(result.dtiProxy, result.rentalCashFlowMonthly);

  let label = 'Balanced option';
  let summary = 'Solid baseline scenario with manageable tradeoffs.';

  if (affordabilityScore >= 80 && riskScore >= 70) {
    label = 'Best balanced option';
    summary = 'Strong overall scenario with good affordability and moderate risk.';
  } else if (result.cashRequiredToClose > 50000) {
    label = 'Stretch option';
    summary = 'Promising scenario, but cash to close is still a major hurdle.';
  } else if (result.rentalCashFlowMonthly > 0) {
    label = 'Long-term wealth option';
    summary = 'This path appears stronger for long-term wealth, but it adds complexity.';
  }

  return {
    label,
    summary,
    affordabilityScore,
    riskScore,
  };
}

function scoreAffordability(dtiProxy: number, cashRequiredToClose: number) {
  let score = 100;
  if (dtiProxy > 0.43) score -= 30;
  else if (dtiProxy > 0.36) score -= 15;

  if (cashRequiredToClose > 100000) score -= 30;
  else if (cashRequiredToClose > 50000) score -= 15;
  else if (cashRequiredToClose > 25000) score -= 5;

  return Math.max(0, score);
}

function scoreRisk(dtiProxy: number, rentalCashFlowMonthly: number) {
  let score = 100;
  if (dtiProxy > 0.43) score -= 25;
  else if (dtiProxy > 0.36) score -= 10;

  if (rentalCashFlowMonthly < 0) score -= 20;
  else if (rentalCashFlowMonthly < 200) score -= 10;

  return Math.max(0, score);
}

// =====================================================
// File: lib/queries.ts
// =====================================================
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function getUserQuests() {
  const user = await getCurrentUser();

  return prisma.quest.findMany({
    where: {
      members: {
        some: { userId: user.id },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getQuestOrThrow(questId: string) {
  const user = await getCurrentUser();

  const quest = await prisma.quest.findFirst({
    where: {
      id: questId,
      members: {
        some: { userId: user.id },
      },
    },
    include: {
      members: true,
      properties: {
        include: {
          fitProfile: true,
          landProfile: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      liabilities: true,
      contributors: true,
      householdMembers: true,
      scenarios: {
        include: {
          results: {
            orderBy: { calculatedAt: 'desc' },
            take: 1,
          },
          targetProperty: true,
          currentProperty: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!quest) throw new Error('Quest not found or access denied');
  return quest;
}

export async function getPropertyOrThrow(propertyId: string) {
  const user = await getCurrentUser();

  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      quest: {
        members: {
          some: { userId: user.id },
        },
      },
    },
    include: {
      fitProfile: true,
      landProfile: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'asc' },
      },
      media: true,
      observations: true,
      scenariosAsTarget: {
        include: {
          results: {
            orderBy: { calculatedAt: 'desc' },
            take: 1,
          },
        },
      },
    },
  });

  if (!property) throw new Error('Property not found or access denied');
  return property;
}

// =====================================================
// File: app/layout.tsx
// =====================================================
import './globals.css';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'NestQuest',
  description: 'Collaborative housing and homestead planning',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
          <header className="border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between px-4 py-4">
              <Link href="/" className="text-xl font-semibold">
                NestQuest
              </Link>
              <nav className="flex gap-4 text-sm text-slate-600">
                <Link href="/">Home</Link>
                <Link href="/quests">Quests</Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}

// =====================================================
// File: app/globals.css
// =====================================================
html, body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
}

* {
  box-sizing: border-box;
}

a {
  color: inherit;
  text-decoration: none;
}

input, select, textarea, button {
  font: inherit;
}

// =====================================================
// File: components/ui/Card.tsx
// =====================================================
import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}

// =====================================================
// File: components/ui/SectionTitle.tsx
// =====================================================
import React from 'react';

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

// =====================================================
// File: components/forms/SubmitButton.tsx
// =====================================================
'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl border border-slate-300 bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
    >
      {pending ? 'Saving...' : label}
    </button>
  );
}

// =====================================================
// File: components/properties/PropertyCard.tsx
// =====================================================
import Link from 'next/link';
import React from 'react';
import { currency } from '@/lib/utils';

export function PropertyCard({ property }: { property: any }) {
  return (
    <Link href={`/properties/${property.id}`} className="block">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-medium">{property.addressLine1 || 'Untitled property'}</h3>
            <p className="text-sm text-slate-500">{[property.city, property.state].filter(Boolean).join(', ')}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{property.watchlistStatus}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-slate-500">Price</div>
            <div>{currency(property.listingPrice)}</div>
          </div>
          <div>
            <div className="text-slate-500">Sq Ft</div>
            <div>{property.squareFeet || '—'}</div>
          </div>
          <div>
            <div className="text-slate-500">Yard</div>
            <div>{property.yardSize || '—'}</div>
          </div>
          <div>
            <div className="text-slate-500">Role</div>
            <div>{property.propertyRole}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// =====================================================
// File: components/scenarios/KpiCard.tsx
// =====================================================
import React from 'react';

export function KpiCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  );
}

// =====================================================
// File: app/actions/quest-actions.ts
// =====================================================
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const createQuestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  targetTimeline: z.string().optional(),
  defaultLocation: z.string().optional(),
});

export async function createQuestAction(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = createQuestSchema.parse({
    name: formData.get('name'),
    description: formData.get('description'),
    targetTimeline: formData.get('targetTimeline'),
    defaultLocation: formData.get('defaultLocation'),
  });

  await prisma.quest.create({
    data: {
      name: parsed.name,
      description: parsed.description,
      targetTimeline: parsed.targetTimeline,
      defaultLocation: parsed.defaultLocation,
      ownerUserId: user.id,
      members: {
        create: {
          userId: user.id,
          role: 'owner',
          invitationStatus: 'accepted',
        },
      },
    },
  });

  revalidatePath('/quests');
}

// =====================================================
// File: app/actions/property-actions.ts
// =====================================================
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const createPropertySchema = z.object({
  questId: z.string().min(1),
  propertyRole: z.string().min(1),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  listingPrice: z.coerce.number().optional(),
  targetOfferPrice: z.coerce.number().optional(),
  estimatedValue: z.coerce.number().optional(),
  squareFeet: z.coerce.number().optional(),
  yardSize: z.coerce.number().optional(),
  watchlistStatus: z.string().optional(),
});

export async function createPropertyAction(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = createPropertySchema.parse({
    questId: formData.get('questId'),
    propertyRole: formData.get('propertyRole'),
    addressLine1: formData.get('addressLine1') || undefined,
    city: formData.get('city') || undefined,
    state: formData.get('state') || undefined,
    postalCode: formData.get('postalCode') || undefined,
    listingPrice: formData.get('listingPrice') || undefined,
    targetOfferPrice: formData.get('targetOfferPrice') || undefined,
    estimatedValue: formData.get('estimatedValue') || undefined,
    squareFeet: formData.get('squareFeet') || undefined,
    yardSize: formData.get('yardSize') || undefined,
    watchlistStatus: formData.get('watchlistStatus') || 'researching',
  });

  await prisma.property.create({
    data: {
      ...parsed,
      createdByUserId: user.id,
    },
  });

  revalidatePath(`/quests/${parsed.questId}`);
}

const createPropertyCommentSchema = z.object({
  propertyId: z.string().min(1),
  body: z.string().min(1),
  tag: z.string().optional(),
});

export async function createPropertyCommentAction(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = createPropertyCommentSchema.parse({
    propertyId: formData.get('propertyId'),
    body: formData.get('body'),
    tag: formData.get('tag') || undefined,
  });

  await prisma.propertyComment.create({
    data: {
      propertyId: parsed.propertyId,
      userId: user.id,
      body: parsed.body,
      tag: parsed.tag,
    },
  });

  revalidatePath(`/properties/${parsed.propertyId}`);
}

// =====================================================
// File: app/actions/liability-actions.ts
// =====================================================
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const createLiabilitySchema = z.object({
  questId: z.string().min(1),
  liabilityType: z.string().min(1),
  lenderName: z.string().optional(),
  currentBalance: z.coerce.number().optional(),
  interestRate: z.coerce.number().optional(),
  monthlyPayment: z.coerce.number(),
  notes: z.string().optional(),
});

export async function createLiabilityAction(formData: FormData) {
  const parsed = createLiabilitySchema.parse({
    questId: formData.get('questId'),
    liabilityType: formData.get('liabilityType'),
    lenderName: formData.get('lenderName') || undefined,
    currentBalance: formData.get('currentBalance') || undefined,
    interestRate: formData.get('interestRate') || undefined,
    monthlyPayment: formData.get('monthlyPayment'),
    notes: formData.get('notes') || undefined,
  });

  await prisma.liability.create({
    data: {
      ...parsed,
      variablePaymentFlag: false,
    },
  });

  revalidatePath(`/quests/${parsed.questId}`);
}

// =====================================================
// File: app/actions/scenario-actions.ts
// =====================================================
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateScenario } from '@/lib/calculations/scenario-engine';
import { buildRecommendation } from '@/lib/recommendations';

const createScenarioSchema = z.object({
  questId: z.string().min(1),
  name: z.string().min(1),
  currentPropertyId: z.string().optional(),
  targetPropertyId: z.string().optional(),
  strategyType: z.string().min(1),
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

// =====================================================
// File: app/page.tsx
// =====================================================
import Link from 'next/link';
import { getUserQuests } from '@/lib/queries';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function HomePage() {
  const quests = await getUserQuests();

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Welcome to NestQuest"
        subtitle="Collaborative housing and homestead planning for dream homes, multigenerational living, and debt-aware scenarios."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>Track current home, target homes, debt, and contributors.</Card>
        <Card>Model sell, rent, hold, and buy-then-improve scenarios.</Card>
        <Card>See dream-gap targets for greenhouse, gardens, beehives, and family plans.</Card>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle title="Your Quests" />
          <Link href="/quests/new" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm">
            New Quest
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quests.map((quest) => (
            <Link key={quest.id} href={`/quests/${quest.id}`}>
              <Card>
                <h3 className="font-medium">{quest.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{quest.description || 'No description yet.'}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

// =====================================================
// File: app/quests/new/page.tsx
// =====================================================
import { createQuestAction } from '@/app/actions/quest-actions';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function NewQuestPage() {
  return (
    <div className="max-w-2xl">
      <SectionTitle title="Create a New Quest" subtitle="Set up a shared workspace for your household planning." />
      <Card>
        <form action={createQuestAction} className="grid gap-4">
          <input name="name" placeholder="Quest name" className="rounded-xl border border-slate-300 p-3" required />
          <textarea name="description" placeholder="Description" className="rounded-xl border border-slate-300 p-3" rows={4} />
          <input name="targetTimeline" placeholder="Target timeline" className="rounded-xl border border-slate-300 p-3" />
          <input name="defaultLocation" placeholder="Default location" className="rounded-xl border border-slate-300 p-3" />
          <SubmitButton label="Create Quest" />
        </form>
      </Card>
    </div>
  );
}

// =====================================================
// File: app/quests/page.tsx
// =====================================================
import Link from 'next/link';
import { getUserQuests } from '@/lib/queries';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function QuestsPage() {
  const quests = await getUserQuests();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle title="Quests" subtitle="Your shared and personal planning workspaces." />
        <Link href="/quests/new" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm">
          New Quest
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quests.map((quest) => (
          <Link key={quest.id} href={`/quests/${quest.id}`}>
            <Card>
              <h3 className="font-medium">{quest.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{quest.description || 'No description yet.'}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// File: app/quests/[questId]/page.tsx
// =====================================================
import Link from 'next/link';
import { getQuestOrThrow } from '@/lib/queries';
import { currency } from '@/lib/utils';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function QuestDetailPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;
  const quest = await getQuestOrThrow(questId);

  const currentProperty = quest.properties.find((item) => item.propertyRole === 'current_primary');
  const targetProperties = quest.properties.filter((item) => item.propertyRole === 'target_candidate');
  const totalDebt = quest.liabilities.reduce((sum, item) => sum + Number(item.monthlyPayment), 0);
  const totalContributors = quest.contributors.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle title={quest.name} subtitle={quest.description || 'No description yet.'} />
        <div className="flex gap-2">
          <Link href={`/quests/${questId}/properties/new`} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm">
            Add Property
          </Link>
          <Link href={`/quests/${questId}/scenarios/new`} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm">
            Add Scenario
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="text-sm text-slate-500">Current Home Value</div>
          <div className="mt-2 text-xl font-semibold">{currency(currentProperty?.estimatedValue as any)}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Monthly Debt</div>
          <div className="mt-2 text-xl font-semibold">{currency(totalDebt)}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Contributor Support</div>
          <div className="mt-2 text-xl font-semibold">{currency(totalContributors)}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Target Homes</div>
          <div className="mt-2 text-xl font-semibold">{targetProperties.length}</div>
        </Card>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle title="Target Properties" />
          <Link href={`/quests/${questId}/properties`} className="text-sm text-slate-600 underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {targetProperties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Recent Scenarios" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quest.scenarios.slice(0, 6).map((scenario) => (
            <Link key={scenario.id} href={`/scenarios/${scenario.id}`}>
              <Card>
                <h3 className="font-medium">{scenario.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{scenario.strategyType}</p>
                <p className="mt-3 text-sm">{scenario.results[0]?.recommendationSummary || 'No result yet.'}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

// =====================================================
// File: app/quests/[questId]/properties/page.tsx
// =====================================================
import Link from 'next/link';
import { getQuestOrThrow } from '@/lib/queries';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function QuestPropertiesPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;
  const quest = await getQuestOrThrow(questId);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle title="Properties" subtitle="Current, target, and future homes in this quest." />
        <Link href={`/quests/${questId}/properties/new`} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm">
          Add Property
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quest.properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

// =====================================================
// File: app/quests/[questId]/properties/new/page.tsx
// =====================================================
import { createPropertyAction } from '@/app/actions/property-actions';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function NewPropertyPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;

  return (
    <div className="max-w-3xl">
      <SectionTitle title="Add Property" subtitle="Save a current home, target home, rental, or future property." />
      <Card>
        <form action={createPropertyAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="questId" value={questId} />

          <select name="propertyRole" className="rounded-xl border border-slate-300 p-3" defaultValue="target_candidate">
            <option value="current_primary">Current Home</option>
            <option value="target_candidate">Target Home</option>
            <option value="rental">Rental</option>
            <option value="secondary">Secondary</option>
          </select>

          <select name="watchlistStatus" className="rounded-xl border border-slate-300 p-3" defaultValue="researching">
            <option value="researching">Researching</option>
            <option value="interested">Interested</option>
            <option value="serious_contender">Serious contender</option>
            <option value="stretch_dream">Stretch dream</option>
            <option value="backup">Backup</option>
          </select>

          <input name="addressLine1" placeholder="Address" className="rounded-xl border border-slate-300 p-3 md:col-span-2" />
          <input name="city" placeholder="City" className="rounded-xl border border-slate-300 p-3" />
          <input name="state" placeholder="State" className="rounded-xl border border-slate-300 p-3" />
          <input name="postalCode" placeholder="Postal code" className="rounded-xl border border-slate-300 p-3" />
          <input name="listingPrice" placeholder="Listing price" className="rounded-xl border border-slate-300 p-3" />
          <input name="targetOfferPrice" placeholder="Target offer price" className="rounded-xl border border-slate-300 p-3" />
          <input name="estimatedValue" placeholder="Estimated value" className="rounded-xl border border-slate-300 p-3" />
          <input name="squareFeet" placeholder="Square feet" className="rounded-xl border border-slate-300 p-3" />
          <input name="yardSize" placeholder="Yard size" className="rounded-xl border border-slate-300 p-3" />

          <div className="md:col-span-2">
            <SubmitButton label="Save Property" />
          </div>
        </form>
      </Card>
    </div>
  );
}

// =====================================================
// File: app/quests/[questId]/scenarios/new/page.tsx
// =====================================================
import { createScenarioAction } from '@/app/actions/scenario-actions';
import { getQuestOrThrow } from '@/lib/queries';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function NewScenarioPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;
  const quest = await getQuestOrThrow(questId);
  const currentProperties = quest.properties.filter((item) => item.propertyRole === 'current_primary');
  const targetProperties = quest.properties.filter((item) => item.propertyRole === 'target_candidate');

  return (
    <div className="max-w-4xl">
      <SectionTitle title="Create Scenario" subtitle="Model sell, rent, hold, or improvement paths." />
      <Card>
        <form action={createScenarioAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="questId" value={questId} />
          <input name="name" placeholder="Scenario name" className="rounded-xl border border-slate-300 p-3 md:col-span-2" required />

          <select name="currentPropertyId" className="rounded-xl border border-slate-300 p-3">
            <option value="">Select current property</option>
            {currentProperties.map((item) => (
              <option key={item.id} value={item.id}>
                {item.addressLine1}
              </option>
            ))}
          </select>

          <select name="targetPropertyId" className="rounded-xl border border-slate-300 p-3">
            <option value="">Select target property</option>
            {targetProperties.map((item) => (
              <option key={item.id} value={item.id}>
                {item.addressLine1}
              </option>
            ))}
          </select>

          <select name="strategyType" className="rounded-xl border border-slate-300 p-3" defaultValue="sell_and_buy">
            <option value="sell_and_buy">Sell and buy</option>
            <option value="rent_and_buy">Rent and buy</option>
            <option value="hold_and_wait">Hold and wait</option>
            <option value="renovate_and_stay">Renovate and stay</option>
            <option value="household_merge">Household merge</option>
            <option value="buy_then_improve">Buy then improve</option>
          </select>

          <input name="expectedSalePrice" placeholder="Expected sale price" className="rounded-xl border border-slate-300 p-3" />
          <input name="sellingCostPercent" placeholder="Selling cost %" className="rounded-xl border border-slate-300 p-3" />
          <input name="rentEstimateMonthly" placeholder="Rent estimate monthly" className="rounded-xl border border-slate-300 p-3" />
          <input name="vacancyPercent" placeholder="Vacancy %" className="rounded-xl border border-slate-300 p-3" />
          <input name="propertyManagementPercent" placeholder="Management %" className="rounded-xl border border-slate-300 p-3" />
          <input name="maintenanceReservePercent" placeholder="Maintenance reserve %" className="rounded-xl border border-slate-300 p-3" />
          <input name="downPaymentAmount" placeholder="Down payment amount" className="rounded-xl border border-slate-300 p-3" />
          <input name="loanRate" placeholder="Loan rate" className="rounded-xl border border-slate-300 p-3" />
          <input name="loanTermMonths" placeholder="Loan term months" className="rounded-xl border border-slate-300 p-3" defaultValue="360" />
          <input name="closingCostsBuy" placeholder="Buyer closing costs" className="rounded-xl border border-slate-300 p-3" />
          <input name="movingCosts" placeholder="Moving costs" className="rounded-xl border border-slate-300 p-3" />

          <div className="md:col-span-2">
            <SubmitButton label="Create Scenario" />
          </div>
        </form>
      </Card>
    </div>
  );
}

// =====================================================
// File: app/properties/[propertyId]/page.tsx
// =====================================================
import { createPropertyCommentAction } from '@/app/actions/property-actions';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { getPropertyOrThrow } from '@/lib/queries';

export default async function PropertyDetailPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = await params;
  const property = await getPropertyOrThrow(propertyId);

  return (
    <div className="space-y-8">
      <SectionTitle
        title={property.addressLine1 || 'Property Detail'}
        subtitle={[property.city, property.state].filter(Boolean).join(', ')}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h3 className="font-medium">Overview</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm">
            <div>Price: {property.listingPrice?.toString() || '—'}</div>
            <div>Sq Ft: {property.squareFeet || '—'}</div>
            <div>Garden fit: {property.landProfile?.gardenFeasibility || '—'}</div>
            <div>Beehive suitability: {property.landProfile?.beehiveSuitability || '—'}</div>
            <div>Flood risk: {property.landProfile?.floodRisk || '—'}</div>
            <div>Sunlight: {property.landProfile?.sunlightQuality || '—'}</div>
          </div>
        </Card>

        <Card>
          <h3 className="font-medium">Fit Summary</h3>
          <p className="mt-3 text-sm text-slate-600">{property.fitProfile?.dreamFitSummary || 'No fit summary yet.'}</p>
        </Card>
      </div>

      <Card>
        <h3 className="font-medium">Comments</h3>
        <div className="mt-4 space-y-3">
          {property.comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-slate-200 p-3">
              <div className="text-sm font-medium">{comment.user.displayName}</div>
              <div className="mt-1 text-sm text-slate-600">{comment.body}</div>
            </div>
          ))}
        </div>

        <form action={createPropertyCommentAction} className="mt-4 grid gap-3">
          <input type="hidden" name="propertyId" value={property.id} />
          <textarea name="body" rows={4} placeholder="Add a comment" className="rounded-xl border border-slate-300 p-3" required />
          <input name="tag" placeholder="Optional tag (garden, fit, flood, parents)" className="rounded-xl border border-slate-300 p-3" />
          <SubmitButton label="Add Comment" />
        </form>
      </Card>
    </div>
  );
}

// =====================================================
// File: app/scenarios/[scenarioId]/page.tsx
// =====================================================
import { runScenarioAction } from '@/app/actions/scenario-actions';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { KpiCard } from '@/components/scenarios/KpiCard';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { prisma } from '@/lib/prisma';
import { currency, percent } from '@/lib/utils';

export default async function ScenarioDetailPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;

  const scenario = await prisma.scenario.findUnique({
    where: { id: scenarioId },
    include: {
      currentProperty: true,
      targetProperty: true,
      results: {
        orderBy: { calculatedAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!scenario) {
    throw new Error('Scenario not found');
  }

  const result = scenario.results[0];

  return (
    <div className="space-y-8">
      <SectionTitle title={scenario.name} subtitle={scenario.strategyType} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <h3 className="font-medium">Scenario Inputs</h3>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div>Current property: {scenario.currentProperty?.addressLine1 || '—'}</div>
            <div>Target property: {scenario.targetProperty?.addressLine1 || '—'}</div>
            <div>Expected sale: {currency(scenario.expectedSalePrice as any)}</div>
            <div>Down payment: {currency(scenario.downPaymentAmount as any)}</div>
            <div>Loan rate: {scenario.loanRate?.toString() || '—'}%</div>
            <div>Loan term: {scenario.loanTermMonths || '—'} months</div>
          </div>

          <form action={runScenarioAction} className="mt-6 grid gap-3">
            <input type="hidden" name="scenarioId" value={scenario.id} />
            <input name="grossMonthlyIncome" placeholder="Gross monthly income" defaultValue="12000" className="rounded-xl border border-slate-300 p-3" />
            <SubmitButton label="Run Scenario" />
          </form>
        </Card>

        <Card>
          <h3 className="font-medium">Recommendation</h3>
          {result ? (
            <>
              <div className="mt-3 text-lg font-semibold">{result.recommendationLabel || 'No label yet'}</div>
              <p className="mt-2 text-sm text-slate-600">{result.recommendationSummary || 'Run the scenario to generate a recommendation.'}</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-600">Run the scenario to see results.</p>
          )}
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Cash to Close" value={result ? currency(result.cashRequiredToClose as any) : '—'} />
        <KpiCard label="Monthly Housing" value={result ? currency(result.totalMonthlyHousingCost as any) : '—'} />
        <KpiCard label="Monthly Debt" value={result ? currency(result.totalMonthlyDebt as any) : '—'} />
        <KpiCard label="DTI Proxy" value={result ? percent(result.dtiProxy as any) : '—'} />
      </div>
    </div>
  );
}

// =====================================================
// File: app/quests/[questId]/household/page.tsx
// =====================================================
import { getQuestOrThrow } from '@/lib/queries';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function HouseholdPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;
  const quest = await getQuestOrThrow(questId);

  return (
    <div>
      <SectionTitle title="Household Planning" subtitle="Current and future household members, contributions, and living needs." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quest.householdMembers.map((member) => (
          <Card key={member.id}>
            <h3 className="font-medium">{member.displayName}</h3>
            <div className="mt-2 text-sm text-slate-600">{member.role}</div>
            <div className="mt-1 text-sm text-slate-600">Timeline: {member.estimatedMoveInTimeline || '—'}</div>
            <div className="mt-1 text-sm text-slate-600">Accessibility: {member.accessibilityNeedLevel || '—'}</div>
            <div className="mt-1 text-sm text-slate-600">Privacy: {member.privacyNeedLevel || '—'}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// File: app/quests/[questId]/dream-gap/page.tsx
// =====================================================
import { getQuestOrThrow } from '@/lib/queries';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function DreamGapPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;
  const quest = await getQuestOrThrow(questId);
  const targetProperties = quest.properties.filter((item) => item.propertyRole === 'target_candidate');

  return (
    <div>
      <SectionTitle title="Dream Gap Planner" subtitle="See what financial targets would make a dream property realistic." />
      <div className="space-y-4">
        {targetProperties.map((property) => (
          <Card key={property.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">{property.addressLine1 || 'Untitled property'}</h3>
                <p className="mt-1 text-sm text-slate-500">Readiness: Close</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">Close</span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-sm">
              <div className="rounded-xl border border-slate-200 p-3">Debt reduction target: $9,000</div>
              <div className="rounded-xl border border-slate-200 p-3">Cash gap: $12,500</div>
              <div className="rounded-xl border border-slate-200 p-3">Contribution gap: $800/mo</div>
              <div className="rounded-xl border border-slate-200 p-3">Suggested timeline: 9–12 months</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// File: app/quests/[questId]/activity/page.tsx
// =====================================================
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function ActivityPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;

  const [properties, comments, scenarios, contributors] = await Promise.all([
    prisma.property.findMany({ where: { questId }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.propertyComment.findMany({ where: { property: { questId } }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.scenario.findMany({ where: { questId }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.financialContributor.findMany({ where: { questId }, orderBy: { updatedAt: 'desc' }, take: 10 }),
  ]);

  return (
    <div>
      <SectionTitle title="Activity" subtitle="Recent property, scenario, and contribution updates." />
      <div className="space-y-3">
        {properties.map((item) => (
          <Card key={`p-${item.id}`}>Property added: {item.addressLine1 || 'Untitled property'}</Card>
        ))}
        {comments.map((item) => (
          <Card key={`c-${item.id}`}>Comment added: {item.body}</Card>
        ))}
        {scenarios.map((item) => (
          <Card key={`s-${item.id}`}>Scenario created: {item.name}</Card>
        ))}
        {contributors.map((item) => (
          <Card key={`f-${item.id}`}>Contributor updated: {Number(item.amount).toLocaleString()}</Card>
        ))}
      </div>
    </div>
  );
}
