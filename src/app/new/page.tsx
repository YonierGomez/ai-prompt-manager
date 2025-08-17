'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft,
  Save,
  Eye,
  Heart,
  Lock,
  Globe,
  Sparkles,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Edit3,
  Settings,
  Tag,
  Check,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { AI_MODELS, DEFAULT_CATEGORIES } from '@/lib/utils'
import { MarkdownEditor } from '@/components/markdown-editor'

export default function NewPromptPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>}>
      <NewPromptForm />
    </Suspense>
  )
}

function NewPromptForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    content: true,
    advanced: false
  })
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    category: '',
    aiModel: 'gpt-4o',
    tags: [] as string[],
    isFavorite: false,
    isPrivate: false
  })
  
  const [newTag, setNewTag] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Cargar datos del template si vienen en la URL
  useEffect(() => {
    const template = searchParams.get('template')
    if (template === 'true') {
      const title = searchParams.get('title') || ''
      const content = searchParams.get('content') || ''
      const category = searchParams.get('category') || ''
      const aiModel = searchParams.get('aiModel') || 'gpt-4o'
      const tags = searchParams.get('tags')?.split(',') || []

      setFormData(prev => ({
        ...prev,
        title,
        content,
        category,
        aiModel,
        tags
      }))
    } else {
      const urlCategory = searchParams.get('category')
      if (urlCategory) {
        setFormData(prev => ({
          ...prev,
          category: urlCategory
        }))
      }
    }
  }, [searchParams])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      errors.title = 'El título es requerido'
    }
    
    if (!formData.content.trim()) {
      errors.content = 'El contenido es requerido'
    }
    
    if (!formData.category.trim()) {
      errors.category = 'La categoría es requerida'
    }
    
    if (!formData.aiModel.trim()) {
      errors.aiModel = 'El modelo de IA es requerido'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      console.log('Enviando datos:', formData)
      
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error response:', response.status, errorData)
        throw new Error(`Error al crear el prompt: ${errorData.error || 'Error desconocido'} (${response.status})`)
      }

      const newPrompt = await response.json()
      console.log('Prompt created successfully:', newPrompt)
      
      router.push('/')
    } catch (error) {
      console.error('Error creating prompt:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      addTag()
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getCompletionPercentage = () => {
    const fields = [
      formData.title,
      formData.content,
      formData.category,
      formData.aiModel
    ]
    const completed = fields.filter(field => field.trim()).length
    return Math.round((completed / fields.length) * 100)
  }

  const isFormValid = () => {
    return formData.title.trim() && 
           formData.content.trim() && 
           formData.category.trim() && 
           formData.aiModel.trim()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Mobile Header - Sticky */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm"
            asChild
            className="text-slate-300 hover:text-white"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Volver</span>
            </Link>
          </Button>
          
          <div className="flex-1 mx-4">
            <h1 className="text-lg font-bold text-white truncate">Nuevo Prompt</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
              <span className="text-xs text-slate-400">{getCompletionPercentage()}%</span>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid()}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Guardar</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="pb-20">
        <div className="p-4 space-y-4">
          {/* Información Básica */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader 
                className="pb-3 cursor-pointer"
                onClick={() => toggleSection('basic')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                      <Edit3 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-base">Información Básica</CardTitle>
                      <CardDescription className="text-slate-400 text-sm">
                        Título, descripción y categoría
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 text-slate-400 transition-transform ${
                      expandedSections.basic ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </CardHeader>
              
              <AnimatePresence>
                {expandedSections.basic && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="space-y-4 pt-0">
                      {/* Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-300 flex items-center gap-2">
                          Título *
                          {validationErrors.title && (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          )}
                        </Label>
                        <Input
                          id="title"
                          placeholder="Ej: Generador de Contenido de Blog"
                          value={formData.title}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, title: e.target.value }))
                            if (validationErrors.title) {
                              setValidationErrors(prev => ({ ...prev, title: '' }))
                            }
                          }}
                          className={`bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 ${
                            validationErrors.title ? 'border-red-400' : ''
                          }`}
                        />
                        {validationErrors.title && (
                          <p className="text-red-400 text-sm">{validationErrors.title}</p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-300">Descripción</Label>
                        <Input
                          id="description"
                          placeholder="Breve descripción de qué hace este prompt"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500"
                        />
                      </div>

                      {/* Category and AI Model - Stack on mobile */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-slate-300 flex items-center gap-2">
                            Categoría *
                            {validationErrors.category && (
                              <AlertCircle className="h-4 w-4 text-red-400" />
                            )}
                          </Label>
                          <select
                            id="category"
                            className={`flex h-12 w-full rounded-lg border bg-slate-700/50 px-4 py-3 text-white focus:border-purple-500 focus:outline-none ${
                              validationErrors.category ? 'border-red-400' : 'border-slate-600'
                            }`}
                            value={formData.category}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, category: e.target.value }))
                              if (validationErrors.category) {
                                setValidationErrors(prev => ({ ...prev, category: '' }))
                              }
                            }}
                          >
                            <option value="">Seleccionar categoría</option>
                            {DEFAULT_CATEGORIES.map((cat) => (
                              <option key={cat.name} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          {validationErrors.category && (
                            <p className="text-red-400 text-sm">{validationErrors.category}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="aiModel" className="text-slate-300 flex items-center gap-2">
                            Modelo de IA *
                            {validationErrors.aiModel && (
                              <AlertCircle className="h-4 w-4 text-red-400" />
                            )}
                          </Label>
                          <select
                            id="aiModel"
                            className={`flex h-12 w-full rounded-lg border bg-slate-700/50 px-4 py-3 text-white focus:border-purple-500 focus:outline-none ${
                              validationErrors.aiModel ? 'border-red-400' : 'border-slate-600'
                            }`}
                            value={formData.aiModel}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, aiModel: e.target.value }))
                              if (validationErrors.aiModel) {
                                setValidationErrors(prev => ({ ...prev, aiModel: '' }))
                              }
                            }}
                          >
                            {AI_MODELS.map((model) => (
                              <option key={model.value} value={model.value}>
                                {model.label}
                              </option>
                            ))}
                          </select>
                          {validationErrors.aiModel && (
                            <p className="text-red-400 text-sm">{validationErrors.aiModel}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Contenido del Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm">
              <CardHeader 
                className="pb-3 cursor-pointer"
                onClick={() => toggleSection('content')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-base flex items-center gap-2">
                        Contenido del Prompt *
                        {validationErrors.content && (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-sm">
                        El corazón de tu prompt
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 text-slate-400 transition-transform ${
                      expandedSections.content ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </CardHeader>
              
              <AnimatePresence>
                {expandedSections.content && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Mobile-optimized editor */}
                        <div className="block md:hidden">
                          <Textarea
                            placeholder="Escribe aquí el contenido completo de tu prompt...

💡 Consejos para un buen prompt:
• Sé específico y claro
• Usa ejemplos cuando sea posible
• Define el formato de salida esperado
• Incluye contexto relevante"
                            value={formData.content}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, content: e.target.value }))
                              if (validationErrors.content) {
                                setValidationErrors(prev => ({ ...prev, content: '' }))
                              }
                            }}
                            className={`min-h-[300px] bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 resize-none ${
                              validationErrors.content ? 'border-red-400' : ''
                            }`}
                            style={{ fontSize: '16px' }} // Prevent zoom on iOS
                          />
                        </div>
                        
                        {/* Desktop editor */}
                        <div className="hidden md:block">
                          <MarkdownEditor
                            value={formData.content}
                            onChange={(content) => {
                              setFormData(prev => ({ ...prev, content }))
                              if (validationErrors.content) {
                                setValidationErrors(prev => ({ ...prev, content: '' }))
                              }
                            }}
                            placeholder="Escribe aquí el contenido completo de tu prompt..."
                            className="border-purple-500/50 shadow-lg"
                            minHeight="min-h-[400px]"
                          />
                        </div>
                        
                        {validationErrors.content && (
                          <p className="text-red-400 text-sm">{validationErrors.content}</p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{formData.content.length} caracteres</span>
                          <span className="px-2 py-1 bg-purple-600/20 rounded text-purple-300">
                            Campo Obligatorio
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Configuración Avanzada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader 
                className="pb-3 cursor-pointer"
                onClick={() => toggleSection('advanced')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg">
                      <Settings className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-base">Configuración Avanzada</CardTitle>
                      <CardDescription className="text-slate-400 text-sm">
                        Tags, favoritos y privacidad
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 text-slate-400 transition-transform ${
                      expandedSections.advanced ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </CardHeader>
              
              <AnimatePresence>
                {expandedSections.advanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="space-y-6 pt-0">
                      {/* Tags */}
                      <div className="space-y-3">
                        <Label className="text-slate-300 flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Tags
                        </Label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {formData.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="secondary" 
                              className="flex items-center gap-1 bg-purple-600/20 text-purple-300 border-purple-500/30 px-3 py-1"
                            >
                              {tag}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-red-400 transition-colors"
                                onClick={() => removeTag(tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Agregar tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500"
                            style={{ fontSize: '16px' }} // Prevent zoom on iOS
                          />
                          <Button 
                            type="button" 
                            onClick={addTag} 
                            variant="outline" 
                            size="sm"
                            className="shrink-0 border-slate-600 text-slate-300 hover:bg-slate-700 min-w-[44px] min-h-[44px]"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="space-y-4">
                        <Label className="text-slate-300">Opciones</Label>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <Heart className={`h-5 w-5 ${formData.isFavorite ? 'text-red-500 fill-current' : 'text-slate-400'}`} />
                              <div>
                                <span className="text-white font-medium">Marcar como favorito</span>
                                <p className="text-slate-400 text-sm">Aparecerá en tu lista de favoritos</p>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={formData.isFavorite}
                              onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
                              className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                            />
                          </label>
                          
                          <label className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center gap-3">
                              {formData.isPrivate ? (
                                <Lock className="h-5 w-5 text-slate-400" />
                              ) : (
                                <Globe className="h-5 w-5 text-slate-400" />
                              )}
                              <div>
                                <span className="text-white font-medium">Prompt privado</span>
                                <p className="text-slate-400 text-sm">Solo tú podrás verlo</p>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={formData.isPrivate}
                              onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                              className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                            />
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </form>

      {/* Mobile Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 safe-bottom">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/')}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 min-h-[48px]"
          >
            Cancelar
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg disabled:opacity-50 min-h-[48px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Guardando...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Guardar Prompt</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
