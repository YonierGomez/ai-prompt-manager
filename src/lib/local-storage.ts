// Sistema de almacenamiento local para prompts independientes por dispositivo
import { useState, useEffect } from 'react'

interface LocalPrompt {
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
  difficulty: string
  estimatedTokens?: number
  language: string
  industry?: string
  templateVariables?: Record<string, any>
  version: string
  parentId?: string
  avgRating?: number
  totalRatings: number
  successRate?: number
  author?: string
  source?: string
  license?: string
  createdAt: string
  updatedAt: string
}

interface LocalAnalytics {
  totalPrompts: number
  totalExecutions: number
  favoritePrompts: number
  categoriesUsed: string[]
  lastActivity: string
  dailyUsage: Record<string, number>
  popularCategories: Record<string, number>
  popularModels: Record<string, number>
}

class LocalPromptStorage {
  private readonly PROMPTS_KEY = 'ai-prompt-manager-prompts'
  private readonly ANALYTICS_KEY = 'ai-prompt-manager-analytics'
  private readonly VERSION_KEY = 'ai-prompt-manager-version'
  private readonly CURRENT_VERSION = '1.0.0'

  constructor() {
    this.initializeStorage()
  }

  private initializeStorage() {
    try {
      // Verificar si necesitamos migrar datos
      const currentVersion = localStorage.getItem(this.VERSION_KEY)
      if (!currentVersion) {
        this.initializeDefaultData()
        localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION)
      }
    } catch (error) {
      console.error('Error initializing local storage:', error)
    }
  }

  private initializeDefaultData() {
    const defaultPrompts: LocalPrompt[] = [
      {
        id: this.generateId(),
        title: '🎯 Prompt de Bienvenida',
        content: '¡Bienvenido a tu administrador de prompts personal! Este es tu primer prompt de ejemplo. Puedes editarlo, eliminarlo o crear nuevos prompts completamente privados en tu dispositivo.',
        description: 'Prompt de ejemplo para empezar',
        category: 'General',
        tags: ['bienvenida', 'ejemplo'],
        aiModel: 'GPT-4',
        isFavorite: false,
        isPrivate: true,
        usageCount: 0,
        difficulty: 'Básico',
        language: 'es',
        version: '1.0',
        totalRatings: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    const defaultAnalytics: LocalAnalytics = {
      totalPrompts: 1,
      totalExecutions: 0,
      favoritePrompts: 0,
      categoriesUsed: ['General'],
      lastActivity: new Date().toISOString(),
      dailyUsage: {},
      popularCategories: { 'General': 1 },
      popularModels: { 'GPT-4': 1 }
    }

    this.savePrompts(defaultPrompts)
    this.saveAnalytics(defaultAnalytics)
  }

  private generateId(): string {
    return `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Gestión de Prompts
  getAllPrompts(): LocalPrompt[] {
    try {
      const data = localStorage.getItem(this.PROMPTS_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading prompts:', error)
      return []
    }
  }

  getPromptById(id: string): LocalPrompt | null {
    const prompts = this.getAllPrompts()
    return prompts.find(p => p.id === id) || null
  }

  savePrompt(prompt: Omit<LocalPrompt, 'id' | 'createdAt' | 'updatedAt'>): LocalPrompt {
    const newPrompt: LocalPrompt = {
      ...prompt,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const prompts = this.getAllPrompts()
    prompts.push(newPrompt)
    this.savePrompts(prompts)
    this.updateAnalytics('create', newPrompt)
    
    return newPrompt
  }

  updatePrompt(id: string, updates: Partial<LocalPrompt>): LocalPrompt | null {
    const prompts = this.getAllPrompts()
    const index = prompts.findIndex(p => p.id === id)
    
    if (index === -1) return null

    const updatedPrompt = {
      ...prompts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    prompts[index] = updatedPrompt
    this.savePrompts(prompts)
    this.updateAnalytics('update', updatedPrompt)
    
    return updatedPrompt
  }

  deletePrompt(id: string): boolean {
    const prompts = this.getAllPrompts()
    const filtered = prompts.filter(p => p.id !== id)
    
    if (filtered.length === prompts.length) return false

    this.savePrompts(filtered)
    this.updateAnalytics('delete')
    
    return true
  }

  toggleFavorite(id: string): boolean {
    const prompt = this.getPromptById(id)
    if (!prompt) return false

    const updated = this.updatePrompt(id, { isFavorite: !prompt.isFavorite })
    return !!updated
  }

  incrementUsage(id: string): void {
    const prompt = this.getPromptById(id)
    if (prompt) {
      this.updatePrompt(id, { usageCount: prompt.usageCount + 1 })
      this.updateAnalytics('execute', prompt)
    }
  }

  // Filtros y búsqueda
  searchPrompts(query: string, filters?: {
    category?: string
    aiModel?: string
    tags?: string[]
    favorite?: boolean
    difficulty?: string
  }): LocalPrompt[] {
    let prompts = this.getAllPrompts()

    // Búsqueda por texto
    if (query) {
      const lowerQuery = query.toLowerCase()
      prompts = prompts.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) ||
        p.content.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    }

    // Aplicar filtros
    if (filters) {
      if (filters.category && filters.category !== 'all') {
        prompts = prompts.filter(p => p.category === filters.category)
      }
      if (filters.aiModel && filters.aiModel !== 'all') {
        prompts = prompts.filter(p => p.aiModel === filters.aiModel)
      }
      if (filters.tags && filters.tags.length > 0) {
        prompts = prompts.filter(p => 
          filters.tags!.some(tag => p.tags.includes(tag))
        )
      }
      if (filters.favorite) {
        prompts = prompts.filter(p => p.isFavorite)
      }
      if (filters.difficulty && filters.difficulty !== 'all') {
        prompts = prompts.filter(p => p.difficulty === filters.difficulty)
      }
    }

    return prompts
  }

  getCategories(): string[] {
    const prompts = this.getAllPrompts()
    const categories = new Set(prompts.map(p => p.category))
    return Array.from(categories).sort()
  }

  getTags(): string[] {
    const prompts = this.getAllPrompts()
    const tags = new Set(prompts.flatMap(p => p.tags))
    return Array.from(tags).sort()
  }

  getAiModels(): string[] {
    const prompts = this.getAllPrompts()
    const models = new Set(prompts.map(p => p.aiModel))
    return Array.from(models).sort()
  }

  // Analytics
  getAnalytics(): LocalAnalytics {
    try {
      const data = localStorage.getItem(this.ANALYTICS_KEY)
      return data ? JSON.parse(data) : this.getDefaultAnalytics()
    } catch (error) {
      console.error('Error reading analytics:', error)
      return this.getDefaultAnalytics()
    }
  }

  private getDefaultAnalytics(): LocalAnalytics {
    return {
      totalPrompts: 0,
      totalExecutions: 0,
      favoritePrompts: 0,
      categoriesUsed: [],
      lastActivity: new Date().toISOString(),
      dailyUsage: {},
      popularCategories: {},
      popularModels: {}
    }
  }

  private updateAnalytics(action: 'create' | 'update' | 'delete' | 'execute', prompt?: LocalPrompt): void {
    const analytics = this.getAnalytics()
    const today = new Date().toISOString().split('T')[0]

    analytics.lastActivity = new Date().toISOString()

    switch (action) {
      case 'create':
        analytics.totalPrompts++
        if (prompt) {
          this.updateCategoryCount(analytics.popularCategories, prompt.category, 1)
          this.updateCategoryCount(analytics.popularModels, prompt.aiModel, 1)
          if (!analytics.categoriesUsed.includes(prompt.category)) {
            analytics.categoriesUsed.push(prompt.category)
          }
        }
        break

      case 'delete':
        analytics.totalPrompts = Math.max(0, analytics.totalPrompts - 1)
        break

      case 'execute':
        analytics.totalExecutions++
        analytics.dailyUsage[today] = (analytics.dailyUsage[today] || 0) + 1
        break
    }

    // Recalcular favoritos
    const prompts = this.getAllPrompts()
    analytics.favoritePrompts = prompts.filter(p => p.isFavorite).length

    this.saveAnalytics(analytics)
  }

  private updateCategoryCount(obj: Record<string, number>, key: string, delta: number): void {
    obj[key] = (obj[key] || 0) + delta
    if (obj[key] <= 0) {
      delete obj[key]
    }
  }

  // Utilidades privadas
  private savePrompts(prompts: LocalPrompt[]): void {
    try {
      localStorage.setItem(this.PROMPTS_KEY, JSON.stringify(prompts))
    } catch (error) {
      console.error('Error saving prompts:', error)
    }
  }

  private saveAnalytics(analytics: LocalAnalytics): void {
    try {
      localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(analytics))
    } catch (error) {
      console.error('Error saving analytics:', error)
    }
  }

  // Importar/Exportar
  exportData(): { prompts: LocalPrompt[], analytics: LocalAnalytics, version: string } {
    return {
      prompts: this.getAllPrompts(),
      analytics: this.getAnalytics(),
      version: this.CURRENT_VERSION
    }
  }

  importData(data: { prompts: LocalPrompt[], analytics?: LocalAnalytics }): boolean {
    try {
      // Validar datos
      if (!Array.isArray(data.prompts)) {
        throw new Error('Invalid prompts data')
      }

      // Importar prompts (fusionar con existentes)
      const existingPrompts = this.getAllPrompts()
      const importedIds = new Set(data.prompts.map(p => p.id))
      const nonConflictingExisting = existingPrompts.filter(p => !importedIds.has(p.id))
      
      const allPrompts = [...nonConflictingExisting, ...data.prompts]
      this.savePrompts(allPrompts)

      // Importar analytics si está disponible
      if (data.analytics) {
        this.saveAnalytics(data.analytics)
      }

      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  // Limpiar datos
  clearAllData(): void {
    localStorage.removeItem(this.PROMPTS_KEY)
    localStorage.removeItem(this.ANALYTICS_KEY)
    localStorage.removeItem(this.VERSION_KEY)
    this.initializeDefaultData()
  }
}

// Singleton instance
export const localPromptStorage = new LocalPromptStorage()

// Hook para React
export function useLocalPrompts() {
  const [prompts, setPrompts] = useState<LocalPrompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPrompts(localPromptStorage.getAllPrompts())
    setLoading(false)
  }, [])

  const refreshPrompts = () => {
    setPrompts(localPromptStorage.getAllPrompts())
  }

  return {
    prompts,
    loading,
    refresh: refreshPrompts,
    storage: localPromptStorage
  }
}

export type { LocalPrompt, LocalAnalytics }
