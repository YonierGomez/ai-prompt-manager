import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Verificar que la aplicación esté funcionando
    return NextResponse.json(
      { 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'AI Prompt Manager',
        version: '1.0.0'
      }, 
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Service unavailable',
        timestamp: new Date().toISOString()
      }, 
      { status: 503 }
    )
  }
}
