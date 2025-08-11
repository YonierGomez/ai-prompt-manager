import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener estadísticas
export async function GET(request: NextRequest) {
  try {
    const [
      totalPrompts,
      favoritePrompts,
      categoriesCount,
      totalUsage
    ] = await Promise.all([
      prisma.prompt.count(),
      prisma.prompt.count({ where: { isFavorite: true } }),
      prisma.prompt.groupBy({
        by: ['category'],
        _count: { category: true }
      }),
      prisma.prompt.aggregate({
        _sum: { usageCount: true }
      })
    ])

    const stats = {
      totalPrompts,
      favoritePrompts,
      categoriesUsed: categoriesCount.length,
      totalUsage: totalUsage._sum.usageCount || 0,
      categoryBreakdown: categoriesCount.map(cat => ({
        category: cat.category,
        count: cat._count.category
      }))
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
