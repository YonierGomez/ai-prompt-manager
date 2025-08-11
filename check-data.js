import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkData() {
  try {
    console.log('🔍 Verificando datos en la base de datos...')
    
    const promptCount = await prisma.prompt.count()
    const templateCount = await prisma.template.count()
    const collectionCount = await prisma.collection.count()
    const workflowCount = await prisma.workflow.count()
    const executionCount = await prisma.promptExecution.count()
    const ratingCount = await prisma.promptRating.count()
    
    console.log(`📊 Prompts: ${promptCount}`)
    console.log(`📝 Templates: ${templateCount}`)
    console.log(`📚 Collections: ${collectionCount}`)
    console.log(`🔄 Workflows: ${workflowCount}`)
    console.log(`⚡ Executions: ${executionCount}`)
    console.log(`⭐ Ratings: ${ratingCount}`)
    
    // Mostrar algunos prompts
    const prompts = await prisma.prompt.findMany({
      take: 3,
      select: {
        title: true,
        aiModel: true,
        difficulty: true,
        avgRating: true
      }
    })
    
    console.log('\n🎯 Prompts de ejemplo:')
    prompts.forEach(prompt => {
      console.log(`- ${prompt.title} (${prompt.aiModel}) - ${prompt.difficulty} - ⭐${prompt.avgRating}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()
