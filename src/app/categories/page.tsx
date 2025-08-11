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
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Categorías</h1>
            <p className="text-muted-foreground">
              Explora prompts organizados por categorías temáticas
            </p>
          </div>
        </div>
        
        <div className="w-full lg:w-auto lg:min-w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{DEFAULT_CATEGORIES.length}</div>
            <p className="text-xs text-muted-foreground">Categorías Disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {Object.values(categoryStats).reduce((a, b) => a + b, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total de Prompts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {Math.max(...Object.values(categoryStats))}
            </div>
            <p className="text-xs text-muted-foreground">Categoría Más Popular</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {Math.round(Object.values(categoryStats).reduce((a, b) => a + b, 0) / DEFAULT_CATEGORIES.length)}
            </div>
            <p className="text-xs text-muted-foreground">Promedio por Categoría</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredCategories.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron categorías</h3>
              <p className="text-muted-foreground">
                Intenta con términos de búsqueda diferentes.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category, index) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap] || PenTool
              const promptCount = categoryStats[category.name as keyof typeof categoryStats] || 0
              
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Card className="h-full cursor-pointer group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                    <CardHeader className="text-center pb-4">
                      <div 
                        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: category.color }}
                      >
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-center min-h-[3rem] flex items-center justify-center">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className="text-sm font-semibold"
                            style={{ 
                              backgroundColor: category.color + '20', 
                              color: category.color,
                              border: `1px solid ${category.color}40`
                            }}
                          >
                            {promptCount} prompts
                          </Badge>
                        </div>
                        
                        <Button 
                          asChild 
                          className="w-full group-hover:shadow-md transition-shadow"
                          style={{ backgroundColor: category.color }}
                        >
                          <Link href={`/categories/${category.name.toLowerCase()}`}>
                            Explorar
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Popular Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Categorías Más Populares</CardTitle>
            <CardDescription>
              Categorías con mayor cantidad de prompts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...DEFAULT_CATEGORIES]
                .sort((a: any, b: any) => (categoryStats[b.name as keyof typeof categoryStats] || 0) - (categoryStats[a.name as keyof typeof categoryStats] || 0))
                .slice(0, 5)
                .map((category: any, index: number) => {
                  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || PenTool
                  const promptCount = categoryStats[category.name as keyof typeof categoryStats] || 0
                  const maxCount = Math.max(...Object.values(categoryStats))
                  const percentage = (promptCount / maxCount) * 100
                  
                  return (
                    <div key={category.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{category.name}</h4>
                          <p className="text-sm text-muted-foreground">{promptCount} prompts</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: category.color 
                            }}
                          />
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/categories/${category.name.toLowerCase()}`}>
                            Ver
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
