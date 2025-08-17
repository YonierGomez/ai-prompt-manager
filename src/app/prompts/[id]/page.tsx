'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Copy,
  Heart,
  Edit,
  Trash2,
  Eye,
  Star,
  Calendar,
  Tag,
  Cpu,
  Share2,
  Download,
  Check,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { formatDate, AI_MODELS } from '@/lib/utils'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import type { Prompt } from '@/hooks/usePrompts'

export default function PromptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isMarkdownView, setIsMarkdownView] = useState(true)

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/prompts/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Prompt no encontrado')
        }
        
        const data = await response.json()
        setPrompt(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPrompt()
    }
  }, [params.id])

  const handleCopy = async () => {
    if (!prompt) return
    
    try {
      // Verificar si la API moderna de clipboard está disponible
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(prompt.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        // Fallback para navegadores más antiguos usando execCommand
        const textArea = document.createElement('textarea')
        textArea.value = prompt.content
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const success = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (success) {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } else {
          throw new Error('execCommand copy failed')
        }
      }
    } catch (err) {
      console.error('Failed to copy:', err)
      
      // Mostrar un alert como fallback final
      const userWantsCopy = confirm(`No se pudo copiar automáticamente al portapapeles. ¿Quieres ver el contenido para copiarlo manualmente?`)
      if (userWantsCopy) {
        // Crear un modal temporal para mostrar el contenido
        const modal = document.createElement('div')
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        `
        
        const content = document.createElement('div')
        content.style.cssText = `
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 80%;
          max-height: 80%;
          overflow: auto;
        `
        
        const textarea = document.createElement('textarea')
        textarea.value = prompt.content
        textarea.style.cssText = `
          width: 100%;
          height: 300px;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        `
        textarea.readOnly = true
        
        const button = document.createElement('button')
        button.textContent = 'Cerrar'
        button.style.cssText = `
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        `
        button.onclick = () => document.body.removeChild(modal)
        
        content.appendChild(textarea)
        content.appendChild(button)
        modal.appendChild(content)
        document.body.appendChild(modal)
        
        // Seleccionar el texto automáticamente
        textarea.select()
      }
    }
  }

  const toggleFavorite = async () => {
    if (!prompt) return
    
    try {
      const response = await fetch(`/api/prompts/${prompt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !prompt.isFavorite })
      })
      
      if (response.ok) {
        const updated = await response.json()
        setPrompt(updated)
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
  }

  const handleDelete = async () => {
    if (!prompt || !confirm('¿Estás seguro de que quieres eliminar este prompt?')) return
    
    try {
      const response = await fetch(`/api/prompts/${prompt.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        router.push('/')
      }
    } catch (err) {
      console.error('Failed to delete prompt:', err)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !prompt) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold mb-2">Prompt no encontrado</h1>
            <p className="text-muted-foreground mb-4">
              {error || 'El prompt que buscas no existe o ha sido eliminado.'}
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const aiModelInfo = AI_MODELS.find(model => model.value === prompt.aiModel)

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
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado' : 'Copiar'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFavorite}
            className={`flex items-center gap-2 ${
              prompt.isFavorite ? 'text-red-500 hover:text-red-600' : ''
            }`}
          >
            <Heart className={`h-4 w-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
            {prompt.isFavorite ? 'Favorito' : 'Favorito'}
          </Button>
          
          <Button variant="outline" size="sm" asChild>
            <Link href={`/prompts/${prompt.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content - Más ancho */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl leading-tight mb-3 text-white">
                    {prompt.title}
                  </CardTitle>
                  {prompt.description && (
                    <CardDescription className="text-lg text-slate-300 leading-relaxed">
                      {prompt.description}
                    </CardDescription>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFavorite}
                  className={`shrink-0 ${
                    prompt.isFavorite ? 'text-red-400 hover:text-red-300' : 'text-slate-400 hover:text-red-400'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${prompt.isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <Badge className="bg-purple-600/20 text-purple-200 border-purple-500/30 px-3 py-1.5 text-sm">
                  {prompt.category}
                </Badge>
                <Badge 
                  className="border-blue-500/30 text-blue-200 px-3 py-1.5 text-sm"
                  variant="outline"
                  style={{ 
                    borderColor: aiModelInfo?.color + '50',
                    color: aiModelInfo?.color 
                  }}
                >
                  {aiModelInfo?.label || prompt.aiModel}
                </Badge>
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-slate-600 text-slate-300 px-2.5 py-1 text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-8">
                {/* Contenido Principal - Más prominente */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
                      <FileText className="h-5 w-5 text-purple-400" />
                      Contenido del Prompt
                    </h3>
                    <div className="flex items-center gap-1 bg-slate-800/60 rounded-lg p-1">
                      <button
                        onClick={() => setIsMarkdownView(true)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          isMarkdownView
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-300'
                        }`}
                        title="Vista Markdown formateada"
                      >
                        <Eye className="h-4 w-4" />
                        Markdown
                      </button>
                      <button
                        onClick={() => setIsMarkdownView(false)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          !isMarkdownView
                            ? 'bg-slate-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-300'
                        }`}
                        title="Vista de texto plano"
                      >
                        <FileText className="h-4 w-4" />
                        Texto Plano
                      </button>
                    </div>
                  </div>
                  
                  {/* Contenido más grande y destacado */}
                  <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-xl p-6 border border-slate-700/30 shadow-lg">
                    {isMarkdownView ? (
                      <div className="prose prose-lg prose-invert max-w-none">
                        <MarkdownRenderer 
                          content={prompt.content}
                          className="text-slate-200 leading-relaxed"
                        />
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-base font-mono leading-relaxed text-slate-200 overflow-x-auto">
                        {prompt.content}
                      </pre>
                    )}
                  </div>
                </div>
                
                {/* Botones de acción más prominentes */}
                <div className="flex flex-wrap gap-4">
                  <Button onClick={handleCopy} size="lg" className="flex-1 min-w-[140px] bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400">
                    {copied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                    {copied ? 'Copiado al portapapeles' : 'Copiar prompt'}
                  </Button>
                  
                  <Button variant="outline" size="lg" className="border-blue-500/30 text-blue-200 hover:bg-blue-500/10">
                    <Share2 className="mr-2 h-5 w-5" />
                    Compartir
                  </Button>
                  
                  <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-700/50">
                    <Download className="mr-2 h-5 w-5" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar - Más compacto */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Stats Card */}
          <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-400">
                  <Star className="h-4 w-4" />
                  Usos
                </span>
                <span className="font-semibold text-white">{prompt.usageCount}</span>
              </div>
              
              <div className="space-y-1">
                <span className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="h-4 w-4" />
                  Creado
                </span>
                <span className="text-sm text-slate-300 block pl-6">{formatDate(prompt.createdAt)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-400">
                  <Cpu className="h-4 w-4" />
                  Modelo
                </span>
                <span className="text-sm text-slate-300">{aiModelInfo?.label || prompt.aiModel}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-400">
                  <Tag className="h-4 w-4" />
                  Tags
                </span>
                <span className="text-sm text-slate-300">{prompt.tags.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500" asChild>
                <Link href={`/prompts/${prompt.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Prompt
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full border-blue-500/30 text-blue-200 hover:bg-blue-500/10">
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </Button>
              
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50">
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </CardContent>
          </Card>

          {/* Related Prompts */}
          <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">Prompts Relacionados</CardTitle>
              <CardDescription className="text-slate-400">
                Otros prompts de la categoría "{prompt.category}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-slate-400 text-center py-4">
                  Cargando prompts relacionados...
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
