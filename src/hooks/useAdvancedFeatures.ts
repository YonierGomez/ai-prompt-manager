import { useState } from 'react'
import { Prompt, PromptExecution, PromptRating } from '@prisma/client'

type PromptWithAnalytics = Prompt & {
  executions: PromptExecution[]
  ratings: PromptRating[]
}

export function usePromptAnalytics(promptId?: string) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchAnalytics = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/prompts/${id}/analytics`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const trackExecution = async (execution: {
    promptId: string
    input?: string
    output?: string
    model: string
    tokensUsed?: number
    executionTime?: number
    success?: boolean
    feedback?: string
  }) => {
    try {
      await fetch('/api/executions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(execution)
      })
    } catch (error) {
      console.error('Error tracking execution:', error)
    }
  }

  const submitRating = async (rating: {
    promptId: string
    rating: number
    comment?: string
  }) => {
    try {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rating)
      })
    } catch (error) {
      console.error('Error submitting rating:', error)
    }
  }

  return {
    analytics,
    loading,
    fetchAnalytics,
    trackExecution,
    submitRating
  }
}

export function useTemplates() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/templates')
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTemplate = async (template: any) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      })
      const newTemplate = await response.json()
      setTemplates(prev => [...prev, newTemplate])
      return newTemplate
    } catch (error) {
      console.error('Error creating template:', error)
      throw error
    }
  }

  return {
    templates,
    loading,
    fetchTemplates,
    createTemplate
  }
}

export function useCollections() {
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCollections = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/collections')
      const data = await response.json()
      setCollections(data)
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCollection = async (collection: any) => {
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collection)
      })
      const newCollection = await response.json()
      setCollections(prev => [...prev, newCollection])
      return newCollection
    } catch (error) {
      console.error('Error creating collection:', error)
      throw error
    }
  }

  const updateCollection = async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const updatedCollection = await response.json()
      setCollections(prev => prev.map(c => c.id === id ? updatedCollection : c))
      return updatedCollection
    } catch (error) {
      console.error('Error updating collection:', error)
      throw error
    }
  }

  return {
    collections,
    loading,
    fetchCollections,
    createCollection,
    updateCollection
  }
}

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchWorkflows = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/workflows')
      const data = await response.json()
      setWorkflows(data)
    } catch (error) {
      console.error('Error fetching workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const createWorkflow = async (workflow: any) => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow)
      })
      const newWorkflow = await response.json()
      setWorkflows(prev => [...prev, newWorkflow])
      return newWorkflow
    } catch (error) {
      console.error('Error creating workflow:', error)
      throw error
    }
  }

  const executeWorkflow = async (id: string, inputs: any) => {
    try {
      const response = await fetch(`/api/workflows/${id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs })
      })
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error executing workflow:', error)
      throw error
    }
  }

  return {
    workflows,
    loading,
    fetchWorkflows,
    createWorkflow,
    executeWorkflow
  }
}
