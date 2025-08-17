'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal,
  Calendar,
  Tag,
  Cpu
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AI_MODELS } from '@/lib/utils'

interface FilterState {
  search: string
  category: string
  aiModel: string
  tags: string[]
  favorite: boolean
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year'
  sortBy: 'recent' | 'title' | 'usage' | 'favorite'
  sortOrder: 'asc' | 'desc'
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  availableCategories: string[]
  availableTags: string[]
}

export function AdvancedFilters({ 
  onFiltersChange, 
  availableCategories, 
  availableTags 
}: AdvancedFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    aiModel: 'all',
    tags: [],
    favorite: false,
    dateRange: 'all',
    sortBy: 'recent',
    sortOrder: 'desc'
  })

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const updateFilter = <K extends keyof FilterState>(
    key: K, 
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      aiModel: 'all',
      tags: [],
      favorite: false,
      dateRange: 'all',
      sortBy: 'recent',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = () => {
    return filters.search || 
           filters.category !== 'all' || 
           filters.aiModel !== 'all' || 
           filters.tags.length > 0 || 
           filters.favorite || 
           filters.dateRange !== 'all' ||
           filters.sortBy !== 'recent'
  }

  return (
    <div className="space-y-4">
      {/* Quick Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar prompts..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={showAdvanced ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                !
              </Badge>
            )}
          </Button>
          
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2"
        >
          {filters.category !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.category}
              <button onClick={() => updateFilter('category', 'all')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.aiModel !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              {AI_MODELS.find(m => m.value === filters.aiModel)?.label || filters.aiModel}
              <button onClick={() => updateFilter('aiModel', 'all')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.favorite && (
            <Badge variant="secondary" className="flex items-center gap-1">
              ❤️ Favoritos
              <button onClick={() => updateFilter('favorite', false)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {tag}
              <button onClick={() => toggleTag(tag)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </motion.div>
      )}

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros Avanzados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">
                      Categoría
                    </Label>
                    <Select 
                      value={filters.category} 
                      onValueChange={(value) => updateFilter('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Todas las categorías" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {availableCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="aiModel" className="text-sm font-medium">
                      Modelo de IA
                    </Label>
                    <Select 
                      value={filters.aiModel} 
                      onValueChange={(value) => updateFilter('aiModel', value)}
                    >
                      <SelectTrigger id="aiModel">
                        <SelectValue placeholder="Todos los modelos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los modelos</SelectItem>
                        {AI_MODELS.map(model => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dateRange" className="text-sm font-medium">
                      Fecha de creación
                    </Label>
                    <Select 
                      value={filters.dateRange} 
                      onValueChange={(value) => updateFilter('dateRange', value as FilterState['dateRange'])}
                    >
                      <SelectTrigger id="dateRange">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las fechas</SelectItem>
                        <SelectItem value="today">Hoy</SelectItem>
                        <SelectItem value="week">Esta semana</SelectItem>
                        <SelectItem value="month">Este mes</SelectItem>
                        <SelectItem value="year">Este año</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sortBy" className="text-sm font-medium">
                      Ordenar por
                    </Label>
                    <Select 
                      value={filters.sortBy} 
                      onValueChange={(value) => updateFilter('sortBy', value as FilterState['sortBy'])}
                    >
                      <SelectTrigger id="sortBy">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Más recientes</SelectItem>
                        <SelectItem value="title">Título</SelectItem>
                        <SelectItem value="usage">Más usados</SelectItem>
                        <SelectItem value="favorite">Favoritos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sortOrder" className="text-sm font-medium">
                      Orden
                    </Label>
                    <Select 
                      value={filters.sortOrder} 
                      onValueChange={(value) => updateFilter('sortOrder', value as FilterState['sortOrder'])}
                    >
                      <SelectTrigger id="sortOrder">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Descendente</SelectItem>
                        <SelectItem value="asc">Ascendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags Filter */}
                {availableTags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Etiquetas
                    </Label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {availableTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            filters.tags.includes(tag)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:bg-muted'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Options */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="favorite"
                      checked={filters.favorite}
                      onCheckedChange={(checked) => updateFilter('favorite', !!checked)}
                    />
                    <Label htmlFor="favorite" className="text-sm">
                      Solo favoritos
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
