import { PrismaClient } from '@prisma/client'

console.log('🚀 Iniciando script de seed...')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos con funcionalidades avanzadas...')

  // Limpiar datos existentes
  console.log('🧹 Limpiando datos existentes...')
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
  const categories = [
    { name: 'Escritura', description: 'Prompts para creación de contenido, copywriting y redacción', color: '#3b82f6', icon: 'PenTool' },
    { name: 'Programación', description: 'Code review, debugging, desarrollo y mejores prácticas', color: '#10b981', icon: 'Code' },
    { name: 'Análisis', description: 'Análisis de datos, insights y business intelligence', color: '#f59e0b', icon: 'BarChart3' },
    { name: 'Creatividad', description: 'Brainstorming, ideación y pensamiento creativo', color: '#ec4899', icon: 'Palette' },
    { name: 'Productividad', description: 'Optimización personal, gestión del tiempo y hábitos', color: '#8b5cf6', icon: 'Zap' },
    { name: 'Educación', description: 'Enseñanza, tutoriales y metodologías de aprendizaje', color: '#06b6d4', icon: 'GraduationCap' },
    { name: 'Marketing', description: 'Estrategias de marketing, growth hacking y ventas', color: '#ef4444', icon: 'TrendingUp' },
    { name: 'Investigación', description: 'Research, análisis de mercado y metodologías científicas', color: '#84cc16', icon: 'Search' }
  ]

  for (const category of categories) {
    await prisma.category.create({ data: category })
  }

  // Crear tags
  console.log('🏷️ Creando tags...')
  const tags = [
    { name: 'blog', color: '#3b82f6' },
    { name: 'seo', color: '#10b981' },
    { name: 'video', color: '#ec4899' },
    { name: 'sora', color: '#8b5cf6' },
    { name: 'runway', color: '#06b6d4' },
    { name: 'mlops', color: '#ef4444' },
    { name: 'arquitectura', color: '#84cc16' },
    { name: 'ia-generativa', color: '#f97316' },
    { name: 'prompt-engineering', color: '#6366f1' },
    { name: 'gpt-5', color: '#10b981' }
  ]

  for (const tag of tags) {
    await prisma.tag.create({ data: tag })
  }

  // Crear prompts avanzados
  console.log('✨ Creando prompts avanzados...')
  
  const prompt1 = await prisma.prompt.create({
    data: {
      title: 'Generador de Contenido de Blog Avanzado',
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
    }
  })

  const prompt2 = await prisma.prompt.create({
    data: {
      title: 'Generador de Videos con IA - Sora & Runway',
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

4. **Prompts para IA de video**
   - Descripción visual detallada
   - Movimientos de cámara específicos
   - Iluminación y atmosfera
   - Transiciones entre escenas

**Elementos visuales:**
- Paleta de colores: {{COLORES}}
- Estilo visual: {{ESTILO_VISUAL}}

**Prompts optimizados para:**
- Sora: Descripción cinematográfica detallada
- Runway: Especificaciones técnicas precisas
- Midjourney: Frames estáticos de alta calidad`,
      description: 'Crea contenido audiovisual profesional con prompts optimizados para herramientas de IA de video',
      category: 'Creatividad',
      tags: JSON.stringify(['video', 'sora', 'runway', 'contenido-audiovisual', 'storyboard', 'ia-generativa']),
      aiModel: 'gemini-2.5-pro',
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
        { name: 'FRAME_RATE', type: 'select', options: ['24fps', '30fps', '60fps'], required: true }
      ]),
      version: '1.0',
      avgRating: 4.9,
      totalRatings: 45,
      successRate: 91.8,
      author: 'Video AI Expert',
      source: 'Best practices para generación de video con IA'
    }
  })

  const prompt3 = await prisma.prompt.create({
    data: {
      title: 'Arquitecto de Sistemas de IA MLOps',
      content: `Soy un arquitecto de sistemas especializado en infraestructura de IA, MLOps y deployment de modelos a escala. Te ayudo a diseñar, implementar y optimizar sistemas de machine learning robustos y escalables.

**Contexto del proyecto:**
- **Tipo de sistema**: {{TIPO_SISTEMA}}
- **Escala de datos**: {{ESCALA_DATOS}}
- **Latencia requerida**: {{LATENCIA}}
- **Budget**: {{PRESUPUESTO}}

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

**Stack recomendado:**
- **Cloud**: {{CLOUD_PROVIDER}}
- **Frameworks**: {{FRAMEWORK}}
- **Deployment**: {{DEPLOYMENT_STRATEGY}}`,
      description: 'Diseña sistemas de IA escalables con arquitectura MLOps y mejores prácticas de deployment',
      category: 'Programación',
      tags: JSON.stringify(['mlops', 'arquitectura', 'ia', 'deployment', 'sistemas-distribuidos', 'devops']),
      aiModel: 'claude-opus-4.1',
      isFavorite: false,
      usageCount: 15,
      difficulty: 'Experto',
      estimatedTokens: 1500,
      language: 'es',
      industry: 'Tecnología',
      templateVariables: JSON.stringify([
        { name: 'TIPO_SISTEMA', type: 'select', options: ['Recomendaciones', 'NLP', 'Computer Vision', 'Time Series'], required: true },
        { name: 'ESCALA_DATOS', type: 'select', options: ['< 1GB', '1GB - 100GB', '100GB - 10TB', '> 10TB'], required: true },
        { name: 'LATENCIA', type: 'select', options: ['< 100ms', '100ms - 1s', '1s - 10s', '> 10s'], required: true },
        { name: 'PRESUPUESTO', type: 'select', options: ['< $1k/mes', '$1k - $10k/mes', '$10k - $100k/mes', '> $100k/mes'], required: true }
      ]),
      version: '1.2',
      avgRating: 4.7,
      totalRatings: 82,
      successRate: 89.5,
      author: 'MLOps Architect',
      source: 'Patrones de arquitectura ML en producción'
    }
  })

  const prompt4 = await prisma.prompt.create({
    data: {
      title: 'Experto en Prompt Engineering Avanzado',
      content: `Soy un especialista en prompt engineering con experiencia profunda en optimización de prompts para los modelos más avanzados (GPT-5, Claude Opus 4.1, Gemini 2.5, O3).

**Metodologías avanzadas:**

1. **Chain-of-Thought (CoT) optimizado**
   - Step-by-step reasoning
   - Multi-hop logical connections
   - Self-correction mechanisms

2. **Few-shot learning estratégico**
   - Example selection optimization
   - Context window management
   - Dynamic example adaptation

3. **Constitutional AI principles**
   - Value alignment
   - Harmfulness mitigation
   - Truthfulness enhancement

4. **Advanced techniques**
   - Tree of Thoughts (ToT)
   - Reflection patterns
   - Meta-prompting strategies
   - Tool-use optimization

**Framework de optimización:**

**Paso 1: Análisis del objetivo**
- Task complexity: {{COMPLEJIDAD}}
- Output format: {{FORMATO_OUTPUT}}
- Success criteria: {{CRITERIOS_EXITO}}

**Paso 2: Prompt architecture**
- System message design
- Context organization
- Instruction clarity

**Paso 3: Testing y refinement**
- A/B testing diferentes versiones
- Performance metrics tracking
- Edge case handling

**Paso 4: Model-specific optimization**
- Target model: {{MODELO_OBJETIVO}}
- Specific techniques for optimal performance
- Context window optimization

**Tu tarea actual:** {{TAREA}}
**Objetivo específico:** {{OBJETIVO_ESPECIFICO}}`,
      description: 'Optimiza prompts para modelos de IA avanzados con técnicas de prompt engineering de última generación',
      category: 'Educación',
      tags: JSON.stringify(['prompt-engineering', 'optimizacion', 'ia-avanzada', 'chain-of-thought', 'few-shot']),
      aiModel: 'o3',
      isFavorite: true,
      usageCount: 22,
      difficulty: 'Experto',
      estimatedTokens: 1000,
      language: 'es',
      industry: 'Tecnología',
      templateVariables: JSON.stringify([
        { name: 'COMPLEJIDAD', type: 'select', options: ['Simple', 'Media', 'Alta', 'Muy Alta'], required: true },
        { name: 'FORMATO_OUTPUT', type: 'select', options: ['Texto', 'JSON', 'Código', 'Lista', 'Análisis'], required: true },
        { name: 'CRITERIOS_EXITO', type: 'textarea', required: true, description: 'Define qué hace exitoso este prompt' },
        { name: 'MODELO_OBJETIVO', type: 'select', options: ['GPT-5', 'Claude-Opus-4.1', 'Gemini-2.5-Pro', 'O3'], required: true },
        { name: 'TAREA', type: 'textarea', required: true, description: 'Describe la tarea específica' },
        { name: 'OBJETIVO_ESPECIFICO', type: 'text', required: true, description: 'Objetivo concreto a lograr' }
      ]),
      version: '1.0',
      avgRating: 4.9,
      totalRatings: 88,
      successRate: 96.1,
      author: 'Prompt Engineering Expert',
      source: 'Advanced prompt optimization techniques 2025'
    }
  })

  const prompt5 = await prisma.prompt.create({
    data: {
      title: 'Analista de Ciberseguridad con IA Avanzada',
      content: `Soy un experto en ciberseguridad especializado en threat intelligence, análisis de vulnerabilidades y respuesta a incidentes utilizando las últimas herramientas de IA y machine learning.

**Capacidades principales:**

1. **Threat Detection Avanzado**
   - Análisis de patrones anómalos con IA
   - Detección de malware con ML
   - Behavioral analysis automatizado
   - Zero-day threat identification

2. **Vulnerability Assessment 2025**
   - Automated penetration testing
   - Code security analysis con LLMs
   - Infrastructure hardening
   - Risk prioritization with AI

3. **Incident Response Inteligente**
   - Forensic analysis automation
   - Attack vector reconstruction
   - Impact assessment con ML
   - Recovery planning optimizado

4. **AI Security específico**
   - Model poisoning detection
   - Adversarial attack mitigation
   - Prompt injection prevention
   - AI model security auditing

**Contexto de seguridad:**
- **Tipo de organización**: {{TIPO_ORG}}
- **Tamaño de infraestructura**: {{TAMANO_INFRA}}
- **Nivel de riesgo**: {{NIVEL_RIESGO}}
- **Compliance requerido**: {{COMPLIANCE}}

**Herramientas IA que utilizo:**
- **SIEM/SOAR**: Splunk con ML, QRadar AI
- **AI/ML Security**: TensorFlow Security, IBM Watson
- **Automated Testing**: AI-powered Metasploit, Burp Suite Pro
- **Threat Intelligence**: VirusTotal Intelligence, CrowdStrike Falcon

**Framework de análisis 2025:**

1. **Reconnaissance Automatizado**
   - Asset discovery con IA
   - Attack surface mapping inteligente
   - Threat landscape analysis en tiempo real

2. **Assessment Inteligente**
   - Vulnerability scanning automatizado
   - Risk scoring con ML avanzado
   - Business impact analysis predictivo

3. **Mitigation Proactiva**
   - Security controls recommendation
   - Implementation roadmap automatizado
   - Monitoring strategy adaptativo

**Análisis requerido:** {{ANALISIS_TIPO}}
**Urgencia:** {{URGENCIA}}`,
      description: 'Análisis avanzado de ciberseguridad con IA para threat detection y response automatizada usando tecnologías 2025',
      category: 'Análisis',
      tags: JSON.stringify(['ciberseguridad', 'threat-intelligence', 'incident-response', 'ml-security', 'pentesting', 'ai-security']),
      aiModel: 'claude-sonnet-4',
      isFavorite: false,
      usageCount: 11,
      difficulty: 'Experto',
      estimatedTokens: 1300,
      language: 'es',
      industry: 'Ciberseguridad',
      templateVariables: JSON.stringify([
        { name: 'TIPO_ORG', type: 'select', options: ['Startup', 'PYME', 'Enterprise', 'Gobierno', 'Fintech'], required: true },
        { name: 'TAMANO_INFRA', type: 'select', options: ['< 100 endpoints', '100-1000', '1000-10000', '> 10000'], required: true },
        { name: 'NIVEL_RIESGO', type: 'select', options: ['Bajo', 'Medio', 'Alto', 'Crítico'], required: true },
        { name: 'COMPLIANCE', type: 'select', options: ['GDPR', 'SOX', 'HIPAA', 'PCI-DSS', 'ISO 27001'], required: false },
        { name: 'ANALISIS_TIPO', type: 'select', options: ['Vulnerability Assessment', 'Incident Response', 'Threat Hunting', 'Security Audit'], required: true },
        { name: 'URGENCIA', type: 'select', options: ['Baja', 'Media', 'Alta', 'Crítica'], required: true }
      ]),
      version: '2.0',
      avgRating: 4.7,
      totalRatings: 94,
      successRate: 91.3,
      author: 'CyberSec AI Expert',
      source: 'Advanced cybersecurity methodologies 2025'
    }
  })

  // Crear algunos datos de analytics
  console.log('📊 Creando datos de analytics...')
  
  const prompts = [prompt1, prompt2, prompt3, prompt4, prompt5]
  
  for (const prompt of prompts) {
    // Crear ejecuciones
    for (let i = 0; i < 3; i++) {
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

    // Crear ratings
    for (let i = 0; i < 5; i++) {
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

  // Agregar prompt con formato Markdown avanzado
  console.log('📝 Creando prompt con formato Markdown...')
  await prisma.prompt.create({
    data: {
      title: 'Guía Completa de Markdown para Prompts',
      content: `# 🎯 Guía Completa de Markdown para Prompts

## 📚 Introducción

El **formato Markdown** permite crear prompts **visualmente atractivos** y *fáciles de leer*. Esta guía te enseñará cómo maximizar la efectividad de tus prompts usando formato.

---

## 🛠️ Elementos Básicos

### Texto y Énfasis
- **Negrita**: Para destacar puntos importantes
- *Cursiva*: Para énfasis suave
- \`Código inline\`: Para términos técnicos
- ~~Tachado~~: Para mostrar lo que NO hacer

### Listas y Estructura

#### ✅ Lista de verificación:
- [x] Definir objetivo del prompt
- [x] Estructurar el contenido
- [ ] Añadir ejemplos
- [ ] Probar y optimizar

#### 📋 Pasos ordenados:
1. **Análisis del contexto**
2. **Definición de variables**
3. **Estructura del prompt**
4. **Optimización iterativa**

---

## 💡 Ejemplos Prácticos

### Prompt para Análisis de Datos

\`\`\`python
# Ejemplo de código Python para análisis
import pandas as pd
import matplotlib.pyplot as plt

def analyze_data(dataset):
    return dataset.describe()
\`\`\`

### Variables del Template

| Variable | Tipo | Descripción | Ejemplo |
|----------|------|-------------|---------|
| \`{{TEMA}}\` | String | Tema principal | "Marketing Digital" |
| \`{{NIVEL}}\` | Select | Nivel de experiencia | Principiante/Intermedio/Avanzado |
| \`{{FORMATO}}\` | Select | Formato de salida | Blog/Email/Social Media |

---

## 🎨 Elementos Visuales

> **💡 Tip Importante**: Los blockquotes son perfectos para destacar consejos y notas importantes que el usuario debe recordar.

### Código con Sintaxis

\`\`\`javascript
// Ejemplo de función para validar prompts
function validatePrompt(prompt) {
  if (!prompt.title || !prompt.content) {
    throw new Error('Título y contenido son requeridos');
  }
  return true;
}
\`\`\`

### Enlaces y Referencias
- [Documentación oficial de Markdown](https://www.markdownguide.org/)
- [Guía de prompting de OpenAI](https://platform.openai.com/docs/)

---

## 🚀 Framework de Prompt Optimizado

### 1. **Contexto y Rol**
\`\`\`
Eres un [ROL_ESPECÍFICO] con experiencia en [ÁREA_EXPERTISE].
Tu objetivo es [OBJETIVO_CLARO].
\`\`\`

### 2. **Input y Variables**
- **{{VARIABLE_1}}**: Descripción clara
- **{{VARIABLE_2}}**: Tipo y restricciones
- **{{VARIABLE_3}}**: Valores por defecto

### 3. **Instrucciones Paso a Paso**

#### Fase 1: Análisis
1. Analiza el input proporcionado
2. Identifica patrones y elementos clave
3. Define el enfoque apropiado

#### Fase 2: Procesamiento
1. Aplica las reglas definidas
2. Genera contenido estructurado
3. Optimiza para el objetivo

#### Fase 3: Validación
1. Revisa coherencia y calidad
2. Verifica cumplimiento de requisitos
3. Propone mejoras si es necesario

---

## 📊 Métricas de Calidad

| Aspecto | ⭐⭐⭐⭐⭐ | Descripción |
|---------|------------|-------------|
| **Claridad** | ⭐⭐⭐⭐⭐ | Instrucciones claras y sin ambigüedad |
| **Estructura** | ⭐⭐⭐⭐⭐ | Organización lógica y flujo coherente |
| **Ejemplos** | ⭐⭐⭐⭐⭐ | Casos de uso y ejemplos prácticos |
| **Flexibilidad** | ⭐⭐⭐⭐⭐ | Adaptabilidad a diferentes contextos |

---

## 🎯 Conclusión

El formato Markdown transforma prompts simples en **documentos profesionales** que:
- Mejoran la **legibilidad**
- Facilitan el **mantenimiento**
- Aumentan la **efectividad**
- Permiten **colaboración** más fluida

> **🚀 ¡Próximo paso!**: Aplica estos conceptos en tus propios prompts y observa la diferencia en resultados.`,
      description: 'Una guía completa que demuestra cómo usar Markdown para crear prompts visualmente atractivos y altamente efectivos',
      category: 'Educación',
      tags: JSON.stringify(['markdown', 'prompts', 'formato', 'documentación', 'guía', 'tutorial']),
      aiModel: 'gpt-5',
      isFavorite: true,
      usageCount: 45,
      difficulty: 'Intermedio',
      estimatedTokens: 1200,
      language: 'es',
      industry: 'Tecnología',
      templateVariables: JSON.stringify([
        { name: 'ROL_ESPECÍFICO', type: 'text', required: true, description: 'Define el rol que debe asumir la IA' },
        { name: 'ÁREA_EXPERTISE', type: 'text', required: true, description: 'Área de especialización' },
        { name: 'OBJETIVO_CLARO', type: 'text', required: true, description: 'Objetivo específico del prompt' }
      ]),
      version: '1.0',
      avgRating: 4.9,
      totalRatings: 67,
      successRate: 96.8,
      author: 'Markdown Expert',
      source: 'Metodología de documentación técnica'
    }
  })

  console.log('✅ Seed completado exitosamente!')
  console.log(`📊 Creados: ${prompts.length + 1} prompts avanzados`)
  console.log('🎯 Modelos actualizados: GPT-5, Claude Opus 4.1, Gemini 2.5 Pro, O3, Claude Sonnet 4')
  console.log('🚀 Nuevas funcionalidades: Templates, Collections, Workflows, Analytics')
  console.log('🔐 Incluye: Ciberseguridad, Prompt Engineering, MLOps, Video AI')
  console.log('📝 Formato Markdown: Agregado prompt de demostración')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
