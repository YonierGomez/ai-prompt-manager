'use client'

import React, { useState } from 'react'
import { SearchAndFilters } from '@/components/search-and-filters'
import { SharePrompt } from '@/components/share-prompt'
import { Heart, Copy, Share2, Eye, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Datos de ejemplo
const samplePrompts = [
  {
    id: '1',
    title: 'Análisis de código React avanzado',
    content: 'Actúa como un experto desarrollador React senior. Analiza el siguiente código y proporciona mejoras detalladas...',
    category: 'Programación',
    model: 'GPT-5',
    tags: ['react', 'código', 'revisión', 'optimización'],
    isFavorite: true,
    usageCount: 24,
    createdAt: '2024-12-26'
  },
  {
    id: '2',
    title: 'Estrategia de marketing digital completa',
    content: 'Crea una estrategia de marketing digital integral para una startup de tecnología...',
    category: 'Marketing',
    model: 'Claude Opus 4.1',
    tags: ['marketing', 'estrategia', 'digital', 'startup'],
    isFavorite: false,
    usageCount: 18,
    createdAt: '2024-12-25'
  },
  {
    id: '3',
    title: 'Escritura creativa para storytelling',
    content: 'Ayúdame a crear una historia cautivadora con los siguientes elementos...',
    category: 'Creatividad',
    model: 'Claude Sonnet 4',
    tags: ['escritura', 'storytelling', 'creatividad', 'narrativa'],
    isFavorite: true,
    usageCount: 31,
    createdAt: '2024-12-24'
  },
  {
    id: '4',
    title: 'Análisis de datos con Python',
    content: 'Actúa como un científico de datos experto y analiza el siguiente dataset...',
    category: 'Análisis',
    model: 'Gemini 2.5 Pro',
    tags: ['python', 'datos', 'análisis', 'machine-learning'],
    isFavorite: false,
    usageCount: 12,
    createdAt: '2024-12-23'
  }
]

interface FilterOptions {
  categories: string[]
  models: string[]
  favorites: boolean
  dateRange: 'all' | 'week' | 'month' | 'year'
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    models: [],
    favorites: false,
    dateRange: 'all'
  })
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null)
  const [showShare, setShowShare] = useState(false)

  // Filtrar prompts
  const filteredPrompts = samplePrompts.filter(prompt => {
    // Filtro de búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        prompt.title.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query)) ||
        prompt.category.toLowerCase().includes(query) ||
        prompt.model.toLowerCase().includes(query)
      
      if (!matchesSearch) return false
    }

    // Filtro de favoritos
    if (filters.favorites && !prompt.isFavorite) return false

    // Filtro de categorías
    if (filters.categories.length > 0 && !filters.categories.includes(prompt.category)) return false

    // Filtro de modelos
    if (filters.models.length > 0 && !filters.models.includes(prompt.model)) return false

    // Filtro de fecha (simulado)
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const promptDate = new Date(prompt.createdAt)
      const diffDays = (now.getTime() - promptDate.getTime()) / (1000 * 3600 * 24)
      
      switch (filters.dateRange) {
        case 'week':
          if (diffDays > 7) return false
          break
        case 'month':
          if (diffDays > 30) return false
          break
        case 'year':
          if (diffDays > 365) return false
          break
      }
    }

    return true
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const toggleFavorite = (promptId: string) => {
    // En una implementación real, esto actualizaría la base de datos
    console.log('Toggle favorite:', promptId)
  }

  const copyPrompt = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      alert('¡Prompt copiado al portapapeles! 📋')
    } catch (err) {
      alert('Error al copiar el prompt')
    }
  }

  const sharePrompt = (prompt: any) => {
    setSelectedPrompt(prompt)
    setShowShare(true)
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
          <p className="text-2xl font-bold text-blue-600">{samplePrompts.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Favoritos</h3>
          <p className="text-2xl font-bold text-red-600">
            {samplePrompts.filter(p => p.isFavorite).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Usos Totales</h3>
          <p className="text-2xl font-bold text-green-600">
            {samplePrompts.reduce((sum, p) => sum + p.usageCount, 0)}
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
            {filteredPrompts.length} de {samplePrompts.length} prompts
          </div>
        </div>

        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No se encontraron prompts</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Intenta ajustar tus filtros de búsqueda o crear un nuevo prompt
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
                      <Badge variant="outline">{prompt.model}</Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {prompt.usageCount}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {prompt.createdAt}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {prompt.content.length > 120 
                        ? `${prompt.content.substring(0, 120)}...` 
                        : prompt.content
                      }
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.map((tag, index) => (
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
