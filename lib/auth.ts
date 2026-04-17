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
