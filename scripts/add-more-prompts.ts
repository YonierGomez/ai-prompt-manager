import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMorePrompts() {
  try {
    console.log('🌱 Agregando más prompts con categorías diversas...')

    const newPrompts = [
      {
        title: "Optimizador de consultas SQL",
        content: "# Optimización SQL\n\nAnaliza la siguiente consulta SQL y proporciona una versión optimizada:\n\n```sql\n{{sql_query}}\n```\n\nConsidera:\n- Índices apropiados\n- Eliminación de subconsultas innecesarias\n- Uso de JOINs eficientes\n- Particionamiento de datos",
        description: "Mejora el rendimiento de consultas SQL complejas",
        category: "Base de Datos",
        tags: ["sql", "optimización", "performance", "database"],
        aiModel: "Claude Sonnet 4",
        difficulty: "Avanzado"
      },
      {
        title: "Generador de contenido para redes sociales",
        content: "# Estrategia de Contenido Social\n\nCrea **{{number}}** publicaciones para **{{platform}}** sobre el tema: **{{topic}}**\n\n## Requisitos:\n- Tono: {{tone}}\n- Audiencia objetivo: {{audience}}\n- Call-to-action incluido\n- Hashtags relevantes\n- Formato optimizado para la plataforma",
        description: "Crea contenido atractivo y optimizado para diferentes plataformas sociales",
        category: "Marketing Digital",
        tags: ["social media", "content", "marketing", "branding"],
        aiModel: "GPT-4o",
        difficulty: "Intermedio"
      },
      {
        title: "Asistente de debugging de código",
        content: "# Debug Assistant\n\nAnaliza el siguiente código y encuentra posibles errores:\n\n```{{language}}\n{{code}}\n```\n\n## Análisis requerido:\n1. **Errores de sintaxis**\n2. **Errores lógicos**\n3. **Problemas de rendimiento**\n4. **Vulnerabilidades de seguridad**\n5. **Mejores prácticas**\n\nProporciona soluciones específicas y código corregido.",
        description: "Identifica y soluciona errores en código de programación",
        category: "Desarrollo",
        tags: ["debugging", "programming", "code review", "best practices"],
        aiModel: "Claude Opus 4.1",
        difficulty: "Avanzado"
      },
      {
        title: "Creador de currículums profesionales",
        content: "# Generador de CV Profesional\n\nCrea un currículum profesional para:\n\n**Posición objetivo:** {{job_position}}\n**Industria:** {{industry}}\n**Años de experiencia:** {{experience_years}}\n\n## Información personal:\n- Nombre: {{name}}\n- Habilidades clave: {{skills}}\n- Experiencia relevante: {{experience}}\n- Educación: {{education}}\n\n### Formato requerido:\n- ATS-friendly\n- Diseño limpio y profesional\n- Palabras clave de la industria\n- Logros cuantificados",
        description: "Genera currículums optimizados y profesionales para diferentes industrias",
        category: "Recursos Humanos",
        tags: ["cv", "resume", "career", "professional"],
        aiModel: "GPT-5",
        difficulty: "Básico"
      },
      {
        title: "Analista de sentimientos de texto",
        content: "# Análisis de Sentimientos\n\nAnaliza el sentimiento del siguiente texto:\n\n```\n{{text_input}}\n```\n\n## Análisis requerido:\n\n### 1. Sentimiento general:\n- Positivo / Neutral / Negativo\n- Puntuación de confianza (0-100%)\n\n### 2. Emociones detectadas:\n- Emociones primarias y secundarias\n- Intensidad emocional\n\n### 3. Aspectos específicos:\n- Temas mencionados\n- Palabras clave emocionales\n- Contexto y subtexto\n\n### 4. Recomendaciones:\n- Cómo responder apropiadamente\n- Tone de voz sugerido",
        description: "Analiza el sentimiento y emociones en textos de forma detallada",
        category: "Análisis de Datos",
        tags: ["sentiment", "nlp", "emotions", "text analysis"],
        aiModel: "Gemini 2.5 Pro",
        difficulty: "Intermedio"
      },
      {
        title: "Tutor de idiomas personalizado",
        content: "# Tutor Personal de {{language}}\n\n## Perfil del estudiante:\n- Nivel actual: {{current_level}}\n- Objetivo: {{goal}}\n- Tiempo disponible: {{time_available}}\n- Intereses: {{interests}}\n\n## Lección de hoy:\n**Tema:** {{topic}}\n\n### 1. Vocabulario nuevo (10 palabras)\n### 2. Gramática clave\n### 3. Ejercicios prácticos\n### 4. Conversación guiada\n### 5. Tarea para casa\n\n**Nota:** Adapta el contenido al nivel del estudiante y usa ejemplos relacionados con sus intereses.",
        description: "Crea lecciones personalizadas de idiomas adaptadas al estudiante",
        category: "Educación",
        tags: ["languages", "education", "learning", "personalized"],
        aiModel: "Claude Sonnet 4",
        difficulty: "Intermedio"
      }
    ]

    for (const promptData of newPrompts) {
      await prisma.prompt.create({
        data: {
          ...promptData,
          tags: JSON.stringify(promptData.tags),
          isFavorite: Math.random() > 0.7, // 30% de probabilidad de ser favorito
          usageCount: Math.floor(Math.random() * 20) + 1,
          author: "Sistema",
          language: "es"
        }
      })
    }

    console.log(`✅ Se agregaron ${newPrompts.length} prompts nuevos!`)
    
    // Mostrar estadísticas actualizadas
    const totalPrompts = await prisma.prompt.count()
    const categories = await prisma.prompt.findMany({
      select: { category: true },
      distinct: ['category']
    })
    
    console.log(`📊 Estadísticas actualizadas:`)
    console.log(`   • Total de prompts: ${totalPrompts}`)
    console.log(`   • Categorías disponibles: ${categories.map((c: any) => c.category).join(', ')}`)

  } catch (error) {
    console.error('❌ Error al agregar prompts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
if (require.main === module) {
  addMorePrompts()
}

export default addMorePrompts
