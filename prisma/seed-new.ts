import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const samplePrompts = [
  {
    title: 'Generador de Contenido de Blog',
    content: `Eres un experto escritor de contenido digital con más de 10 años de experiencia. Tu tarea es crear un artículo de blog sobre {{TEMA}} que sea:

1. **Informativo y valioso**: Proporciona información útil y práctica
2. **Optimizado para SEO**: Incluye palabras clave naturalmente integradas
3. **Engaging**: Mantiene al lector interesado desde el primer párrafo
4. **Bien estructurado**: Usa headers, bullet points y párrafos cortos

**Estructura sugerida:**
- Introducción gancho (150-200 palabras)
- 3-5 secciones principales con subtítulos H2
- Conclusión con call-to-action
- Longitud total: {{LONGITUD}} palabras

**Tono**: {{TONO}}
**Audiencia**: {{AUDIENCIA}}
**Palabras clave a incluir**: {{KEYWORDS}}

Comienza con un título atractivo y continúa con el artículo completo.`,
    description: 'Crea contenido de blog profesional, optimizado para SEO y altamente engaging para cualquier temática',
    category: 'Escritura',
    tags: JSON.stringify(['blog', 'seo', 'contenido', 'marketing', 'escritura']),
    aiModel: 'gpt-5',
    isFavorite: true,
    usageCount: 24,
    difficulty: 'Intermedio',
    estimatedTokens: 800,
    language: 'es',
    industry: 'Marketing Digital',
    templateVariables: JSON.stringify([
      { name: 'TEMA', type: 'text', required: true, description: 'Tema principal del artículo' },
      { name: 'LONGITUD', type: 'number', required: true, description: 'Número de palabras objetivo' },
      { name: 'TONO', type: 'select', options: ['Profesional', 'Casual', 'Técnico', 'Conversacional'], required: true },
      { name: 'AUDIENCIA', type: 'text', required: true, description: 'Descripción de la audiencia objetivo' },
      { name: 'KEYWORDS', type: 'textarea', required: false, description: 'Lista de palabras clave separadas por comas' }
    ]),
    version: '2.0',
    avgRating: 4.8,
    totalRatings: 127,
    successRate: 94.2,
    author: 'Content Expert AI',
    source: 'Metodología de marketing de contenidos avanzada'
  },
  {
    title: 'Generador de Videos con IA',
    content: `Eres un experto en producción audiovisual y generación de contenido con IA. Tu especialidad es crear guiones, storyboards y prompts optimizados para herramientas de video como Sora, Runway, Pika Labs y similares.

**Framework de creación de video:**

1. **Análisis del briefing**
   - Objetivo del video: {{OBJETIVO}}
   - Duración target: {{DURACION}} segundos
   - Audiencia objetivo: {{AUDIENCIA}}
   - Tono y estilo: {{ESTILO}}

2. **Estructura narrativa**
   - Hook inicial (primeros 3 segundos)
   - Desarrollo del mensaje central
   - Call-to-action o conclusión

3. **Especificaciones técnicas**
   - Resolución: {{RESOLUCION}}
   - Aspect ratio: {{ASPECT_RATIO}}
   - Frame rate: {{FRAME_RATE}}
   - Duración de cada escena

4. **Prompts para IA de video**
   - Descripción visual detallada
   - Movimientos de cámara específicos
   - Iluminación y atmosfera
   - Transiciones entre escenas

**Elementos visuales a definir:**
- Paleta de colores: {{COLORES}}
- Estilo visual: {{ESTILO_VISUAL}}
- Personajes y objetos principales
- Locaciones y backgrounds
- Efectos especiales requeridos

**Prompts técnicos optimizados:**
- Para Sora: [PROMPT ESPECÍFICO]
- Para Runway: [PROMPT ESPECÍFICO]
- Para Midjourney (frames): [PROMPT ESPECÍFICO]`,
    description: 'Crea contenido audiovisual profesional con prompts optimizados para herramientas de IA de video',
    category: 'Creatividad',
    tags: JSON.stringify(['video', 'sora', 'runway', 'contenido-audiovisual', 'storyboard', 'ia-generativa']),
    aiModel: 'gpt-5',
    isFavorite: true,
    usageCount: 8,
    difficulty: 'Avanzado',
    estimatedTokens: 1200,
    language: 'es',
    industry: 'Producción Audiovisual',
    templateVariables: JSON.stringify([
      { name: 'OBJETIVO', type: 'text', required: true, description: 'Objetivo principal del video' },
      { name: 'DURACION', type: 'number', required: true, description: 'Duración en segundos' },
      { name: 'AUDIENCIA', type: 'text', required: true, description: 'Audiencia objetivo' },
      { name: 'ESTILO', type: 'select', options: ['Dramático', 'Comercial', 'Educativo', 'Entretenimiento'], required: true },
      { name: 'RESOLUCION', type: 'select', options: ['4K', '1080p', '720p'], required: true },
      { name: 'ASPECT_RATIO', type: 'select', options: ['16:9', '9:16', '1:1', '4:3'], required: true },
      { name: 'FRAME_RATE', type: 'select', options: ['24fps', '30fps', '60fps'], required: true },
      { name: 'COLORES', type: 'text', required: false, description: 'Paleta de colores preferida' },
      { name: 'ESTILO_VISUAL', type: 'select', options: ['Realista', 'Animado', 'Artístico', 'Minimalista'], required: true }
    ]),
    version: '1.0',
    avgRating: 4.9,
    totalRatings: 45,
    successRate: 91.8,
    author: 'Video AI Expert',
    source: 'Best practices para generación de video con IA'
  },
  {
    title: 'Arquitecto de Sistemas de IA',
    content: `Soy un arquitecto de sistemas especializado en infraestructura de IA, MLOps y deployment de modelos a escala. Te ayudo a diseñar, implementar y optimizar sistemas de machine learning robustos y escalables.

**Contexto del proyecto:**
- **Tipo de sistema**: {{TIPO_SISTEMA}}
- **Escala de datos**: {{ESCALA_DATOS}}
- **Latencia requerida**: {{LATENCIA}}
- **Budget**: {{PRESUPUESTO}}
- **Compliance**: {{COMPLIANCE}}

**Áreas de especialización:**

1. **Arquitectura de ML**
   - Pipeline de datos end-to-end
   - Model serving y inference
   - A/B testing para modelos
   - Monitoring y observabilidad

2. **MLOps y DevOps**
   - CI/CD para modelos ML
   - Versionado de datos y modelos
   - Automated retraining
   - Infrastructure as Code

3. **Optimización de performance**
   - Model quantization
   - Edge deployment
   - GPU/TPU optimization
   - Distributed training

4. **Seguridad y compliance**
   - Model security
   - Data privacy (GDPR, CCPA)
   - Bias detection y mitigation
   - Explainable AI

**Stack tecnológico recomendado:**
- **Cloud**: {{CLOUD_PROVIDER}}
- **Frameworks**: {{FRAMEWORK}}
- **Deployment**: {{DEPLOYMENT_STRATEGY}}
- **Monitoring**: {{MONITORING_TOOLS}}`,
    description: 'Diseña sistemas de IA escalables con arquitectura MLOps y mejores prácticas de deployment',
    category: 'Programación',
    tags: JSON.stringify(['mlops', 'arquitectura', 'ia', 'deployment', 'sistemas-distribuidos', 'devops']),
    aiModel: 'claude-4.1',
    isFavorite: false,
    usageCount: 15,
    difficulty: 'Experto',
    estimatedTokens: 1500,
    language: 'es',
    industry: 'Tecnología',
    templateVariables: JSON.stringify([
      { name: 'TIPO_SISTEMA', type: 'select', options: ['Recomendaciones', 'NLP', 'Computer Vision', 'Time Series', 'Clasificación'], required: true },
      { name: 'ESCALA_DATOS', type: 'select', options: ['< 1GB', '1GB - 100GB', '100GB - 10TB', '> 10TB'], required: true },
      { name: 'LATENCIA', type: 'select', options: ['< 100ms', '100ms - 1s', '1s - 10s', '> 10s'], required: true },
      { name: 'PRESUPUESTO', type: 'select', options: ['< $1k/mes', '$1k - $10k/mes', '$10k - $100k/mes', '> $100k/mes'], required: true },
      { name: 'COMPLIANCE', type: 'text', required: false, description: 'Requerimientos de compliance' },
      { name: 'CLOUD_PROVIDER', type: 'select', options: ['AWS', 'GCP', 'Azure', 'Multi-cloud'], required: true },
      { name: 'FRAMEWORK', type: 'select', options: ['TensorFlow', 'PyTorch', 'JAX', 'Hugging Face'], required: true },
      { name: 'DEPLOYMENT_STRATEGY', type: 'select', options: ['Serverless', 'Kubernetes', 'Edge', 'Híbrido'], required: true },
      { name: 'MONITORING_TOOLS', type: 'text', required: false, description: 'Herramientas de monitoring preferidas' }
    ]),
    version: '1.2',
    avgRating: 4.7,
    totalRatings: 82,
    successRate: 89.5,
    author: 'MLOps Architect',
    source: 'Patrones de arquitectura ML en producción'
  }
]

