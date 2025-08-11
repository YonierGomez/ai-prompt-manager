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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando prompts...</p>
        </div>
      </div>
    )
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
              Exportar Prompts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Selecciona y exporta tus prompts en formato JSON
            </p>
          </motion.div>
        </div>

        {/* Success Message */}
        {exportSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                ¡Prompts exportados exitosamente! El archivo se ha descargado.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros y Selección
              </CardTitle>
              <CardDescription>
                Filtra y selecciona los prompts que deseas exportar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoría</label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
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
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Modelo de IA</label>
                  <Select value={filterModel} onValueChange={setFilterModel}>
                    <SelectTrigger>
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

                <div className="flex items-end">
                  <Button 
                    onClick={toggleAll} 
                    variant="outline" 
                    className="w-full"
                  >
                    {filteredPrompts.every(p => selectedPrompts.has(p.id)) 
                      ? 'Deseleccionar todos' 
                      : 'Seleccionar todos'}
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Total: {prompts.length} prompts</span>
                  <span>Filtrados: {filteredPrompts.length}</span>
                  <span>Seleccionados: {selectedPrompts.size}</span>
                </div>
                
                <Button 
                  onClick={exportPrompts}
                  disabled={selectedPrompts.size === 0 || isExporting}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? 'Exportando...' : `Exportar ${selectedPrompts.size} prompts`}
                </Button>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Prompts Disponibles
              </CardTitle>
              <CardDescription>
                Haz clic en los prompts para seleccionar/deseleccionar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPrompts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => togglePrompt(prompt.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={selectedPrompts.has(prompt.id)}
                          onChange={() => {}} // Manejado por el onClick del div
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                {prompt.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {prompt.description || 'Sin descripción'}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              <div className="flex gap-2 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                  {prompt.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {prompt.aiModel}
                                </Badge>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(prompt.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          {prompt.tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {prompt.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {prompt.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
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
  )
}
