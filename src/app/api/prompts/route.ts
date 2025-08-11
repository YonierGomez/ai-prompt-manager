import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validación para crear prompts
const createPromptSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  content: z.string().min(1, 'El contenido es requerido'),
  description: z.string().optional(),
  category: z.string().min(1, 'La categoría es requerida'),
  tags: z.array(z.string()).default([]),
  aiModel: z.string().min(1, 'El modelo de IA es requerido'),
  isFavorite: z.boolean().default(false),
  isPrivate: z.boolean().default(false)
})

// GET - Obtener todos los prompts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const favorite = searchParams.get('favorite') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (favorite) {
      where.isFavorite = true
    }

    const prompts = await prisma.prompt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    // Parsear tags como string separado por comas
    const parsedPrompts = prompts.map(prompt => ({
      ...prompt,
      tags: prompt.tags ? prompt.tags.split(',').map((tag: string) => tag.trim()) : []
    }))

    return NextResponse.json(parsedPrompts)
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo prompt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPromptSchema.parse(body)

    const prompt = await prisma.prompt.create({
      data: {
        ...validatedData,
        tags: validatedData.tags.join(',')
      }
    })

    return NextResponse.json({
      ...prompt,
      tags: prompt.tags ? prompt.tags.split(',').map((tag: string) => tag.trim()) : []
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating prompt:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
