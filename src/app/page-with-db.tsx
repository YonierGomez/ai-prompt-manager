'use client'

import React, { useState, useEffect } from 'react'
import { SearchAndFilters } from '@/components/search-and-filters'
import { SharePrompt } from '@/components/share-prompt'
import { Heart, Copy, Share2, Eye, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface FilterOptions {
  categories: string[]
  models: string[]
  favorites: boolean
  dateRange: 'all' | 'week' | 'month' | 'year'
}

interface Prompt {
  id: string
  title: string
  content: string
  description: string
  category: string
  tags: string
  aiModel: string
  isFavorite: boolean
  usageCount: number
  createdAt: string
  difficulty?: string
  author?: string
  industry?: string
}

export default function HomePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    models: [],
    favorites: false,
    dateRange: 'all'
  })
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null)
  const [showShare, setShowShare] = useState(false)

  // Cargar prompts desde la API
  useEffect(() => {
    fetchPrompts()
  }, [])

  // Aplicar filtros cuando cambien
  useEffect(() => {
    applyFilters()
  }, [prompts, searchQuery, filters])

  const fetchPrompts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/prompts')
      if (response.ok) {
        const data = await response.json()
        setPrompts(data)
      } else {
        console.error('Error fetching prompts:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...prompts]

    // Filtro de búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(prompt => 
        prompt.title.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query) ||
        prompt.description?.toLowerCase().includes(query) ||
        prompt.tags.toLowerCase().includes(query) ||
        prompt.category.toLowerCase().includes(query) ||
        prompt.aiModel.toLowerCase().includes(query)
      )
    }

    // Filtro de favoritos
    if (filters.favorites) {
      filtered = filtered.filter(prompt => prompt.isFavorite)
    }

    // Filtro de categorías
    if (filters.categories.length > 0) {
      filtered = filtered.filter(prompt => filters.categories.includes(prompt.category))
    }

    // Filtro de modelos
    if (filters.models.length > 0) {
      filtered = filtered.filter(prompt => filters.models.includes(prompt.aiModel))
    }

    // Filtro de fecha
    if (filters.dateRange !== 'all') {
      const now = new Date()
      filtered = filtered.filter(prompt => {
        const promptDate = new Date(prompt.createdAt)
        const diffDays = (now.getTime() - promptDate.getTime()) / (1000 * 3600 * 24)
        
        switch (filters.dateRange) {
          case 'week': return diffDays <= 7
          case 'month': return diffDays <= 30
          case 'year': return diffDays <= 365
          default: return true
        }
      })
    }

    setFilteredPrompts(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const toggleFavorite = async (promptId: string) => {
    try {
      const response = await fetch(`/api/prompts/${promptId}/favorite`, {
        method: 'POST',
      })
      if (response.ok) {
        // Actualizar el estado local
        setPrompts(prompts.map(prompt => 
          prompt.id === promptId 
            ? { ...prompt, isFavorite: !prompt.isFavorite }
            : prompt
        ))
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Error al cambiar favorito')
    }
  }

  const copyPrompt = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (err) {
      alert('Error al copiar el prompt')
    }
  }

  const sharePrompt = (prompt: Prompt) => {
    const promptForShare = {
      ...prompt,
      tags: prompt.tags.split(',').map(tag => tag.trim())
    }
    setSelectedPrompt(promptForShare)
    setShowShare(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const parseTagsArray = (tagsString: string) => {
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">Cargando tus prompts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-200 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
          ¡Bienvenido a AI Prompt Manager! ✨
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Gestiona, organiza y comparte tus prompts de IA de manera eficiente
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Prompts</h3>
          <p className="text-2xl font-bold text-blue-600">{prompts.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Favoritos</h3>
          <p className="text-2xl font-bold text-red-600">
            {prompts.filter(p => p.isFavorite).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Usos Totales</h3>
          <p className="text-2xl font-bold text-green-600">
            {prompts.reduce((sum, p) => sum + p.usageCount, 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Resultados</h3>
          <p className="text-2xl font-bold text-purple-600">{filteredPrompts.length}</p>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <SearchAndFilters
        onSearch={handleSearch}
        onFilter={handleFilter}
        className="mb-8"
      />

      {/* Botones de acción rápida */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <a href="/new" className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">➕</div>
          <div className="font-medium text-sm">Crear Prompt</div>
        </a>
        
        <a href="/templates" className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">✨</div>
          <div className="font-medium text-sm">Plantillas</div>
        </a>
        
        <a href="/favorites" className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">❤️</div>
          <div className="font-medium text-sm">Favoritos</div>
        </a>
        
        <a href="/import" className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">📥</div>
          <div className="font-medium text-sm">Importar</div>
        </a>
        
        <a href="/export" className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">📤</div>
          <div className="font-medium text-sm">Exportar</div>
        </a>
        
        <a href="/analytics" className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">📊</div>
          <div className="font-medium text-sm">Análisis</div>
        </a>
      </div>

      {/* Lista de prompts */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            Tus Prompts {searchQuery && `(búsqueda: "${searchQuery}")`}
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredPrompts.length} de {prompts.length} prompts
          </div>
        </div>

        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No se encontraron prompts</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {prompts.length === 0 
                ? "¡Crea tu primer prompt para comenzar!"
                : "Intenta ajustar tus filtros de búsqueda o crear un nuevo prompt"
              }
            </p>
            <a 
              href="/new" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ Crear Nuevo Prompt
            </a>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      {prompt.title}
                      {prompt.isFavorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{prompt.category}</Badge>
                      <Badge variant="outline">{prompt.aiModel}</Badge>
                      {prompt.difficulty && (
                        <Badge variant="secondary">{prompt.difficulty}</Badge>
                      )}
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {prompt.usageCount}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(prompt.createdAt)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {prompt.description || (prompt.content.length > 120 
                        ? `${prompt.content.substring(0, 120)}...` 
                        : prompt.content)}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {parseTagsArray(prompt.tags).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFavorite(prompt.id)}
                      className="flex items-center gap-1"
                    >
                      <Heart 
                        className={`h-4 w-4 ${prompt.isFavorite ? 'text-red-500 fill-current' : ''}`} 
                      />
                      {prompt.isFavorite ? 'Quitar' : 'Favorito'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyPrompt(prompt.content)}
                      className="flex items-center gap-1"
                    >
                      <Copy className="h-4 w-4" />
                      Copiar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sharePrompt(prompt)}
                      className="flex items-center gap-1"
                    >
                      <Share2 className="h-4 w-4" />
                      Compartir
                    </Button>
                  </div>
                  <a
                    href={`/prompt/${prompt.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver detalles →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de compartir */}
      {showShare && selectedPrompt && (
        <SharePrompt
          prompt={selectedPrompt}
          onClose={() => {
            setShowShare(false)
            setSelectedPrompt(null)
          }}
        />
      )}
    </div>
  )
}
