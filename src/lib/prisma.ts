import { PrismaClient } from '@/generated/prisma/client';

// Créer une instance unique de Prisma (sans Accelerate pour simplifier)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
