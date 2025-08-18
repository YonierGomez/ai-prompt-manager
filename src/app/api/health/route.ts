import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Verificar conexión a la base de datos
    await prisma.$connect()
    
    // Hacer una consulta simple para verificar que las tablas existen
    const count = await prisma.prompt.count()
    
    await prisma.$disconnect()
    
    return NextResponse.json(
      { 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'AI Prompt Manager',
        version: '1.0.0',
        database: {
          status: 'connected',
          prompts_count: count
        }
      }, 
      { status: 200 }
    )
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        service: 'AI Prompt Manager',
        version: '1.0.0'
      }, 
      { status: 503 }
    )
  }
}
