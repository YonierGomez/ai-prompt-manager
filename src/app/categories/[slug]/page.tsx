'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Grid3X3, List, Search, Filter, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PromptCard } from '@/components/prompt-card'
import { SearchAndFilters } from '@/components/search-and-filters'
import Link from 'next/link'

interface Prompt {
  id: string
  title: string
  content: string
  description?: string
  category: string
  tags: string[]
  aiModel: string
  isFavorite: boolean
  usageCount: number
  createdAt: Date
}

interface FilterOptions {
  categories: string[]
  models: string[]
  favorites: boolean
  dateRange: 'all' | 'week' | 'month' | 'year'
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [categorySlug, setCategorySlug] = useState<string>('')
  const [categoryName, setCategoryName] = useState<string>('')
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    models: [],
    favorites: false,
    dateRange: 'all'
  })

  // Resolver params y cargar datos
  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params
      const slug = decodeURIComponent(resolvedParams.slug)
      setCategorySlug(slug)
      
      // Convertir el slug a nombre de categoría
      const decodedName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      setCategoryName(decodedName)
      
      // Cargar prompts de esta categoría
      await fetchCategoryPrompts(decodedName)
    }
    
    loadParams()
  }, [params])

  // Aplicar filtros
  useEffect(() => {
    applyFilters()
  }, [prompts, searchQuery, filters])

  const fetchCategoryPrompts = async (category: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/prompts')
      if (response.ok) {
        const allPrompts = await response.json()
        // Filtrar por categoría (insensible a mayúsculas/minúsculas)
        const categoryPrompts = allPrompts.filter((prompt: any) => 
          prompt.category.toLowerCase() === category.toLowerCase()
        )
        setPrompts(categoryPrompts)
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
      filtered = filtered.filter(prompt => {
        // Los tags vienen procesados como array desde la API
        const tagsToSearch = Array.isArray(prompt.tags) 
          ? prompt.tags.join(',').toLowerCase()
          : String(prompt.tags || '').toLowerCase()
        
        return prompt.title.toLowerCase().includes(query) ||
               prompt.content.toLowerCase().includes(query) ||
               prompt.description?.toLowerCase().includes(query) ||
               tagsToSearch.includes(query) ||
               prompt.aiModel.toLowerCase().includes(query)
      })
    }

    // Filtro de favoritos
    if (filters.favorites) {
      filtered = filtered.filter(prompt => prompt.isFavorite)
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
        setPrompts(prompts.map(prompt => 
          prompt.id === promptId 
            ? { ...prompt, isFavorite: !prompt.isFavorite }
            : prompt
        ))
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const copyPrompt = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // Aquí podrías mostrar una notificación de éxito
    } catch (err) {
      console.error('Error copying prompt:', err)
    }
  }

  const sharePrompt = async (prompt: Prompt) => {
    const shareData = { 
      title: prompt.title, 
      text: prompt.description || `Prompt: ${prompt.title}`, 
      url: `${window.location.origin}/prompts/${prompt.id}` 
    }
    try { 
      if (navigator.share && navigator.canShare(shareData)) { 
        await navigator.share(shareData) 
      } else { 
        await navigator.clipboard.writeText(shareData.url) 
      } 
    } catch (err) { 
      console.error('Error sharing:', err) 
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white">
              <Folder className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {categoryName}
              </h1>
              <p className="text-slate-300">
                Prompts especializados en {categoryName.toLowerCase()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/40 mb-6 sm:mb-8"
      >
        <SearchAndFilters
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
      </motion.section>

      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3"
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Prompts de {categoryName}
          </h2>
          {searchQuery && (
            <p className="text-sm text-slate-400 mt-1">
              Búsqueda: "<span className="text-purple-400">{searchQuery}</span>"
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
              title="Vista en cuadrícula"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-slate-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
              title="Vista en lista"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Lista</span>
            </button>
          </div>
          
          {/* Results Count */}
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300 border border-white/20">
            {filteredPrompts.length} de {prompts.length} prompts
          </div>
        </div>
      </motion.div>

      {/* Prompts Grid/List */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500/20 border-b-blue-500 rounded-full animate-spin animate-reverse"></div>
            </div>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="relative rounded-xl sm:rounded-2xl p-8 sm:p-16 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/40 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 sm:h-10 sm:w-10 text-purple-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">
              No hay prompts en esta categoría
            </h3>
            <p className="text-slate-300 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
              {prompts.length === 0 
                ? `Aún no hay prompts en la categoría "${categoryName}".` 
                : 'Ajusta los filtros para ver más resultados.'}
            </p>
            <Link 
              href="/new" 
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25"
            >
              Crear Primer Prompt
            </Link>
          </div>
        ) : (
          <div className={`gap-4 sm:gap-6 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
              : 'flex flex-col space-y-4'
          }`}>
            {filteredPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <PromptCard
                  prompt={{
                    id: prompt.id,
                    title: prompt.title,
                    content: prompt.content,
                    description: prompt.description,
                    category: prompt.category,
                    tags: Array.isArray(prompt.tags) ? prompt.tags : JSON.parse(prompt.tags || '[]'),
                    aiModel: prompt.aiModel,
                    isFavorite: prompt.isFavorite,
                    usageCount: prompt.usageCount,
                    createdAt: new Date(prompt.createdAt)
                  }}
                  viewMode={viewMode}
                  onShare={() => sharePrompt(prompt)}
                  onToggleFavorite={() => toggleFavorite(prompt.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  )
}
