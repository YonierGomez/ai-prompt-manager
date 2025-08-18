import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configuración simplificada y robusta para ARM64
const createPrismaClient = () => {
  // Determinar la URL de la base de datos en runtime
  let databaseUrl = process.env.DATABASE_URL
  
  // Si no hay DATABASE_URL, intentar detectar la ubicación correcta
  if (!databaseUrl) {
    // En Docker con volumen en /app/prisma
    if (typeof window === 'undefined') {
      const fs = require('fs')
      const path = require('path')
      
      if (fs.existsSync('/app/prisma') && fs.existsSync(path.join(process.cwd(), 'prisma'))) {
        databaseUrl = 'file:./prisma/dev.db'
      } else {
        databaseUrl = 'file:./data/dev.db'
      }
    } else {
      databaseUrl = 'file:./prisma/dev.db'
    }
  }
  
  console.log('🔗 Prisma conectando a:', databaseUrl)
  
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    })
  } catch (error) {
    console.warn('Error creating Prisma client with full config, trying minimal config:', error)
    // Fallback con configuración mínima
    return new PrismaClient({
      errorFormat: 'pretty'
    })
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