const sampleTemplates = [
  {
    name: 'Template de Análisis SWOT',
    description: 'Plantilla estructurada para análisis SWOT empresarial',
    structure: JSON.stringify({
      sections: ['Contexto', 'Fortalezas', 'Debilidades', 'Oportunidades', 'Amenazas', 'Estrategias'],
      format: 'business_analysis'
    }),
    category: 'Análisis',
    variables: JSON.stringify(['EMPRESA', 'SECTOR', 'PERIODO_ANALISIS', 'OBJETIVO']),
    example: 'Análisis SWOT para startup de tecnología fintech'
  },
  {
    name: 'Template de Code Review',
    description: 'Plantilla para revisión de código con checklist completo',
    structure: JSON.stringify({
      sections: ['Resumen', 'Aspectos positivos', 'Problemas identificados', 'Sugerencias', 'Prioridad'],
      format: 'code_review'
    }),
    category: 'Programación',
    variables: JSON.stringify(['LENGUAJE', 'FRAMEWORK', 'TIPO_APLICACION', 'NIVEL_SEVERIDAD']),
    example: 'Review de API REST en Python con Django'
  }
]

const sampleCollections = [
  {
    name: 'Prompts para Marketing Digital',
    description: 'Colección completa de prompts para estrategias de marketing',
    prompts: JSON.stringify(['1', '2']), // IDs de prompts
    isPublic: true,
    tags: JSON.stringify(['marketing', 'digital', 'estrategia'])
  },
  {
    name: 'AI Development Toolkit',
    description: 'Herramientas esenciales para desarrollo con IA',
    prompts: JSON.stringify(['3']),
    isPublic: true,
    tags: JSON.stringify(['desarrollo', 'ia', 'mlops'])
  }
]

