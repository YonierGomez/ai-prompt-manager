'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Heart,
  Search, 
  ArrowLeft,
  Star,
  Grid3X3,
  List,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { PromptCard } from '@/components/prompt-card'
import type { Prompt } from '@/hooks/usePrompts'

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavoritePrompts()
  }, [])

  useEffect(() => {
    // Filter prompts based on search query
    if (searchQuery.trim()) {
      const filtered = favoritePrompts.filter(prompt =>
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prompt.description && prompt.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredPrompts(filtered)
    } else {
      setFilteredPrompts(favoritePrompts)
    }
  }, [searchQuery, favoritePrompts])

  const fetchFavoritePrompts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/prompts?favorites=true')
      if (response.ok) {
        const data = await response.json()
        setFavoritePrompts(data)
        setFilteredPrompts(data)
      }
    } catch (error) {
      console.error('Error fetching favorite prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Cargando favoritos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <motion.header initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex items-start gap-5">
            <Link href="/" className="neo-action-btn h-11 px-5 text-xs flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Volver
            </Link>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-rose-300 via-amber-200 to-yellow-200 bg-clip-text text-transparent flex items-center gap-3">
                <Heart className="h-9 w-9 text-rose-400" /> Favoritos
              </h1>
              <p className="mt-2 text-sm text-white/50 max-w-xl">Tus prompts marcados para acceso rápido y reutilización. Gestiona y filtra para encontrar la inspiración perfecta al instante.</p>
            </div>
          </div>
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Buscar en favoritos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-xl bg-white/5 border-white/10 text-sm text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1 h-12">
              <button
                onClick={() => setViewMode('grid')}
                className={`neo-action-btn h-10 px-4 text-xs ${viewMode==='grid' ? 'neo-action-btn-primary' : 'bg-transparent border-transparent hover:bg-white/10'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`neo-action-btn h-10 px-4 text-xs ${viewMode==='list' ? 'neo-action-btn-primary' : 'bg-transparent border-transparent hover:bg-white/10'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.section initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: .05 }}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="neo-card p-5">
            <p className="text-[11px] font-medium text-white/40">Total favoritos</p>
            <p className="mt-2 text-3xl font-semibold text-white/90 flex items-center gap-2">
              {favoritePrompts.length}
              <Heart className="h-5 w-5 text-rose-400" />
            </p>
          </div>
          <div className="neo-card p-5">
            <p className="text-[11px] font-medium text-white/40">Más usado</p>
            <p className="mt-2 text-3xl font-semibold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
              {favoritePrompts.length > 0 ? Math.max(...favoritePrompts.map((p: Prompt) => p.usageCount)) : 0}
            </p>
          </div>
          <div className="neo-card p-5">
            <p className="text-[11px] font-medium text-white/40">Categorías</p>
            <p className="mt-2 text-3xl font-semibold text-sky-300">
              {new Set(favoritePrompts.map((p: Prompt) => p.category)).size}
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: .1 }}>
        {filteredPrompts.length === 0 ? (
          <div className="neo-card p-14 text-center">
            <Heart className="mx-auto h-12 w-12 text-white/25 mb-6" />
            <h3 className="text-xl font-semibold text-white/80 mb-3">Sin favoritos aún</h3>
            <p className="text-sm text-white/45 mb-6 max-w-md mx-auto">Marca prompts como favoritos para encontrarlos rápidamente. Empieza explorando la biblioteca.</p>
            <Link href="/" className="neo-action-btn neo-action-btn-primary text-xs">Explorar prompts</Link>
          </div>
        ) : (
          <div className={viewMode==='grid' ? 'neo-grid-cards' : 'flex flex-col gap-6'}>
            {filteredPrompts.map((prompt: Prompt, index: number) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay: 0.03 * index }}
                className={viewMode === 'grid' ? 'h-fit' : ''}
              >
                <PromptCard prompt={prompt} viewMode={viewMode} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  )
}
