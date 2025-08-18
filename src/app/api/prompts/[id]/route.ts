import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updatePromptSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  aiModel: z.string().min(1).optional(),
  isFavorite: z.boolean().optional(),
  isPrivate: z.boolean().optional()
})

// Función helper para parsear tags
function parseTags(tagsString: string | null): string[] {
  if (!tagsString) return []
  
  // Si es JSON válido, parsearlo
  try {
    const parsed = JSON.parse(tagsString)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // Si no es JSON válido, tratarlo como string separado por comas
    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
  }
  
  return []
}

// GET - Obtener prompt por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const prompt = await prisma.prompt.findUnique({
      where: { id }
    })

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt no encontrado' },
        { status: 404 }
      )
    }

    // Incrementar contador de uso
    await prisma.prompt.update({
      where: { id },
      data: { usageCount: { increment: 1 } }
    })

    return NextResponse.json({
      ...prompt,
      tags: parseTags(prompt.tags)
    })
  } catch (error) {
    console.error('Error fetching prompt:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar prompt
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updatePromptSchema.parse(body)

    const updateData: any = { ...validatedData }
    if (validatedData.tags) {
      updateData.tags = JSON.stringify(validatedData.tags)
    }

    const prompt = await prisma.prompt.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      ...prompt,
      tags: parseTags(prompt.tags)
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating prompt:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar prompt
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // First check if the prompt exists
    const existingPrompt = await prisma.prompt.findUnique({
      where: { id }
    })

    if (!existingPrompt) {
      return NextResponse.json(
        { error: 'Prompt no encontrado' },
        { status: 404 }
      )
    }

    await prisma.prompt.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Prompt eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting prompt:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
