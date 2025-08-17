'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  ArrowLeft,
  PenTool,
  Code,
  BarChart3,
  Palette,
  Zap,
  GraduationCap,
  TrendingUp,
  SearchIcon
} from 'lucide-react'
import Link from 'next/link'
import { DEFAULT_CATEGORIES } from '@/lib/utils'

// Mapeo de iconos
const iconMap = {
  'PenTool': PenTool,
  'Code': Code,
  'BarChart3': BarChart3,
  'Palette': Palette,
  'Zap': Zap,
  'GraduationCap': GraduationCap,
  'TrendingUp': TrendingUp,
  'Search': SearchIcon
}

// Datos simulados de conteo de prompts por categoría
const categoryStats = {
  'Escritura': 45,
  'Programación': 38,
  'Análisis': 22,
  'Creatividad': 31,
  'Productividad': 28,
  'Educación': 19,
  'Marketing': 25,
  'Investigación': 16
}

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCategories, setFilteredCategories] = useState(DEFAULT_CATEGORIES.slice())
  const [prompts, setPrompts] = useState([])
  const [realCategoryStats, setRealCategoryStats] = useState(categoryStats)

  // Cargar prompts reales y calcular estadísticas
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch('/api/prompts')
        if (response.ok) {
          const data = await response.json()
          setPrompts(data)
          
          // Calcular estadísticas reales
          const stats = {}
          data.forEach(prompt => {
            const category = prompt.category
            stats[category] = (stats[category] || 0) + 1
          })
          setRealCategoryStats(stats)
        }
      } catch (error) {
        console.error('Error fetching prompts:', error)
        // Mantener datos simulados si falla
      }
    }
    
    fetchPrompts()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = DEFAULT_CATEGORIES.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCategories([...filtered])
    } else {
      setFilteredCategories([...DEFAULT_CATEGORIES])
    }
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
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
            <h1 className="text-lg font-bold text-white truncate">Categorías</h1>
            <p className="text-xs text-slate-400 truncate">
              {filteredCategories.length} categorías disponibles
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar categorías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </motion.div>

        {/* Stats Overview - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-blue-400">{filteredCategories.length}</div>
              <p className="text-xs text-slate-400">Categorías</p>
            </CardContent>
          </Card>
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-green-400">
                {Object.values(realCategoryStats).reduce((a, b) => a + b, 0)}
              </div>
              <p className="text-xs text-slate-400">Total Prompts</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories Grid - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredCategories.length === 0 ? (
            <Card className="text-center py-12 border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardContent>
                <Search className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">No se encontraron categorías</h3>
                <p className="text-slate-400">
                  Intenta con términos de búsqueda diferentes.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCategories.map((category, index) => {
                const IconComponent = iconMap[category.icon as keyof typeof iconMap] || PenTool
                const promptCount = realCategoryStats[category.name as keyof typeof realCategoryStats] || 0
                
                return (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link href={`/categories/${category.name.toLowerCase()}`}>
                      <Card className="h-full cursor-pointer group hover:shadow-lg transition-all duration-300 border-slate-700/50 bg-slate-800/50 backdrop-blur-sm hover:border-purple-500/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
                              style={{ backgroundColor: category.color }}
                            >
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                                {category.name}
                              </h3>
                              <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                                {category.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge 
                                  variant="outline" 
                                  className="text-xs border-slate-600 text-slate-300"
                                >
                                  {promptCount} prompts
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Popular Categories - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-base">Más Populares</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Categorías con más prompts
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {[...DEFAULT_CATEGORIES]
                  .sort((a: any, b: any) => (realCategoryStats[b.name as keyof typeof realCategoryStats] || 0) - (realCategoryStats[a.name as keyof typeof realCategoryStats] || 0))
                  .slice(0, 5)
                  .map((category: any, index: number) => {
                    const IconComponent = iconMap[category.icon as keyof typeof iconMap] || PenTool
                    const promptCount = realCategoryStats[category.name as keyof typeof realCategoryStats] || 0
                    const maxCount = Math.max(...Object.values(realCategoryStats))
                    const percentage = maxCount > 0 ? (promptCount / maxCount) * 100 : 0
                    
                    return (
                      <Link key={category.name} href={`/categories/${category.name.toLowerCase()}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                            style={{ backgroundColor: category.color }}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white text-sm truncate">{category.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                                <div 
                                  className="h-1.5 rounded-full transition-all duration-500"
                                  style={{ 
                                    width: `${percentage}%`,
                                    backgroundColor: category.color 
                                  }}
                                />
                              </div>
                              <span className="text-xs text-slate-400 flex-shrink-0">{promptCount}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
