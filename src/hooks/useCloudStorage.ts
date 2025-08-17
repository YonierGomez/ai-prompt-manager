import { useState, useCallback } from 'react'

interface CloudStorageHook {
  exportToCloud: (provider: 'google-drive' | 'icloud') => Promise<boolean>
  importFromCloud: (provider: 'google-drive' | 'icloud') => Promise<boolean>
  isExporting: boolean
  isImporting: boolean
  lastAction: { type: 'export' | 'import', provider: string, success: boolean } | null
}

export function useCloudStorage(): CloudStorageHook {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [lastAction, setLastAction] = useState<{ type: 'export' | 'import', provider: string, success: boolean } | null>(null)

  const exportToCloud = useCallback(async (provider: 'google-drive' | 'icloud'): Promise<boolean> => {
    setIsExporting(true)
    
    try {
      // Obtener datos para exportar
      const { localPromptStorage } = await import('@/lib/local-storage')
      const exportData = localPromptStorage.exportData()
      
      // Crear archivo JSON
      const jsonContent = JSON.stringify(exportData, null, 2)
      const fileName = `ai-prompts-backup-${new Date().toISOString().split('T')[0]}.json`
      
      // Descargar archivo
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setLastAction({ 
        type: 'export', 
        provider: provider === 'google-drive' ? 'Google Drive' : 'iCloud', 
        success: true 
      })
      
      return true
    } catch (error) {
      console.error('Error exporting to cloud:', error)
      setLastAction({ 
        type: 'export', 
        provider: provider === 'google-drive' ? 'Google Drive' : 'iCloud', 
        success: false 
      })
      return false
    } finally {
      setIsExporting(false)
    }
  }, [])

  const importFromCloud = useCallback(async (provider: 'google-drive' | 'icloud'): Promise<boolean> => {
    setIsImporting(true)
    
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          try {
            const text = await file.text()
            const data = JSON.parse(text)
            
            // Validar estructura del archivo
            if (!data.prompts || !Array.isArray(data.prompts)) {
              throw new Error('Invalid backup file format')
            }
            
            // Importar datos
            const { localPromptStorage } = await import('@/lib/local-storage')
            const success = localPromptStorage.importData(data)
            
            setLastAction({ 
              type: 'import', 
              provider: provider === 'google-drive' ? 'Google Drive' : 'iCloud', 
              success 
            })
            
            setIsImporting(false)
            resolve(success)
          } catch (error) {
            console.error('Error parsing backup file:', error)
            setLastAction({ 
              type: 'import', 
              provider: provider === 'google-drive' ? 'Google Drive' : 'iCloud', 
              success: false 
            })
            setIsImporting(false)
            resolve(false)
          }
        } else {
          setIsImporting(false)
          resolve(false)
        }
      }
      input.click()
    })
  }, [])

  return {
    exportToCloud,
    importFromCloud,
    isExporting,
    isImporting,
    lastAction
  }
}

// Hook para obtener estadísticas de almacenamiento
export function useStorageStats() {
  const getStats = useCallback(() => {
    if (typeof window === 'undefined') return null
    
    try {
      const { localPromptStorage } = require('@/lib/local-storage')
      const data = localPromptStorage.exportData()
      const analytics = localPromptStorage.getAnalytics()
      
      return {
        totalPrompts: data.prompts.length,
        totalExecutions: analytics.totalExecutions,
        favoritePrompts: analytics.favoritePrompts,
        version: data.version,
        estimatedSize: Math.round(JSON.stringify(data).length / 1024), // KB
        lastBackupDate: localStorage.getItem('last-backup-date'),
        categories: Array.from(new Set(data.prompts.map((p: any) => p.category))).length,
        aiModels: Array.from(new Set(data.prompts.map((p: any) => p.aiModel))).length
      }
    } catch (error) {
      console.error('Error getting storage stats:', error)
      return null
    }
  }, [])

  return { getStats }
}

// Utilidades para gestión de respaldos
export const cloudStorageUtils = {
  // Validar archivo de respaldo
  validateBackupFile: (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const data = JSON.parse(content)
          
          // Validar estructura básica
          const isValid = data.prompts && 
                         Array.isArray(data.prompts) && 
                         data.version &&
                         typeof data.analytics === 'object'
          
          resolve(isValid)
        } catch {
          resolve(false)
        }
      }
      reader.readAsText(file)
    })
  },

  // Generar nombre de archivo de respaldo
  generateBackupFileName: (prefix = 'ai-prompts-backup'): string => {
    const date = new Date().toISOString().split('T')[0]
    const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-')
    return `${prefix}-${date}-${time}.json`
  },

  // Obtener información de último respaldo
  getLastBackupInfo: (): { date: string | null, daysAgo: number | null } => {
    const lastBackup = localStorage.getItem('last-backup-date')
    if (!lastBackup) return { date: null, daysAgo: null }
    
    const backupDate = new Date(lastBackup)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - backupDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return { date: lastBackup, daysAgo: diffDays }
  },

  // Marcar fecha de último respaldo
  markBackupDate: (): void => {
    localStorage.setItem('last-backup-date', new Date().toISOString())
  }
}
