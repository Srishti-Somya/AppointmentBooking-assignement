import { PrismaClient } from '@prisma/client';

// Single global Prisma instance
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Graceful shutdown helper
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
