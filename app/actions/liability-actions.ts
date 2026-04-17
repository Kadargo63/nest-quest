'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { LiabilityType } from '@prisma/client';

const createLiabilitySchema = z.object({
  questId: z.string().min(1),
  liabilityType: z.nativeEnum(LiabilityType),
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
