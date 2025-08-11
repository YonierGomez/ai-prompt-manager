'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, ArrowLeft, Plus, Sparkles, Code, Brain, MessageSquare, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Template {
  id: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  aiModel: string
  icon: React.ReactNode
  color: string
}

const templates: Template[] = [
  {
    id: '1',
    title: 'Generador de Código',
    description: 'Template para generar código en cualquier lenguaje de programación',
    content: 'Actúa como un desarrollador experto en [LENGUAJE]. Necesito que generes código para [DESCRIPCIÓN_FUNCIONALIDAD]. El código debe:\n\n1. Ser limpio y bien documentado\n2. Seguir las mejores prácticas del lenguaje\n3. Incluir manejo de errores\n4. Ser escalable y mantenible\n\nRequerimientos específicos:\n- [REQUISITO_1]\n- [REQUISITO_2]\n- [REQUISITO_3]\n\nPor favor, proporciona el código completo con explicaciones.',
    category: 'Programación',
    tags: ['código', 'desarrollo', 'programación'],
    aiModel: 'gpt-4o',
    icon: <Code className="h-5 w-5" />,
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Análisis de Texto',
    description: 'Template para análisis profundo de contenido textual',
    content: 'Analiza el siguiente texto desde múltiples perspectivas:\n\n[TEXTO_A_ANALIZAR]\n\nPor favor, proporciona:\n\n1. **Resumen ejecutivo** (2-3 líneas)\n2. **Tono y estilo** del texto\n3. **Temas principales** identificados\n4. **Audiencia objetivo** probable\n5. **Fortalezas** del contenido\n6. **Áreas de mejora** sugeridas\n7. **Palabras clave** relevantes\n8. **Recomendaciones** específicas\n\nFormato de respuesta estructurado y profesional.',
    category: 'Análisis',
    tags: ['análisis', 'texto', 'contenido'],
    aiModel: 'claude-sonnet-4',
    icon: <Brain className="h-5 w-5" />,
    color: 'bg-purple-500'
  },
  {
    id: '3',
    title: 'Creador de Contenido',
    description: 'Template para generar contenido creativo y atractivo',
    content: 'Eres un creador de contenido experto. Necesito que generes contenido para [PLATAFORMA/MEDIO] sobre el tema: [TEMA]\n\n**Especificaciones:**\n- Audiencia: [DESCRIPCIÓN_AUDIENCIA]\n- Tono: [PROFESIONAL/CASUAL/DIVERTIDO/ETC]\n- Longitud: [NÚMERO] palabras aproximadamente\n- Objetivo: [INFORMAR/ENTRETENER/VENDER/ETC]\n\n**Incluir:**\n✓ Hook atractivo para captar atención\n✓ Información valiosa y relevante\n✓ Call-to-action claro\n✓ Hashtags relevantes (si aplica)\n✓ Estructura fácil de leer\n\n**Elementos adicionales:**\n- [ELEMENTO_1]\n- [ELEMENTO_2]',
    category: 'Marketing',
    tags: ['contenido', 'marketing', 'social media'],
    aiModel: 'gpt-5',
    icon: <MessageSquare className="h-5 w-5" />,
    color: 'bg-green-500'
  },
  {
    id: '4',
    title: 'Diseño y UI/UX',
    description: 'Template para consultas sobre diseño y experiencia de usuario',
    content: 'Como experto en UI/UX, necesito tu ayuda con [TIPO_PROYECTO]. \n\n**Contexto del proyecto:**\n- Industria: [INDUSTRIA]\n- Audiencia objetivo: [DESCRIPCIÓN_USUARIOS]\n- Plataforma: [WEB/MÓVIL/AMBAS]\n- Objetivo principal: [OBJETIVO]\n\n**Necesito específicamente:**\n1. Sugerencias de diseño para [ELEMENTO_ESPECÍFICO]\n2. Mejores prácticas de UX para [FUNCIONALIDAD]\n3. Paleta de colores apropiada\n4. Tipografía recomendada\n5. Patrones de interacción\n6. Consideraciones de accesibilidad\n\n**Restricciones:**\n- [RESTRICCIÓN_1]\n- [RESTRICCIÓN_2]\n\nProporciona respuestas detalladas con justificación.',
    category: 'Diseño',
    tags: ['diseño', 'ui', 'ux', 'interfaz'],
    aiModel: 'claude-opus-4.1',
    icon: <Palette className="h-5 w-5" />,
    color: 'bg-pink-500'
  },
  {
    id: '5',
    title: 'Investigación y Datos',
    description: 'Template para investigación y análisis de datos',
    content: 'Actúa como investigador experto. Necesito que investigues y analices: [TEMA_INVESTIGACIÓN]\n\n**Objetivos de la investigación:**\n1. [OBJETIVO_1]\n2. [OBJETIVO_2]\n3. [OBJETIVO_3]\n\n**Áreas de enfoque:**\n- Tendencias actuales en [ÁREA]\n- Datos estadísticos relevantes\n- Casos de estudio significativos\n- Proyecciones futuras\n- Factores de impacto\n\n**Formato de entrega:**\n📊 **Datos clave** con fuentes\n📈 **Tendencias** identificadas\n🔍 **Insights** principales\n💡 **Recomendaciones** basadas en datos\n📚 **Fuentes** confiables\n\n**Criterios de calidad:**\n- Información actualizada (últimos 2 años)\n- Fuentes verificables\n- Análisis objetivo\n- Conclusiones actionables',
    category: 'Investigación',
    tags: ['investigación', 'datos', 'análisis', 'tendencias'],
    aiModel: 'gemini-2.5-pro',
    icon: <Sparkles className="h-5 w-5" />,
    color: 'bg-orange-500'
  }
]

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const router = useRouter()

  const createFromTemplate = (template: Template) => {
    // Redirigir a la página de crear con el template pre-cargado
    const params = new URLSearchParams({
      template: 'true',
      title: template.title,
      content: template.content,
      category: template.category,
      aiModel: template.aiModel,
      tags: template.tags.join(',')
    })
    router.push(`/new?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Plantillas de Prompts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Acelera tu trabajo con plantillas predefinidas y personalizables
            </p>
          </motion.div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-full text-white ${template.color} group-hover:scale-110 transition-transform`}>
                      {template.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {template.aiModel}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Category */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Categoría: <span className="font-medium">{template.category}</span>
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => createFromTemplate(template)}
                        className="flex-1"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Usar Template
                      </Button>
                      <Button 
                        onClick={() => setSelectedTemplate(template)}
                        variant="outline"
                        size="sm"
                      >
                        Ver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Template Preview Modal */}
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full text-white ${selectedTemplate.color}`}>
                    {selectedTemplate.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedTemplate.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedTemplate.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Contenido del Template:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm whitespace-pre-wrap overflow-x-auto">
                    {selectedTemplate.content}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => createFromTemplate(selectedTemplate)}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Usar Este Template
                  </Button>
                  <Button 
                    onClick={() => setSelectedTemplate(null)}
                    variant="outline"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
