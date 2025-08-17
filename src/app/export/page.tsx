'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Filter, ArrowLeft, CheckCircle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

interface Prompt {
  id: string
  title: string
  content: string
  description: string
  category: string
  tags: string[]
  aiModel: string
  createdAt: string
  updatedAt: string
}

export default function ExportPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterModel, setFilterModel] = useState<string>('all')
  const [exportSuccess, setExportSuccess] = useState(false)

  useEffect(() => {
    fetchPrompts()
  }, [])

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompts')
      if (response.ok) {
        const data = await response.json()
        setPrompts(data)
        // Seleccionar todos por defecto
        setSelectedPrompts(new Set(data.map((p: Prompt) => p.id)))
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = Array.from(new Set(prompts.map(p => p.category)))
  const aiModels = Array.from(new Set(prompts.map(p => p.aiModel)))

  const filteredPrompts = prompts.filter(prompt => {
    if (filterCategory !== 'all' && prompt.category !== filterCategory) return false
    if (filterModel !== 'all' && prompt.aiModel !== filterModel) return false
    return true
  })

  const togglePrompt = (promptId: string) => {
    const newSelected = new Set(selectedPrompts)
    if (newSelected.has(promptId)) {
      newSelected.delete(promptId)
    } else {
      newSelected.add(promptId)
    }
    setSelectedPrompts(newSelected)
  }

  const toggleAll = () => {
    const currentFiltered = filteredPrompts.map(p => p.id)
    const allSelected = currentFiltered.every(id => selectedPrompts.has(id))
    
    const newSelected = new Set(selectedPrompts)
    if (allSelected) {
      currentFiltered.forEach(id => newSelected.delete(id))
    } else {
      currentFiltered.forEach(id => newSelected.add(id))
    }
    setSelectedPrompts(newSelected)
  }

  const exportPrompts = async () => {
    setIsExporting(true)
    
    try {
      const selectedPromptsData = prompts.filter(p => selectedPrompts.has(p.id))
      
      // Limpiar datos para exportación
      const exportData = selectedPromptsData.map(prompt => ({
        title: prompt.title,
        content: prompt.content,
        description: prompt.description,
        category: prompt.category,
        tags: prompt.tags,
        aiModel: prompt.aiModel,
        createdAt: prompt.createdAt,
        updatedAt: prompt.updatedAt
      }))

      // Crear archivo JSON
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      // Descargar archivo
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `prompts-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    } catch (error) {
      console.error('Error exporting prompts:', error)
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando prompts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Mobile Header - Sticky */}
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
          <div className="flex items-center justify-between p-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
            </Link>
            
            <div className="flex-1 mx-4">
              <h1 className="text-lg font-bold text-white truncate">Exportar</h1>
              <p className="text-xs text-slate-400 truncate">
                {selectedPrompts.size} de {prompts.length} seleccionados
              </p>
            </div>

            <Button 
              onClick={exportPrompts}
              disabled={selectedPrompts.size === 0 || isExporting}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">
                {isExporting ? 'Exportando...' : 'Exportar'}
              </span>
            </Button>
          </div>
        </div>

        <div className="p-4">
          {/* Success Message */}
          {exportSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <Alert className="border-green-500/30 bg-green-900/20 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  ¡Exportación exitosa! Archivo descargado.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Mobile-optimized Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="mb-4 border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                    <Filter className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-base">Filtros</CardTitle>
                    <CardDescription className="text-slate-400 text-sm">
                      Selecciona los prompts a exportar
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Mobile-stacked filters */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Categoría</label>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Todas las categorías" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las categorías</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Modelo de IA</label>
                      <Select value={filterModel} onValueChange={setFilterModel}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Todos los modelos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los modelos</SelectItem>
                          {aiModels.map(model => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Mobile-optimized stats and toggle */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{prompts.length}</div>
                        <div className="text-xs text-slate-400">Total</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-400">{filteredPrompts.length}</div>
                        <div className="text-xs text-slate-400">Filtrados</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-400">{selectedPrompts.size}</div>
                        <div className="text-xs text-slate-400">Seleccionados</div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={toggleAll} 
                      variant="outline" 
                      className="w-full sm:w-auto bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                    >
                      {filteredPrompts.every(p => selectedPrompts.has(p.id)) 
                        ? 'Deseleccionar todos' 
                        : 'Seleccionar todos'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Prompts List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-base">Prompts Disponibles</CardTitle>
                    <CardDescription className="text-slate-400 text-sm">
                      Toca para seleccionar/deseleccionar
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {filteredPrompts.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay prompts que coincidan con los filtros</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredPrompts.map((prompt) => (
                      <motion.div
                        key={prompt.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedPrompts.has(prompt.id)
                            ? 'border-purple-500 bg-purple-900/20 shadow-lg'
                            : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
                        }`}
                        onClick={() => togglePrompt(prompt.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            checked={selectedPrompts.has(prompt.id)}
                            onChange={() => {}}
                            className="mt-1 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white truncate text-sm sm:text-base">
                                  {prompt.title}
                                </h3>
                                <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                                  {prompt.description || 'Sin descripción'}
                                </p>
                              </div>
                              <div className="flex flex-row sm:flex-col gap-2 sm:items-end">
                                <div className="flex gap-2 flex-wrap">
                                  <Badge variant="secondary" className="text-xs bg-purple-600/20 text-purple-300 border-purple-500/30">
                                    {prompt.category}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                                    {prompt.aiModel}
                                  </Badge>
                                </div>
                                <span className="text-xs text-slate-500">
                                  {new Date(prompt.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            {prompt.tags.length > 0 && (
                              <div className="flex gap-1 mt-3 flex-wrap">
                                {prompt.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                                    {tag}
                                  </Badge>
                                ))}
                                {prompt.tags.length > 3 && (
                                  <span className="text-xs text-slate-500">
                                    +{prompt.tags.length - 3} más
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
