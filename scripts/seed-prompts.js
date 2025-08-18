const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const samplePrompts = [
  {
    title: 'Análisis de código React avanzado',
    content: `Actúa como un experto desarrollador React senior con más de 10 años de experiencia. Analiza el siguiente código React y proporciona:

1. **Evaluación técnica detallada:**
   - Patrones de diseño utilizados
   - Potenciales problemas de rendimiento
   - Vulnerabilidades de seguridad
   - Accesibilidad y UX

2. **Mejoras específicas:**
   - Refactorización del código
   - Optimizaciones de hooks
   - Mejores prácticas de TypeScript
   - Gestión de estado moderna

3. **Recomendaciones adicionales:**
   - Testing strategies
   - Documentación mejorada
   - Escalabilidad futura

Código a analizar: [INSERTAR_CÓDIGO_AQUÍ]

Proporciona ejemplos de código mejorado y explica el razonamiento detrás de cada cambio.`,
    description: 'Prompt para análisis exhaustivo de código React con mejoras y optimizaciones',
    category: 'Programación',
    tags: 'react,código,revisión,optimización,typescript,hooks',
    aiModel: 'GPT-5',
    isFavorite: true,
    isPrivate: false,
    usageCount: 24,
    difficulty: 'Avanzado',
    estimatedTokens: 800,
    language: 'es',
    industry: 'Tecnología',
    author: 'AI Prompt Manager',
    source: 'Plantilla',
    license: 'MIT'
  },
  {
    title: 'Estrategia de marketing digital completa',
    content: `Eres un consultor de marketing digital con experiencia en startups tecnológicas. Crea una estrategia de marketing digital integral que incluya:

**Análisis de mercado:**
- Investigación de la audiencia objetivo
- Análisis de competencia
- Posicionamiento único de valor

**Estrategia de contenido:**
- Plan editorial mensual
- Tipos de contenido por plataforma
- Calendario de publicaciones
- KPIs específicos

**Canales de adquisición:**
- SEO y SEM
- Redes sociales (LinkedIn, X, Instagram)
- Email marketing
- Marketing de influencers
- Partnerships estratégicos

**Presupuesto y ROI:**
- Distribución del presupuesto por canal
- Métricas de seguimiento
- Proyecciones de crecimiento
- Plan de optimización

**Información de la empresa:**
- Sector: [INSERTAR_SECTOR]
- Público objetivo: [INSERTAR_AUDIENCIA]
- Presupuesto mensual: [INSERTAR_PRESUPUESTO]
- Objetivos principales: [INSERTAR_OBJETIVOS]

Proporciona un plan detallado de 90 días con hitos específicos y acciones concretas.`,
    description: 'Template completo para crear estrategias de marketing digital para startups',
    category: 'Marketing',
    tags: 'marketing,estrategia,digital,startup,redes-sociales,seo',
    aiModel: 'Claude Opus 4.1',
    isFavorite: false,
    isPrivate: false,
    usageCount: 18,
    difficulty: 'Intermedio',
    estimatedTokens: 1200,
    language: 'es',
    industry: 'Marketing',
    author: 'AI Prompt Manager',
    source: 'Plantilla',
    license: 'MIT'
  },
  {
    title: 'Escritura creativa para storytelling',
    content: `Actúa como un escritor creativo profesional especializado en storytelling. Ayúdame a crear una historia cautivadora con los siguientes elementos:

**Estructura narrativa:**
- Género: [INSERTAR_GÉNERO]
- Protagonista: [DESCRIBIR_PROTAGONISTA]
- Conflicto principal: [DESCRIBIR_CONFLICTO]
- Ambientación: [DESCRIBIR_SETTING]

**Desarrollo de la historia:**
1. **Gancho inicial:** Crea una apertura que capture inmediatamente la atención
2. **Desarrollo de personajes:** Construye personas complejas y relacionables
3. **Tensión creciente:** Mantén el interés con giros inesperados
4. **Clímax satisfactorio:** Resuelve el conflicto de manera memorable
5. **Cierre impactante:** Deja una impresión duradera

**Elementos técnicos:**
- Punto de vista narrativo más efectivo
- Uso de diálogos naturales
- Descripción sensorial inmersiva
- Ritmo y pacing adecuado
- Subtexto y simbolismo

**Audiencia objetivo:** [DESCRIBIR_AUDIENCIA]
**Longitud deseada:** [ESPECIFICAR_EXTENSIÓN]
**Tono:** [DESCRIBIR_TONO]

Desarrolla la historia completa con estos elementos, incluyendo justificaciones para tus decisiones creativas.`,
    description: 'Prompt para crear historias cautivadoras con estructura narrativa sólida',
    category: 'Creatividad',
    tags: 'escritura,storytelling,creatividad,narrativa,personajes',
    aiModel: 'Claude Sonnet 4',
    isFavorite: true,
    isPrivate: false,
    usageCount: 31,
    difficulty: 'Intermedio',
    estimatedTokens: 900,
    language: 'es',
    industry: 'Entretenimiento',
    author: 'AI Prompt Manager',
    source: 'Plantilla',
    license: 'MIT'
  },
  {
    title: 'Análisis de datos con Python',
    content: `Actúa como un científico de datos experto con dominio en Python, pandas, numpy, matplotlib y machine learning. Analiza el siguiente dataset y proporciona:

**Análisis exploratorio de datos (EDA):**
- Resumen estadístico completo
- Identificación de valores faltantes y outliers
- Distribuciones de variables
- Correlaciones y relaciones

**Visualizaciones informativas:**
- Gráficos de distribución
- Matrices de correlación
- Box plots para outliers
- Time series si aplica
- Visualizaciones personalizadas

**Insights y patrones:**
- Tendencias significativas
- Anomalías detectadas
- Segmentaciones interesantes
- Recomendaciones basadas en datos

**Código Python optimizado:**
- Limpieza y preprocesamiento
- Análisis estadístico
- Visualizaciones con matplotlib/seaborn
- Exportación de resultados

**Dataset información:**
- Tipo de datos: [DESCRIBIR_DATOS]
- Objetivo del análisis: [ESPECIFICAR_OBJETIVO]
- Columnas principales: [LISTAR_COLUMNAS]
- Tamaño del dataset: [ESPECIFICAR_TAMAÑO]

Proporciona código comentado paso a paso y conclusiones accionables para la toma de decisiones.`,
    description: 'Template para análisis completo de datos usando Python y librerías de data science',
    category: 'Análisis',
    tags: 'python,datos,análisis,machine-learning,pandas,matplotlib',
    aiModel: 'Gemini 2.5 Pro',
    isFavorite: false,
    isPrivate: false,
    usageCount: 12,
    difficulty: 'Avanzado',
    estimatedTokens: 1100,
    language: 'es',
    industry: 'Tecnología',
    author: 'AI Prompt Manager',
    source: 'Plantilla',
    license: 'MIT'
  },
  {
    title: 'Plan de productividad personal',
    content: `Eres un coach de productividad certificado. Crea un plan personalizado de productividad que incluya:

**Evaluación actual:**
- Auditoría de tiempo y actividades
- Identificación de distractores principales
- Análisis de patrones de energía
- Evaluación de herramientas actuales

**Sistema de organización:**
- Método de gestión de tareas (GTD, Kanban, etc.)
- Sistema de priorización (Eisenhower, ABC, etc.)
- Organización digital y física
- Rutinas matutinas y vespertinas

**Optimización de tiempo:**
- Time blocking efectivo
- Técnicas de deep work
- Gestión de interrupciones
- Automatización de tareas repetitivas

**Herramientas recomendadas:**
- Apps de productividad
- Sistemas de notas
- Herramientas de seguimiento
- Integración entre plataformas

**Plan de implementación:**
- Semana 1-2: Fundamentos
- Semana 3-4: Optimización
- Semana 5-8: Refinamiento
- Métricas de seguimiento

**Información personal:**
- Profesión: [ESPECIFICAR_PROFESIÓN]
- Principales desafíos: [DESCRIBIR_DESAFÍOS]
- Objetivos: [LISTAR_OBJETIVOS]
- Preferencias de trabajo: [DESCRIBIR_PREFERENCIAS]

Crea un plan detallado de 30 días con acciones específicas y sistemas de medición.`,
    description: 'Guía completa para optimizar la productividad personal con sistemas probados',
    category: 'Productividad',
    tags: 'productividad,organización,gestión-tiempo,hábitos,coaching',
    aiModel: 'O3',
    isFavorite: true,
    isPrivate: false,
    usageCount: 45,
    difficulty: 'Intermedio',
    estimatedTokens: 950,
    language: 'es',
    industry: 'Desarrollo Personal',
    author: 'AI Prompt Manager',
    source: 'Plantilla',
    license: 'MIT'
  },
  {
    title: 'Arquitectura de software escalable',
    content: `Actúa como un arquitecto de software senior especializado en sistemas distribuidos. Diseña una arquitectura escalable que incluya:

**Análisis de requisitos:**
- Requisitos funcionales y no funcionales
- Estimación de carga y tráfico
- Restricciones técnicas y de negocio
- Criterios de escalabilidad

**Diseño de arquitectura:**
- Patrones arquitectónicos (microservicios, monolito modular, etc.)
- Diseño de APIs y contratos
- Estrategia de datos y persistencia
- Separación de responsabilidades

**Infraestructura y deployment:**
- Cloud provider y servicios
- Containerización y orquestación
- CI/CD pipeline
- Monitoreo y logging

**Consideraciones de escalabilidad:**
- Load balancing y caching
- Database sharding y replicación
- CDN y edge computing
- Auto-scaling estrategias

**Seguridad y calidad:**
- Autenticación y autorización
- Encriptación y compliance
- Testing strategies
- Code quality metrics

**Proyecto información:**
- Tipo de aplicación: [DESCRIBIR_APP]
- Usuarios esperados: [NÚMERO_USUARIOS]
- Tecnologías preferidas: [LISTAR_TECH_STACK]
- Presupuesto/constrains: [ESPECIFICAR_LIMITACIONES]

Proporciona diagramas de arquitectura, justificaciones técnicas y plan de implementación por fases.`,
    description: 'Template para diseñar arquitecturas de software robustas y escalables',
    category: 'Programación',
    tags: 'arquitectura,software,escalabilidad,microservicios,cloud,devops',
    aiModel: 'GPT-5',
    isFavorite: false,
    isPrivate: false,
    usageCount: 8,
    difficulty: 'Avanzado',
    estimatedTokens: 1300,
    language: 'es',
    industry: 'Tecnología',
    author: 'AI Prompt Manager',
    source: 'Plantilla',
    license: 'MIT'
  }
]

async function seedPrompts() {
  console.log('🌱 Seeding prompts...')
  
  try {
    // Limpiar prompts existentes
    await prisma.prompt.deleteMany({})
    console.log('🗑️  Prompts existentes eliminados')
    
    // Insertar nuevos prompts
    for (const prompt of samplePrompts) {
      await prisma.prompt.create({
        data: prompt
      })
      console.log(`✅ Creado: ${prompt.title}`)
    }
    
    console.log(`🎉 ${samplePrompts.length} prompts creados exitosamente`)
    
    // Verificar que se crearon correctamente
    const count = await prisma.prompt.count()
    console.log(`📊 Total de prompts en la base de datos: ${count}`)
    
  } catch (error) {
    console.error('❌ Error seeding prompts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el seeding
seedPrompts()
