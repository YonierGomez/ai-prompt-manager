'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { ClientIcon } from './ClientIcon'

interface SearchAndFiltersProps {
  onSearch: (query: string) => void
  onFilter: (filters: FilterOptions) => void
  className?: string
}

interface FilterOptions {
  categories: string[]
  models: string[]
  favorites: boolean
  dateRange: 'all' | 'week' | 'month' | 'year'
}

const DATE_RANGES = [
  { value: 'all', label: 'Todos los tiempos' },
  { value: 'week', label: 'Última semana' },
  { value: 'month', label: 'Último mes' },
  { value: 'year', label: 'Último año' }
]

export function SearchAndFilters({ onSearch, onFilter, className }: SearchAndFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    models: [],
    favorites: false,
    dateRange: 'all'
  })

  // Cargar categorías y modelos reales desde la API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/filters')
        if (response.ok) {
          const data = await response.json()
          setAvailableCategories(data.categories || [])
          setAvailableModels(data.models || [])
        } else {
          // Fallback a valores por defecto si falla la API
          setAvailableCategories(['Programación', 'Marketing', 'Escritura', 'Análisis'])
          setAvailableModels(['GPT-4', 'Claude', 'Gemini'])
        }
      } catch (error) {
        console.error('Error fetching filter options:', error)
        // Fallback a valores por defecto
        setAvailableCategories(['Programación', 'Marketing', 'Escritura', 'Análisis'])
        setAvailableModels(['GPT-4', 'Claude', 'Gemini'])
      }
    }

    fetchFilterOptions()
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const toggleArrayFilter = (key: 'categories' | 'models', value: string) => {
    const currentArray = filters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    handleFilterChange(key, newArray)
  }

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      categories: [],
      models: [],
      favorites: false,
      dateRange: 'all'
    }
    setFilters(clearedFilters)
    onFilter(clearedFilters)
  }

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.models.length > 0 || 
                          filters.favorites || 
                          filters.dateRange !== 'all'

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra de búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 z-10 pointer-events-none" />
          <Input
            type="text"
            placeholder="Buscar prompts..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-3 pl-14 sm:pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition-all duration-200 text-sm sm:text-base min-h-[48px]"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 w-full sm:w-auto min-h-[48px] whitespace-nowrap ${
            hasActiveFilters 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-purple-500/25' 
              : 'bg-white/5 backdrop-blur-md border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white'
          }`}
        >
          <ClientIcon Icon={Filter} className="h-4 w-4 flex-shrink-0" />
          <span>Filtros</span>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
          )}
          <ClientIcon Icon={ChevronDown} className={`h-3 w-3 flex-shrink-0 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Panel de filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/40 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Filtros Avanzados</h3>
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <ClientIcon Icon={X} className="h-4 w-4" />
                      Limpiar
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="inline-flex items-center justify-center p-2 rounded-xl font-medium text-sm transition-all duration-200 text-slate-300 hover:bg-white/5 hover:text-white"
                  >
                    <ClientIcon Icon={X} className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Filtro de favoritos y periodo */}
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.favorites}
                        onChange={(e) => handleFilterChange('favorites', e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="text-white font-medium">Solo favoritos ❤️</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">Período de tiempo</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                      className="w-full p-3 border rounded-xl bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition-all duration-200"
                    >
                      {DATE_RANGES.map((range) => (
                        <option key={range.value} value={range.value} className="bg-slate-800">
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filtro de categorías */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Categorías</label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {availableCategories.length > 0 ? availableCategories.map((category: string) => (
                      <button
                        key={category}
                        onClick={() => toggleArrayFilter('categories', category)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                          filters.categories.includes(category)
                            ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-200 border-purple-500/30'
                            : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    )) : (
                      <div className="text-sm text-slate-400 italic">Cargando categorías...</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Filtro de modelos de IA */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Modelos de IA</label>
                <div className="flex flex-wrap gap-2">
                  {availableModels.length > 0 ? availableModels.map((model: string) => (
                    <button
                      key={model}
                      onClick={() => toggleArrayFilter('models', model)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                        filters.models.includes(model)
                          ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-200 border-purple-500/30'
                          : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {model}
                    </button>
                  )) : (
                    <div className="text-sm text-slate-400 italic">Cargando modelos...</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtros activos */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {filters.favorites && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-600/20 text-amber-200 border border-amber-500/30">
              Favoritos ❤️
              <button 
                onClick={() => handleFilterChange('favorites', false)}
                className="ml-1 hover:bg-amber-500/20 rounded-full p-0.5 transition-colors"
              >
                <ClientIcon Icon={X} className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.dateRange !== 'all' && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-200 border border-blue-500/30">
              {DATE_RANGES.find(r => r.value === filters.dateRange)?.label}
              <button 
                onClick={() => handleFilterChange('dateRange', 'all')}
                className="ml-1 hover:bg-blue-500/20 rounded-full p-0.5 transition-colors"
              >
                <ClientIcon Icon={X} className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.categories.map((category) => (
            <div key={category} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-200 border border-purple-500/30">
              {category}
              <button 
                onClick={() => toggleArrayFilter('categories', category)}
                className="ml-1 hover:bg-purple-500/20 rounded-full p-0.5 transition-colors"
              >
                <ClientIcon Icon={X} className="h-3 w-3" />
              </button>
            </div>
          ))}
          {filters.models.map((model) => (
            <div key={model} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-600/20 text-emerald-200 border border-emerald-500/30">
              {model}
              <button 
                onClick={() => toggleArrayFilter('models', model)}
                className="ml-1 hover:bg-emerald-500/20 rounded-full p-0.5 transition-colors"
              >
                <ClientIcon Icon={X} className="h-3 w-3" />
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
