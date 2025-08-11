'use client'

import { useState, useEffect } from 'react'

export interface Prompt {
  id: string
  title: string
  content: string
  description?: string
  category: string
  tags: string[]
  aiModel: string
  isFavorite: boolean
  isPrivate: boolean
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

export interface UsePromptsOptions {
  search?: string
  category?: string
  favorite?: boolean
  limit?: number
  offset?: number
}

export function usePrompts(options: UsePromptsOptions = {}) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrompts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.search) params.append('search', options.search)
      if (options.category) params.append('category', options.category)
      if (options.favorite) params.append('favorite', 'true')
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.offset) params.append('offset', options.offset.toString())

      const response = await fetch(`/api/prompts?${params}`)
      if (!response.ok) {
        throw new Error('Error al cargar prompts')
      }

      const data = await response.json()
      setPrompts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrompts()
  }, [options.search, options.category, options.favorite, options.limit, options.offset])

  const createPrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptData)
      })

      if (!response.ok) {
        throw new Error('Error al crear prompt')
      }

      const newPrompt = await response.json()
      setPrompts(prev => [newPrompt, ...prev])
      return newPrompt
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al crear prompt')
    }
  }

  const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Error al actualizar prompt')
      }

      const updatedPrompt = await response.json()
      setPrompts(prev => prev.map(p => p.id === id ? updatedPrompt : p))
      return updatedPrompt
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar prompt')
    }
  }

  const deletePrompt = async (id: string) => {
    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar prompt')
      }

      setPrompts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al eliminar prompt')
    }
  }

  const toggleFavorite = async (id: string) => {
    const prompt = prompts.find(p => p.id === id)
    if (prompt) {
      await updatePrompt(id, { isFavorite: !prompt.isFavorite })
    }
  }

  return {
    prompts,
    loading,
    error,
    fetchPrompts,
    createPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite
  }
}

export interface Stats {
  totalPrompts: number
  favoritePrompts: number
  categoriesUsed: number
  totalUsage: number
  categoryBreakdown: Array<{
    category: string
    count: number
  }>
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/stats')
      if (!response.ok) {
        throw new Error('Error al cargar estadísticas')
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, error, fetchStats }
}
