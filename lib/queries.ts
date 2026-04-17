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
