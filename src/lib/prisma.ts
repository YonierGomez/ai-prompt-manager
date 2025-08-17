import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configuración robusta para Docker y desarrollo
const createPrismaClient = () => {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['error'],
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
        }
      }
    })
  } catch (error) {
    console.error('Error creating Prisma client:', error)
    // Fallback con configuración mínima
    return new PrismaClient({
      errorFormat: 'pretty'
    })
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
