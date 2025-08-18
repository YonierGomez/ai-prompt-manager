'use client'

import React, { useState, useEffect } from 'react'
import { SearchAndFilters } from '@/components/search-and-filters'
import { SharePrompt } from '@/components/share-prompt'
import { copyToClipboard, showManualCopyModal } from '@/lib/clipboard'
import { 
  Heart, 
  Copy, 
  Share2, 
  Eye, 
  Calendar, 
  Tag, 
  Plus,
  Sparkles,
  TrendingUp,
  Folder,
  Download,
  Upload,
  BarChart3,
  Zap,
  Star,
  Clock,
  Search,
  Grid3X3,
  List
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PromptCard } from '@/components/prompt-card'
import { motion } from 'framer-motion'

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
  tags: string | string[]
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
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
      filtered = filtered.filter(prompt => {
        const tagsToSearch = Array.isArray(prompt.tags) 
          ? prompt.tags.join(',').toLowerCase() 
          : prompt.tags.toLowerCase()
        
        return prompt.title.toLowerCase().includes(query) ||
               prompt.content.toLowerCase().includes(query) ||
               prompt.description?.toLowerCase().includes(query) ||
               tagsToSearch.includes(query) ||
               prompt.category.toLowerCase().includes(query) ||
               prompt.aiModel.toLowerCase().includes(query)
      })
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
    const result = await copyToClipboard(content)
    
    if (!result.success) {
      // Mostrar modal de copia manual
      showManualCopyModal(content)
    }
  }

  const sharePrompt = (prompt: Prompt) => {
    const promptForShare = {
      ...prompt,
      tags: Array.isArray(prompt.tags) 
        ? prompt.tags 
        : prompt.tags.split(',').map((tag: string) => tag.trim())
    }
    setSelectedPrompt(promptForShare)
    setShowShare(true)
  }

  const quickActions = [
    {
      href: '/new',
      title: 'Crear Prompt',
      description: 'Nuevo prompt personalizado',
      icon: Plus,
      gradient: 'from-purple-500 to-blue-500',
      glow: 'shadow-purple-500/20'
    },
    {
      href: '/templates',
      title: 'Plantillas',
      description: 'Prompts prediseñados',
      icon: Sparkles,
      gradient: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/20'
    },
    {
      href: '/favorites',
      title: 'Favoritos',
      description: 'Tus prompts guardados',
      icon: Heart,
      gradient: 'from-pink-500 to-rose-500',
      glow: 'shadow-pink-500/20'
    },
    {
      href: '/analytics',
      title: 'Análisis',
      description: 'Estadísticas de uso',
      icon: BarChart3,
      gradient: 'from-indigo-500 to-purple-500',
      glow: 'shadow-indigo-500/20'
    },
    {
      href: '/import',
      title: 'Importar',
      description: 'Subir prompts existentes',
      icon: Upload,
      gradient: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/20'
    },
    {
      href: '/export',
      title: 'Exportar',
      description: 'Descargar colección',
      icon: Download,
      gradient: 'from-amber-500 to-orange-500',
      glow: 'shadow-amber-500/20'
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6 sm:py-12 mb-6 sm:mb-12"
      >
        <div className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
          Tu Studio de Prompts IA
        </div>
        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto px-4">
          Crea, organiza y optimiza prompts para modelos de inteligencia artificial. 
          Potencia tu productividad con nuestra biblioteca inteligente.
        </p>
      </motion.section>

      {/* Stats Cards */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
      >
        <div className="relative rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/40 text-center">
          <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-purple-600/20 text-purple-200 border border-purple-500/30 mb-2">
            <Star className="h-3 w-3 mr-1" />
            Total
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-100">{prompts.length}</div>
        </div>
        <div className="relative rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/40 text-center">
          <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-amber-600/20 text-amber-200 border border-amber-500/30 mb-2">
            <Heart className="h-3 w-3 mr-1" />
            Favoritos
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400">{prompts.filter(p => p.isFavorite).length}</div>
        </div>
        <div className="relative rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/40 text-center">
          <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-emerald-600/20 text-emerald-200 border border-emerald-500/30 mb-2">
            <Zap className="h-3 w-3 mr-1" />
            Usos
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400">{prompts.reduce((s,p)=>s+p.usageCount,0)}</div>
        </div>
        <div className="relative rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/40 text-center">
          <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-purple-600/20 text-purple-200 border border-purple-500/30 mb-2">
            <TrendingUp className="h-3 w-3 mr-1" />
            Filtrados
          </div>
          <div className="text-xl sm:text-2xl font-bold text-purple-400">{filteredPrompts.length}</div>
        </div>
      </motion.section>

      {/* Search and Filters */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-xl sm:rounded-2xl p-3 sm:p-6 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/40 mb-4 sm:mb-8"
      >
        <SearchAndFilters
          onSearch={handleSearch}
          onFilter={handleFilter}
          className=""
        />
      </motion.section>

      {/* Quick Actions */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 sm:mb-12"
      >
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-4 sm:mb-6 px-2 sm:px-0">Acciones Rápidas</h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((action, index) => (
            <motion.a
              key={action.href}
              href={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group relative rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/40 transition-all duration-300 hover:scale-105 text-center overflow-hidden"
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${action.gradient} ${action.glow} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="font-semibold text-slate-100 mb-1 text-sm sm:text-base">{action.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-tight">{action.description}</p>
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* Prompts Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="py-4 sm:py-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 px-2 sm:px-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Tu Colección</h2>
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
        </div>

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
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">Nada por aquí</h3>
            <p className="text-slate-300 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
              {prompts.length === 0 
                ? 'Crea tu primer prompt para comenzar tu colección.' 
                : 'Ajusta los filtros o crea un nuevo prompt.'}
            </p>
            <a 
              href="/new" 
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25"
            >
              <Plus className="h-4 w-4" />
              Crear Primer Prompt
            </a>
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
                    tags: Array.isArray(prompt.tags) ? prompt.tags : prompt.tags.split(',').map(t=>t.trim()),
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

      {showShare && selectedPrompt && (
        <SharePrompt
          prompt={selectedPrompt}
          onClose={() => { setShowShare(false); setSelectedPrompt(null) }}
        />
      )}
    </div>
  )
}