const sampleWorkflows = [
  {
    name: 'Flujo de Creación de Contenido',
    description: 'Workflow completo desde ideación hasta publicación',
    steps: JSON.stringify([
      { order: 1, name: 'Investigación de keywords', promptId: '1' },
      { order: 2, name: 'Generación de ideas', promptId: '2' },
      { order: 3, name: 'Creación de contenido', promptId: '1' },
      { order: 4, name: 'Optimización SEO', promptId: '1' }
    ]),
    category: 'Marketing',
    usageCount: 23
  },
  {
    name: 'Desarrollo de Producto con IA',
    description: 'Pipeline para desarrollo de productos usando IA',
    steps: JSON.stringify([
      { order: 1, name: 'Análisis de requerimientos', promptId: '3' },
      { order: 2, name: 'Diseño de arquitectura', promptId: '3' },
      { order: 3, name: 'Implementación', promptId: '3' },
      { order: 4, name: 'Testing y optimización', promptId: '3' }
    ]),
    category: 'Programación',
    usageCount: 18
  }
]

const sampleCategories = [
  { name: 'Escritura', description: 'Prompts para creación de contenido, copywriting y redacción', color: '#3b82f6', icon: 'PenTool' },
  { name: 'Programación', description: 'Code review, debugging, desarrollo y mejores prácticas', color: '#10b981', icon: 'Code' },
  { name: 'Análisis', description: 'Análisis de datos, insights y business intelligence', color: '#f59e0b', icon: 'BarChart3' },
  { name: 'Creatividad', description: 'Brainstorming, ideación y pensamiento creativo', color: '#ec4899', icon: 'Palette' },
  { name: 'Productividad', description: 'Optimización personal, gestión del tiempo y hábitos', color: '#8b5cf6', icon: 'Zap' },
  { name: 'Educación', description: 'Enseñanza, tutoriales y metodologías de aprendizaje', color: '#06b6d4', icon: 'GraduationCap' },
  { name: 'Marketing', description: 'Estrategias de marketing, growth hacking y ventas', color: '#ef4444', icon: 'TrendingUp' },
  { name: 'Investigación', description: 'Research, análisis de mercado y metodologías científicas', color: '#84cc16', icon: 'Search' }
]

