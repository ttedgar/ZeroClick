import { PrismaClient } from "@prisma/client"

function createPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null
  try {
    return new PrismaClient()
  } catch {
    return null
  }
}

export const prisma = createPrisma()
