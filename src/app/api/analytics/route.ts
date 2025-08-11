import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface PromptUsageStat {
  promptId: string
  _count: {
    promptId: number
  }
}

interface CategoryStat {
  category: string
  _count: {
    category: number
  }
}

interface ModelStat {
  model: string
  _count: {
    model: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    
    // Calcular fecha de inicio según el rango
    const now = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // 1. Estadísticas generales
    const totalPrompts = await prisma.prompt.count()
    const totalExecutions = await prisma.promptExecution.count()
    const totalRatings = await prisma.promptRating.count()
    
    // Prompts creados en el período
    const promptsInPeriod = await prisma.prompt.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })

    // 2. Prompts más utilizados (basado en ejecuciones reales)
    const promptUsageStats = await prisma.promptExecution.groupBy({
      by: ['promptId'],
      _count: {
        promptId: true
      },
      orderBy: {
        _count: {
          promptId: 'desc'
        }
      },
      take: 10
    })

    // Obtener detalles de los prompts más usados
    const popularPrompts = await Promise.all(
      promptUsageStats.map(async (stat: any) => {
        const prompt = await prisma.prompt.findUnique({
          where: { id: stat.promptId },
          include: {
            ratings: true,
            executions: true
          }
        })
        
        if (!prompt) return null
        
        const avgRating = prompt.ratings.length > 0 
          ? prompt.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / prompt.ratings.length 
          : 0
        
        return {
          id: prompt.id,
          title: prompt.title,
          executions: stat._count.promptId,
          views: prompt.usageCount, // Este campo lo incrementaremos cuando se vea un prompt
          rating: Number(avgRating.toFixed(1)),
          uses: stat._count.promptId
        }
      })
    )

    // 3. Categorías más populares
    const categoryStats = await prisma.prompt.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    })

    const totalCategoryCount = categoryStats.reduce((sum: number, cat: any) => sum + cat._count.category, 0)
    const topCategories = categoryStats.map((cat: any) => ({
      name: cat.category,
      count: cat._count.category,
      percentage: Math.round((cat._count.category / totalCategoryCount) * 100)
    }))

    // 4. Modelos de IA más usados
    const modelStats = await prisma.promptExecution.groupBy({
      by: ['model'],
      _count: {
        model: true
      },
      orderBy: {
        _count: {
          model: 'desc'
        }
      }
    })

    const totalModelCount = modelStats.reduce((sum: number, model: any) => sum + model._count.model, 0)
    const topModels = modelStats.map((model: any) => ({
      name: model.model,
      count: model._count.model,
      percentage: totalModelCount > 0 ? Math.round((model._count.model / totalModelCount) * 100) : 0
    }))

    // 5. Actividad reciente
    const recentExecutions = await prisma.promptExecution.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        prompt: {
          select: {
            title: true
          }
        }
      }
    })

    const recentActivity = recentExecutions.map((exec: any) => ({
      type: 'executed',
      prompt: exec.prompt.title,
      date: exec.createdAt.toISOString().split('T')[0],
      model: exec.model
    }))

    // 6. Prompts creados recientemente
    const recentPrompts = await prisma.prompt.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })

    recentPrompts.forEach((prompt: any) => {
      recentActivity.push({
        type: 'created',
        prompt: prompt.title,
        date: prompt.createdAt.toISOString().split('T')[0],
        model: prompt.aiModel
      })
    })

    // Ordenar actividad por fecha
    recentActivity.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // 7. Calcular rating promedio global
    const allRatings = await prisma.promptRating.findMany()
    const avgGlobalRating = allRatings.length > 0 
      ? allRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / allRatings.length 
      : 0

    // 8. Estadísticas de éxito (basado en execuciones exitosas)
    const successfulExecutions = await prisma.promptExecution.count({
      where: { success: true }
    })
    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0

    // 9. Estadísticas semanales (últimos 7 días)
    const weeklyStats = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))
      
      const dayPrompts = await prisma.prompt.count({
        where: {
          createdAt: {
            gte: dayStart,
            lte: dayEnd
          }
        }
      })
      
      const dayExecutions = await prisma.promptExecution.count({
        where: {
          createdAt: {
            gte: dayStart,
            lte: dayEnd
          }
        }
      })
      
      weeklyStats.push({
        day: dayStart.toLocaleDateString('es-ES', { weekday: 'short' }),
        prompts: dayPrompts,
        views: dayExecutions
      })
    }

    // Respuesta final
    const analyticsData = {
      totalPrompts,
      totalViews: totalExecutions, // Las "vistas" son las ejecuciones
      totalUses: totalExecutions,
      avgRating: Number(avgGlobalRating.toFixed(1)),
      promptsThisMonth: promptsInPeriod,
      successRate: Number(successRate.toFixed(1)),
      topCategories: topCategories.slice(0, 5),
      topModels: topModels.slice(0, 5),
      recentActivity: recentActivity.slice(0, 10),
      popularPrompts: popularPrompts.filter(p => p !== null).slice(0, 5),
      weeklyStats,
      summary: {
        totalExecutions,
        totalRatings,
        avgExecutionsPerPrompt: totalPrompts > 0 ? Number((totalExecutions / totalPrompts).toFixed(1)) : 0,
        avgRatingPerPrompt: totalPrompts > 0 ? Number((totalRatings / totalPrompts).toFixed(1)) : 0
      }
    }

    return NextResponse.json(analyticsData)
    
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Error al obtener analytics' }, 
      { status: 500 }
    )
  }
}
