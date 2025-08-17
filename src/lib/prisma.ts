import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configuración simplificada y robusta para ARM64
const createPrismaClient = () => {
  const config: any = {
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
      }
    }
  }

  // Solo agregar enableTracing si el entorno lo requiere
  if (process.env.PRISMA_ENABLE_TRACING !== 'false') {
    config.enableTracing = false
  }

  try {
    return new PrismaClient(config)
  } catch (error) {
    console.warn('Error creating Prisma client with full config, trying minimal config:', error)
    // Fallback con configuración mínima
    return new PrismaClient({
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
        }
      }
    })
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
