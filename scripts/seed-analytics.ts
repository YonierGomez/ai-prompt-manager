import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedAnalytics() {
  try {
    console.log('🌱 Generando datos de analytics...')

    // Obtener todos los prompts existentes
    const prompts = await prisma.prompt.findMany()
    
    if (prompts.length === 0) {
      console.log('❌ No hay prompts en la base de datos. Ejecuta primero el seed principal.')
      return
    }

    // Modelos de IA disponibles
    const aiModels = ['GPT-4o', 'Claude Sonnet 4', 'Gemini 2.5 Pro', 'GPT-5', 'Claude Opus 4.1']
    
    console.log(`📊 Creando ejecuciones para ${prompts.length} prompts...`)

    // Crear ejecuciones aleatorias para cada prompt
    for (const prompt of prompts) {
      // Número aleatorio de ejecuciones (0-50)
      const numExecutions = Math.floor(Math.random() * 51)
      
      for (let i = 0; i < numExecutions; i++) {
        // Fecha aleatoria en los últimos 90 días
        const randomDate = new Date()
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90))
        
        // Modelo aleatorio
        const randomModel = aiModels[Math.floor(Math.random() * aiModels.length)]
        
        // Success rate del 85%
        const success = Math.random() > 0.15
        
        await prisma.promptExecution.create({
          data: {
            promptId: prompt.id,
            model: randomModel,
            success,
            executionTime: Math.random() * 5 + 0.1, // 0.1 a 5.1 segundos
            tokensUsed: Math.floor(Math.random() * 2000) + 100, // 100-2100 tokens
            createdAt: randomDate
          }
        })
      }
      
      // Actualizar el usageCount del prompt
      await prisma.prompt.update({
        where: { id: prompt.id },
        data: {
          usageCount: numExecutions
        }
      })
      
      // Crear ratings aleatorios (algunos prompts tendrán ratings)
      if (Math.random() > 0.3) { // 70% de prompts tendrán ratings
        const numRatings = Math.floor(Math.random() * 15) + 1 // 1-15 ratings
        
        for (let i = 0; i < numRatings; i++) {
          // Distribución sesgada hacia ratings altos (más realista)
          let rating
          const rand = Math.random()
          if (rand < 0.4) rating = 5
          else if (rand < 0.7) rating = 4
          else if (rand < 0.85) rating = 3
          else if (rand < 0.95) rating = 2
          else rating = 1
          
          const randomRatingDate = new Date()
          randomRatingDate.setDate(randomRatingDate.getDate() - Math.floor(Math.random() * 60))
          
          await prisma.promptRating.create({
            data: {
              promptId: prompt.id,
              rating,
              comment: rating >= 4 ? 'Excelente prompt!' : rating >= 3 ? 'Buen prompt' : 'Podría mejorar',
              userHash: `user_${Math.random().toString(36).substring(7)}`,
              createdAt: randomRatingDate
            }
          })
        }
        
        // Calcular y actualizar el rating promedio del prompt
        const ratings = await prisma.promptRating.findMany({
          where: { promptId: prompt.id }
        })
        
        const avgRating = ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length
        const totalRatings = ratings.length
        
        await prisma.prompt.update({
          where: { id: prompt.id },
          data: {
            avgRating,
            totalRatings
          }
        })
      }
    }
    
    // Estadísticas finales
    const totalExecutions = await prisma.promptExecution.count()
    const totalRatings = await prisma.promptRating.count()
    const avgExecutionsPerPrompt = totalExecutions / prompts.length
    
    console.log('✅ Analytics seed completado!')
    console.log(`📈 Estadísticas generadas:`)
    console.log(`   • ${totalExecutions} ejecuciones totales`)
    console.log(`   • ${totalRatings} ratings totales`)
    console.log(`   • ${avgExecutionsPerPrompt.toFixed(1)} ejecuciones promedio por prompt`)
    console.log(`   • Datos distribuidos en los últimos 90 días`)

  } catch (error) {
    console.error('❌ Error al generar datos de analytics:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el seed
if (require.main === module) {
  seedAnalytics()
}

export default seedAnalytics
