'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
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
  X
} from 'lucide-react'
import Link from 'next/link'
import { AI_MODELS, DEFAULT_CATEGORIES } from '@/lib/utils'
import { MarkdownEditor } from '@/components/markdown-editor'

export default function NewPromptPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <NewPromptForm />
    </Suspense>
  )
}

function NewPromptForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  
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
      // Si viene una categoría específica (ej: desde programming)
      const urlCategory = searchParams.get('category')
      if (urlCategory) {
        setFormData(prev => ({
          ...prev,
          category: urlCategory
        }))
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validación básica en el frontend
    if (!formData.title.trim()) {
      alert('El título es requerido')
      setIsLoading(false)
      return
    }
    
    if (!formData.content.trim()) {
      alert('El contenido es requerido')
      setIsLoading(false)
      return
    }
    
    if (!formData.category.trim()) {
      alert('La categoría es requerida')
      setIsLoading(false)
      return
    }
    
    if (!formData.aiModel.trim()) {
      alert('El modelo de IA es requerido')
      setIsLoading(false)
      return
    }
    
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
      
      // Redirigir al home después de crear
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Crear Nuevo Prompt</h1>
            <p className="text-muted-foreground">
              Crea un prompt personalizado para tus modelos de IA favoritos
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {isPreview ? 'Editar' : 'Vista Previa'}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Detalles del Prompt
              </CardTitle>
              <CardDescription>
                Completa la información para crear tu prompt personalizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Generador de Contenido de Blog"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    placeholder="Breve descripción de qué hace este prompt"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Category and AI Model */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {DEFAULT_CATEGORIES.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aiModel">Modelo de IA *</Label>
                    <select
                      id="aiModel"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.aiModel}
                      onChange={(e) => setFormData(prev => ({ ...prev, aiModel: e.target.value }))}
                      required
                    >
                      {AI_MODELS.map((model) => (
                        <option key={model.value} value={model.value}>
                          {model.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Agregar tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTag}
                        disabled={!newTag.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Contenido del Prompt *</Label>
                  <MarkdownEditor
                    value={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    placeholder="Escribe aquí el contenido completo de tu prompt...

💡 **Consejos para un buen prompt:**
- Usa **negrita** para destacar puntos importantes
- Utiliza `código` para términos técnicos
- Crea listas para estructurar la información
- Añade ejemplos con bloques de código

## Ejemplo de estructura:

```
# Tu Prompt Aquí

## Contexto
Define el rol y contexto...

## Instrucciones
1. Primer paso
2. Segundo paso
3. Resultado esperado

## Ejemplo
Muestra un ejemplo práctico...
```"
                    className="border-slate-700"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.content.length} caracteres • Formato Markdown soportado
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <Label>Opciones</Label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFavorite}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
                        className="rounded border-input"
                      />
                      <Heart className={`h-4 w-4 ${formData.isFavorite ? 'text-red-500 fill-current' : ''}`} />
                      <span className="text-sm">Marcar como favorito</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPrivate}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                        className="rounded border-input"
                      />
                      {formData.isPrivate ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Globe className="h-4 w-4" />
                      )}
                      <span className="text-sm">
                        {formData.isPrivate ? 'Privado' : 'Público'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.title || !formData.content || !formData.category}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? 'Guardando...' : 'Guardar Prompt'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/')}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
              <CardDescription>
                Así se verá tu prompt en la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formData.title || formData.content ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {formData.title || 'Título del prompt'}
                    </h3>
                    {formData.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.category && (
                      <Badge variant="outline">{formData.category}</Badge>
                    )}
                    {formData.aiModel && (
                      <Badge variant="secondary">
                        {AI_MODELS.find(m => m.value === formData.aiModel)?.label}
                      </Badge>
                    )}
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {formData.content && (
                    <div className="text-sm text-muted-foreground border rounded-md p-3 max-h-60 overflow-y-auto">
                      {formData.content.split('\n').map((line, index) => (
                        <p key={index} className={line.trim() ? '' : 'h-4'}>
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {formData.isFavorite && (
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-500 fill-current" />
                        Favorito
                      </span>
                    )}
                    {formData.isPrivate && (
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Privado
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Completa el formulario para ver la vista previa</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
