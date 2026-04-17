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
