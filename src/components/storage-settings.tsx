'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Database, 
  HardDrive, 
  Cloud, 
  Download, 
  Upload, 
  Trash2,
  Shield,
  Smartphone,
  Info
} from 'lucide-react'
import { localPromptStorage } from '@/lib/local-storage'

type StorageMode = 'local' | 'remote' | 'hybrid'

export function StorageSettings() {
  const [storageMode, setStorageMode] = useState<StorageMode>('local')
  const [analytics, setAnalytics] = useState(localPromptStorage.getAnalytics())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Cargar configuración guardada solo en el cliente
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedMode = localStorage.getItem('storage-mode') as StorageMode
      if (savedMode) {
        setStorageMode(savedMode)
      }
      // Actualizar analytics
      setAnalytics(localPromptStorage.getAnalytics())
    }
  }, [])

  const handleStorageModeChange = (mode: StorageMode) => {
    if (typeof window === 'undefined') return
    
    setStorageMode(mode)
    localStorage.setItem('storage-mode', mode)
    
    // Mostrar notificación
    if (mode === 'local') {
      alert('✅ Modo Local activado: Tus prompts son completamente privados y solo están en tu dispositivo')
    } else if (mode === 'remote') {
      alert('🌐 Modo Remoto activado: Los prompts se sincronizan entre dispositivos')
    }
  }

  const exportData = () => {
    const data = localPromptStorage.exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-prompts-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            const success = localPromptStorage.importData(data)
            if (success) {
              alert('✅ Datos importados correctamente')
              setAnalytics(localPromptStorage.getAnalytics())
            } else {
              alert('❌ Error al importar datos')
            }
          } catch (error) {
            alert('❌ Archivo JSON inválido')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const clearAllData = () => {
    if (confirm('⚠️ ¿Estás seguro? Esto eliminará TODOS tus prompts y datos. Esta acción no se puede deshacer.')) {
      localPromptStorage.clearAllData()
      setAnalytics(localPromptStorage.getAnalytics())
      alert('🗑️ Todos los datos han sido eliminados')
    }
  }

  if (!isClient) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-slate-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-4">
          <div className="h-32 bg-slate-700 rounded"></div>
          <div className="h-32 bg-slate-700 rounded"></div>
          <div className="h-24 bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Modo de Almacenamiento */}
      <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
              <Database className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-base">Modo de Almacenamiento</CardTitle>
              <p className="text-slate-400 text-sm">
                Configura dónde se guardan tus prompts
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {/* Local */}
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              storageMode === 'local' 
                ? 'border-purple-500 bg-purple-900/20 shadow-lg' 
                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
            }`}
            onClick={() => handleStorageModeChange('local')}
          >
            <div className="flex items-start gap-3">
              <HardDrive className="h-5 w-5 mt-1 text-purple-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h3 className="font-semibold text-white text-sm sm:text-base">Local (Recomendado)</h3>
                  <div className="flex gap-1.5 flex-wrap">
                    <Badge variant="outline" className="text-xs bg-green-600/20 text-green-300 border-green-500/30">
                      <Shield className="h-3 w-3 mr-1" />
                      Privado
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-600/20 text-blue-300 border-blue-500/30">
                      <Smartphone className="h-3 w-3 mr-1" />
                      Independiente
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Tus prompts se guardan solo en este dispositivo. Máxima privacidad y velocidad.
                </p>
                <div className="mt-2 text-xs text-green-400 leading-relaxed">
                  ✅ Totalmente offline • ✅ Privacidad 100% • ✅ Rápido
                </div>
              </div>
              {storageMode === 'local' && (
                <div className="h-4 w-4 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
          </div>

          {/* Remote */}
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              storageMode === 'remote' 
                ? 'border-yellow-500 bg-yellow-900/20 shadow-lg' 
                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
            }`}
            onClick={() => handleStorageModeChange('remote')}
          >
            <div className="flex items-start gap-3">
              <Cloud className="h-5 w-5 mt-1 text-yellow-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h3 className="font-semibold text-white text-sm sm:text-base">Remoto (Base de Datos)</h3>
                  <Badge variant="outline" className="text-xs bg-yellow-600/20 text-yellow-300 border-yellow-500/30 w-fit">
                    Compartido
                  </Badge>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Los prompts se guardan en el servidor. Compartido entre todos los usuarios.
                </p>
                <div className="mt-2 text-xs text-yellow-400">
                  ⚠️ Prompts visibles para otros usuarios
                </div>
              </div>
              {storageMode === 'remote' && (
                <div className="h-4 w-4 rounded-full bg-yellow-600 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-300 mb-2">
                  Recomendación: Usar Modo Local
                </p>
                <p className="text-blue-200 leading-relaxed">
                  Para máxima privacidad, cada dispositivo debería tener sus propios prompts.
                  Usa exportar/importar para transferir entre dispositivos.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Locales */}
      {storageMode === 'local' && (
        <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                <HardDrive className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-base">Estadísticas de este Dispositivo</CardTitle>
                <p className="text-slate-400 text-sm">
                  Datos almacenados localmente
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">{analytics.totalPrompts}</div>
                <div className="text-xs sm:text-sm text-slate-400">Prompts</div>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-xl sm:text-2xl font-bold text-green-400">{analytics.totalExecutions}</div>
                <div className="text-xs sm:text-sm text-slate-400">Ejecuciones</div>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">{analytics.favoritePrompts}</div>
                <div className="text-xs sm:text-sm text-slate-400">Favoritos</div>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-xl sm:text-2xl font-bold text-purple-400">{analytics.categoriesUsed.length}</div>
                <div className="text-xs sm:text-sm text-slate-400">Categorías</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gestión de Datos */}
      <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg">
              <Database className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-base">Gestión de Datos</CardTitle>
              <p className="text-slate-400 text-sm">
                Exportar, importar y administrar datos
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Button
              onClick={exportData}
              variant="outline"
              className="flex items-center gap-2 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 h-12"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm">Exportar</span>
            </Button>
            
            <Button
              onClick={importData}
              variant="outline"
              className="flex items-center gap-2 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 h-12"
            >
              <Upload className="h-4 w-4" />
              <span className="text-sm">Importar</span>
            </Button>
            
            <Button
              onClick={clearAllData}
              variant="destructive"
              className="flex items-center gap-2 h-12"
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm">Eliminar Todo</span>
            </Button>
          </div>
          
          <div className="bg-slate-700/30 border border-slate-600 p-4 rounded-lg">
            <div className="text-sm text-slate-300 space-y-2">
              <p><strong className="text-blue-400">Exportar:</strong> Descarga backup de todos tus prompts</p>
              <p><strong className="text-green-400">Importar:</strong> Restaura prompts desde archivo de backup</p>
              <p><strong className="text-red-400">Eliminar:</strong> Borra todos los datos de este dispositivo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
