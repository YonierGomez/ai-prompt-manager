'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Star, 
  Eye, 
  Clock,
  ArrowLeft,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface AnalyticsData {
  totalPrompts: number
  totalViews: number
  avgRating: number
  successRate: number
  promptsThisMonth: number
  summary: {
    totalExecutions: number
    avgExecutionsPerPrompt: number
    totalRatings: number
  }
  topCategories: Array<{
    name: string
    count: number
    percentage: number
  }>
  topModels: Array<{
    name: string
    count: number
    percentage: number
  }>
  popularPrompts: Array<{
    id: string
    title: string
    executions: number
    rating: number
  }>
  recentActivity: Array<{
    prompt: string
    date: string
    model?: string
  }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-purple-400 animate-pulse" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Cargando analytics...
          </h3>
          <p className="text-slate-400">
            Preparando las estadísticas
          </p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Error al cargar analytics
          </h3>
          <p className="text-slate-400">
            No se pudieron cargar los datos de analytics
          </p>
        </div>
      </div>
    )
  }

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
            <h1 className="text-lg font-bold text-white truncate">Análisis</h1>
            <p className="text-xs text-slate-400 truncate">
              Estadísticas y métricas
            </p>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-600 text-white"
          >
            <option value="7d">7d</option>
            <option value="30d">30d</option>
            <option value="90d">90d</option>
          </select>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-blue-500/30 bg-blue-900/20 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-300 mb-2">
                    Métricas Reales del Sistema
                  </p>
                  <p className="text-blue-200 leading-relaxed text-xs">
                    Estadísticas basadas en ejecuciones y valoraciones de prompts reales.
                    Los datos se actualizan en tiempo real.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-blue-400">{analytics.totalPrompts}</div>
              <p className="text-xs text-slate-400">Total Prompts</p>
              {analytics.promptsThisMonth > 0 && (
                <p className="text-xs text-green-400">+{analytics.promptsThisMonth} este mes</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-green-400">{analytics.totalViews.toLocaleString()}</div>
              <p className="text-xs text-slate-400">Ejecuciones</p>
              <p className="text-xs text-slate-500">
                {analytics.summary.avgExecutionsPerPrompt} por prompt
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-yellow-400">
                {analytics.avgRating > 0 ? analytics.avgRating.toFixed(1) : '0.0'}
              </div>
              <p className="text-xs text-slate-400">Rating Promedio</p>
              <div className="flex justify-center items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-3 w-3 ${
                      star <= Math.round(analytics.avgRating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-slate-600'
                    }`} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-purple-400">
                {analytics.successRate > 0 ? `${analytics.successRate}%` : '0%'}
              </div>
              <p className="text-xs text-slate-400">Tasa de Éxito</p>
              <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-purple-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.successRate}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Categories and Models */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Top Categories */}
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-sm">Top Categorías</CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Más populares
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {analytics?.topCategories?.slice(0, 4).map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                      <span className="text-sm text-white truncate">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-12 bg-slate-700 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full bg-green-400 transition-all duration-500"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8 text-right">{category.count}</span>
                    </div>
                  </div>
                )) || (
                  <p className="text-xs text-slate-500 text-center py-4">No hay datos disponibles</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Models */}
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-sm">Top Modelos</CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Más utilizados
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {analytics?.topModels?.slice(0, 4).map((model, index) => (
                  <div key={model.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                      <span className="text-sm text-white truncate">{model.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-12 bg-slate-700 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full bg-purple-400 transition-all duration-500"
                          style={{ width: `${model.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8 text-right">{model.count}</span>
                    </div>
                  </div>
                )) || (
                  <p className="text-xs text-slate-500 text-center py-4">No hay datos disponibles</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Popular Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg">
                  <Eye className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-base">Prompts Populares</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Los más ejecutados
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {analytics?.popularPrompts?.slice(0, 5).map((prompt, index) => (
                  <div key={prompt.id} className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm truncate">{prompt.title}</h4>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-blue-400" />
                            <span className="text-xs text-slate-400">{prompt.executions}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400" />
                            <span className="text-xs text-slate-400">{prompt.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 flex-shrink-0">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-slate-500 text-center py-8">
                    No hay prompts populares aún
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-base">Actividad Reciente</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Últimas ejecuciones
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {analytics?.recentActivity?.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{activity.prompt}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">{activity.date}</span>
                        {activity.model && (
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {activity.model}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-slate-500 text-center py-8">
                    No hay actividad reciente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
