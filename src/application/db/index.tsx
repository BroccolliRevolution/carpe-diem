import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // prisma logging
    // log: process.env.NODE_ENV === "test" ? [] : ["query", "info"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
