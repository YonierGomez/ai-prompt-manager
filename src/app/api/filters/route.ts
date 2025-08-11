import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Obtener todas las categorías únicas de los prompts existentes
    const categories = await prisma.prompt.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    })

    // Obtener todos los modelos únicos de los prompts existentes
    const models = await prisma.prompt.findMany({
      select: {
        aiModel: true
      },
      distinct: ['aiModel']
    })

    // Obtener también las categorías predefinidas de la tabla Category si existen
    const predefinedCategories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    const response = {
      categories: categories.map((c: any) => c.category).filter(Boolean).sort(),
      models: models.map((m: any) => m.aiModel).filter(Boolean).sort(),
      predefinedCategories: predefinedCategories.map((c: any) => ({
        name: c.name,
        description: c.description,
        color: c.color,
        icon: c.icon
      }))
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return NextResponse.json(
      { error: 'Error al obtener opciones de filtros' },
      { status: 500 }
    )
  }
}
