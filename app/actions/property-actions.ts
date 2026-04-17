'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { PropertyRole, WatchlistStatus } from '@prisma/client';

const createPropertySchema = z.object({
  questId: z.string().min(1),
  propertyRole: z.nativeEnum(PropertyRole),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  listingPrice: z.coerce.number().optional(),
  targetOfferPrice: z.coerce.number().optional(),
  estimatedValue: z.coerce.number().optional(),
  squareFeet: z.coerce.number().optional(),
  yardSize: z.coerce.number().optional(),
  watchlistStatus: z.nativeEnum(WatchlistStatus).optional(),
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
