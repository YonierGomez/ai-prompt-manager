// Adaptador unificado para almacenamiento local y remoto
import { localPromptStorage, LocalPrompt } from './local-storage'

type StorageMode = 'local' | 'remote' | 'hybrid'

interface Prompt {
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
  createdAt: Date | string
  updatedAt: Date | string
}

class UnifiedPromptStorage {
  private getStorageMode(): StorageMode {
    if (typeof window === 'undefined') return 'local'
    return (localStorage.getItem('storage-mode') as StorageMode) || 'local'
  }

  private convertLocalToPrompt(localPrompt: LocalPrompt): Prompt {
    return {
      ...localPrompt,
      createdAt: new Date(localPrompt.createdAt),
      updatedAt: new Date(localPrompt.updatedAt)
    }
  }

  private convertPromptToLocal(prompt: Prompt): LocalPrompt {
    return {
      ...prompt,
      createdAt: typeof prompt.createdAt === 'string' ? prompt.createdAt : prompt.createdAt.toISOString(),
      updatedAt: typeof prompt.updatedAt === 'string' ? prompt.updatedAt : prompt.updatedAt.toISOString()
    }
  }

  async getAllPrompts(): Promise<Prompt[]> {
    const mode = this.getStorageMode()
    
    if (mode === 'local') {
      const localPrompts = localPromptStorage.getAllPrompts()
      return localPrompts.map(this.convertLocalToPrompt)
    } else {
      // Usar API remota
      try {
        const response = await fetch('/api/prompts')
        if (!response.ok) throw new Error('Failed to fetch prompts')
        const prompts = await response.json()
        return prompts.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags
        }))
      } catch (error) {
        console.error('Error fetching remote prompts:', error)
        // Fallback to local storage
        const localPrompts = localPromptStorage.getAllPrompts()
        return localPrompts.map(this.convertLocalToPrompt)
      }
    }
  }

  async getPromptById(id: string): Promise<Prompt | null> {
    const mode = this.getStorageMode()
    
    if (mode === 'local') {
      const localPrompt = localPromptStorage.getPromptById(id)
      return localPrompt ? this.convertLocalToPrompt(localPrompt) : null
    } else {
      try {
        const response = await fetch(`/api/prompts/${id}`)
        if (!response.ok) return null
        const prompt = await response.json()
        return {
          ...prompt,
          createdAt: new Date(prompt.createdAt),
          updatedAt: new Date(prompt.updatedAt),
          tags: typeof prompt.tags === 'string' ? JSON.parse(prompt.tags) : prompt.tags
        }
      } catch (error) {
        console.error('Error fetching remote prompt:', error)
        const localPrompt = localPromptStorage.getPromptById(id)
        return localPrompt ? this.convertLocalToPrompt(localPrompt) : null
      }
    }
  }

  async savePrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prompt> {
    const mode = this.getStorageMode()
    
    if (mode === 'local') {
      const localPromptData: Omit<LocalPrompt, 'id' | 'createdAt' | 'updatedAt'> = {
        title: prompt.title,
        content: prompt.content,
        description: prompt.description,
        category: prompt.category,
        tags: prompt.tags,
        aiModel: prompt.aiModel,
        isFavorite: prompt.isFavorite,
        isPrivate: prompt.isPrivate,
        usageCount: prompt.usageCount,
        difficulty: prompt.difficulty,
        estimatedTokens: prompt.estimatedTokens,
        language: prompt.language,
        industry: prompt.industry,
        templateVariables: prompt.templateVariables,
        version: prompt.version,
        parentId: prompt.parentId,
        avgRating: prompt.avgRating,
        totalRatings: prompt.totalRatings,
        successRate: prompt.successRate,
        author: prompt.author,
        source: prompt.source,
        license: prompt.license
      }
      const localPrompt = localPromptStorage.savePrompt(localPromptData)
      return this.convertLocalToPrompt(localPrompt)
    } else {
      try {
        const response = await fetch('/api/prompts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...prompt,
            tags: JSON.stringify(prompt.tags)
          })
        })
        
        if (!response.ok) throw new Error('Failed to save prompt')
        const savedPrompt = await response.json()
        return {
          ...savedPrompt,
          createdAt: new Date(savedPrompt.createdAt),
          updatedAt: new Date(savedPrompt.updatedAt),
          tags: typeof savedPrompt.tags === 'string' ? JSON.parse(savedPrompt.tags) : savedPrompt.tags
        }
      } catch (error) {
        console.error('Error saving remote prompt:', error)
        // Fallback to local storage
        const localPromptData: Omit<LocalPrompt, 'id' | 'createdAt' | 'updatedAt'> = {
          title: prompt.title,
          content: prompt.content,
          description: prompt.description,
          category: prompt.category,
          tags: prompt.tags,
          aiModel: prompt.aiModel,
          isFavorite: prompt.isFavorite,
          isPrivate: prompt.isPrivate,
          usageCount: prompt.usageCount,
          difficulty: prompt.difficulty,
          estimatedTokens: prompt.estimatedTokens,
          language: prompt.language,
          industry: prompt.industry,
          templateVariables: prompt.templateVariables,
          version: prompt.version,
          parentId: prompt.parentId,
          avgRating: prompt.avgRating,
          totalRatings: prompt.totalRatings,
          successRate: prompt.successRate,
          author: prompt.author,
          source: prompt.source,
          license: prompt.license
        }
        const localPrompt = localPromptStorage.savePrompt(localPromptData)
        return this.convertLocalToPrompt(localPrompt)
      }
    }
  }

  async updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt | null> {
    const mode = this.getStorageMode()
    
    if (mode === 'local') {
      const updated = localPromptStorage.updatePrompt(id, this.convertPromptToLocal(updates as Prompt))
      return updated ? this.convertLocalToPrompt(updated) : null
    } else {
      try {
        const response = await fetch(`/api/prompts/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...updates,
            tags: updates.tags ? JSON.stringify(updates.tags) : undefined
          })
        })
        
        if (!response.ok) throw new Error('Failed to update prompt')
        const updatedPrompt = await response.json()
        return {
          ...updatedPrompt,
          createdAt: new Date(updatedPrompt.createdAt),
          updatedAt: new Date(updatedPrompt.updatedAt),
          tags: typeof updatedPrompt.tags === 'string' ? JSON.parse(updatedPrompt.tags) : updatedPrompt.tags
        }
      } catch (error) {
        console.error('Error updating remote prompt:', error)
        const updated = localPromptStorage.updatePrompt(id, this.convertPromptToLocal(updates as Prompt))
        return updated ? this.convertLocalToPrompt(updated) : null
      }
    }
  }

  async deletePrompt(id: string): Promise<boolean> {
    const mode = this.getStorageMode()
    
    if (mode === 'local') {
      return localPromptStorage.deletePrompt(id)
    } else {
      try {
        const response = await fetch(`/api/prompts/${id}`, {
          method: 'DELETE'
        })
        return response.ok
      } catch (error) {
        console.error('Error deleting remote prompt:', error)
        return localPromptStorage.deletePrompt(id)
      }
    }
  }

  async toggleFavorite(id: string): Promise<boolean> {
    const mode = this.getStorageMode()
    
    if (mode === 'local') {
      return localPromptStorage.toggleFavorite(id)
    } else {
      try {
        const response = await fetch(`/api/prompts/${id}/favorite`, {
          method: 'POST'
        })
        return response.ok
      } catch (error) {
        console.error('Error toggling favorite:', error)
        return localPromptStorage.toggleFavorite(id)
      }
    }
  }

  async incrementUsage(id: string): Promise<void> {
    const mode = this.getStorageMode()
    
    if (mode === 'local') {
      localPromptStorage.incrementUsage(id)
    } else {
      try {
        await fetch(`/api/prompts/${id}/execute`, {
          method: 'POST'
        })
      } catch (error) {
        console.error('Error incrementing usage:', error)
        localPromptStorage.incrementUsage(id)
      }
    }
  }

  async searchPrompts(query: string, filters?: {
    category?: string
    aiModel?: string
    tags?: string[]
    favorite?: boolean
    difficulty?: string
  }): Promise<Prompt[]> {
    const mode = this.getStorageMode()
    
    if (mode === 'local') {
      const results = localPromptStorage.searchPrompts(query, filters)
      return results.map(this.convertLocalToPrompt)
    } else {
      try {
        const searchParams = new URLSearchParams()
        if (query) searchParams.append('search', query)
        if (filters?.category && filters.category !== 'all') searchParams.append('category', filters.category)
        if (filters?.aiModel && filters.aiModel !== 'all') searchParams.append('aiModel', filters.aiModel)
        if (filters?.favorite) searchParams.append('favorite', 'true')
        if (filters?.difficulty && filters.difficulty !== 'all') searchParams.append('difficulty', filters.difficulty)
        if (filters?.tags && filters.tags.length > 0) {
          filters.tags.forEach(tag => searchParams.append('tags', tag))
        }
        
        const response = await fetch(`/api/prompts?${searchParams}`)
        if (!response.ok) throw new Error('Failed to search prompts')
        const prompts = await response.json()
        return prompts.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags
        }))
      } catch (error) {
        console.error('Error searching remote prompts:', error)
        const results = localPromptStorage.searchPrompts(query, filters)
        return results.map(this.convertLocalToPrompt)
      }
    }
  }

  async getCategories(): Promise<string[]> {
    const mode = this.getStorageMode()
    
    if (mode === 'local') {
      return localPromptStorage.getCategories()
    } else {
      try {
        const response = await fetch('/api/filters')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        return data.categories || []
      } catch (error) {
        console.error('Error fetching remote categories:', error)
        return localPromptStorage.getCategories()
      }
    }
  }

  async getTags(): Promise<string[]> {
    const mode = this.getStorageMode()
    
    if (mode === 'local') {
      return localPromptStorage.getTags()
    } else {
      try {
        const response = await fetch('/api/filters')
        if (!response.ok) throw new Error('Failed to fetch tags')
        const data = await response.json()
        return data.tags || []
      } catch (error) {
        console.error('Error fetching remote tags:', error)
        return localPromptStorage.getTags()
      }
    }
  }

  async getAiModels(): Promise<string[]> {
    const mode = this.getStorageMode()
    
    if (mode === 'local') {
      return localPromptStorage.getAiModels()
    } else {
      try {
        const response = await fetch('/api/filters')
        if (!response.ok) throw new Error('Failed to fetch models')
        const data = await response.json()
        return data.aiModels || []
      } catch (error) {
        console.error('Error fetching remote models:', error)
        return localPromptStorage.getAiModels()
      }
    }
  }

  getStorageInfo(): { mode: StorageMode, isLocal: boolean, isRemote: boolean } {
    const mode = this.getStorageMode()
    return {
      mode,
      isLocal: mode === 'local',
      isRemote: mode === 'remote'
    }
  }
}

export const unifiedPromptStorage = new UnifiedPromptStorage()
export type { Prompt, StorageMode }
