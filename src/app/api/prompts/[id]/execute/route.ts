import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { promptId, action, model, input, output, success = true } = body

    if (!promptId || !action) {
      return NextResponse.json(
        { error: 'promptId y action son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el prompt existe
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId }
    })

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt no encontrado' },
        { status: 404 }
      )
    }

    // Incrementar el contador de uso del prompt
    await prisma.prompt.update({
      where: { id: promptId },
      data: {
        usageCount: {
          increment: 1
        }
      }
    })

    // Registrar la ejecución específica
    const execution = await prisma.promptExecution.create({
      data: {
        promptId,
        input: input || null,
        output: output || null,
        model: model || prompt.aiModel,
        success,
        // Si es una copia, podemos inferir algunos datos
        executionTime: action === 'copy' ? 0.1 : null // Tiempo mínimo para copiar
      }
    })

    return NextResponse.json({ 
      success: true, 
      execution,
      message: 'Ejecución registrada correctamente'
    })

  } catch (error) {
    console.error('Error registrando ejecución:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