const sampleTags = [
  { name: 'blog', color: '#3b82f6' },
  { name: 'seo', color: '#10b981' },
  { name: 'contenido', color: '#f59e0b' },
  { name: 'video', color: '#ec4899' },
  { name: 'sora', color: '#8b5cf6' },
  { name: 'runway', color: '#06b6d4' },
  { name: 'mlops', color: '#ef4444' },
  { name: 'arquitectura', color: '#84cc16' },
  { name: 'ia-generativa', color: '#f97316' },
  { name: 'deployment', color: '#6366f1' }
]

async function main() {
  console.log('🌱 Iniciando seed de la base de datos con funcionalidades avanzadas...')

  // Limpiar datos existentes
  await prisma.promptExecution.deleteMany()
  await prisma.promptRating.deleteMany()
  await prisma.prompt.deleteMany()
  await prisma.template.deleteMany()
  await prisma.collection.deleteMany()
  await prisma.workflow.deleteMany()
  await prisma.category.deleteMany()
  await prisma.tag.deleteMany()

  // Crear categorías
  console.log('📁 Creando categorías...')
  for (const category of sampleCategories) {
    await prisma.category.create({
      data: category
    })
  }

  // Crear tags
  console.log('🏷️ Creando tags...')
  for (const tag of sampleTags) {
    await prisma.tag.create({
      data: tag
    })
  }

  // Crear prompts
  console.log('✨ Creando prompts de ejemplo...')
  for (const prompt of samplePrompts) {
    await prisma.prompt.create({
      data: prompt
    })
  }

  // Crear templates
  console.log('📝 Creando templates...')
  for (const template of sampleTemplates) {
    await prisma.template.create({
      data: template
    })
  }

  // Crear collections
  console.log('📚 Creando collections...')
  for (const collection of sampleCollections) {
    await prisma.collection.create({
      data: collection
    })
  }

  // Crear workflows
  console.log('🔄 Creando workflows...')
  for (const workflow of sampleWorkflows) {
    await prisma.workflow.create({
      data: workflow
    })
  }

  // Crear algunos datos de ejemplo para executions y ratings
  console.log('📊 Creando datos de ejemplo para analytics...')
  
  const prompts = await prisma.prompt.findMany()
  
  // Crear algunas ejecuciones de ejemplo
  for (const prompt of prompts.slice(0, 2)) {
    for (let i = 0; i < 5; i++) {
      await prisma.promptExecution.create({
        data: {
          promptId: prompt.id,
          input: `Ejemplo de input ${i + 1}`,
          output: `Resultado generado ${i + 1}`,
          model: prompt.aiModel,
          tokensUsed: Math.floor(Math.random() * 1000) + 200,
          executionTime: Math.random() * 5 + 1,
          success: Math.random() > 0.1,
          feedback: Math.random() > 0.5 ? 'Excelente resultado' : undefined
        }
      })
    }
  }

  // Crear algunos ratings de ejemplo
  for (const prompt of prompts) {
    const ratingsCount = Math.floor(Math.random() * 10) + 1
    for (let i = 0; i < ratingsCount; i++) {
      await prisma.promptRating.create({
        data: {
          promptId: prompt.id,
          rating: Math.floor(Math.random() * 5) + 1,
          comment: Math.random() > 0.5 ? 'Muy útil este prompt' : undefined,
          userHash: `user_${Math.random().toString(36).substring(7)}`
        }
      })
    }
  }

  console.log('✅ Seed completado exitosamente!')
  console.log(`📊 Creados: ${samplePrompts.length} prompts, ${sampleCategories.length} categorías, ${sampleTags.length} tags`)
  console.log(`🚀 Nuevas funcionalidades: ${sampleTemplates.length} templates, ${sampleCollections.length} collections, ${sampleWorkflows.length} workflows`)
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
