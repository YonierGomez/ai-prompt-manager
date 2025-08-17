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
    // Cargar configuración guardada
    const savedMode = localStorage.getItem('storage-mode') as StorageMode
    if (savedMode) {
      setStorageMode(savedMode)
    }
  }, [])

  const handleStorageModeChange = (mode: StorageMode) => {
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
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configuración de Almacenamiento</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configura cómo y dónde se guardan tus prompts
        </p>
      </div>

      {/* Modo de Almacenamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Modo de Almacenamiento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {/* Local */}
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                storageMode === 'local' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleStorageModeChange('local')}
            >
              <div className="flex items-start gap-3">
                <HardDrive className="h-5 w-5 mt-1 text-blue-600" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">Local (Recomendado)</h3>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Privado
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Smartphone className="h-3 w-3 mr-1" />
                      Independiente
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tus prompts se guardan solo en este dispositivo. Máxima privacidad y velocidad.
                    Cada dispositivo tiene sus propios prompts.
                  </p>
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    ✅ Totalmente offline • ✅ Privacidad 100% • ✅ Sincronización instantánea
                  </div>
                </div>
                {storageMode === 'local' && (
                  <div className="h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Remote */}
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                storageMode === 'remote' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleStorageModeChange('remote')}
            >
              <div className="flex items-start gap-3">
                <Cloud className="h-5 w-5 mt-1 text-purple-600" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">Remoto (Base de Datos)</h3>
                    <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                      Compartido
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Los prompts se guardan en la base de datos del servidor. 
                    Todos los dispositivos comparten los mismos prompts.
                  </p>
                  <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                    ⚠️ Prompts compartidos entre todos los usuarios
                  </div>
                </div>
                {storageMode === 'remote' && (
                  <div className="h-4 w-4 rounded-full bg-purple-600 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Recomendación: Usar Modo Local
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  Para máxima privacidad y rendimiento, cada dispositivo debería tener sus propios prompts.
                  Puedes usar la función de exportar/importar para transferir prompts entre dispositivos.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Locales */}
      {storageMode === 'local' && (
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de este Dispositivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analytics.totalPrompts}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Prompts</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{analytics.totalExecutions}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ejecuciones</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{analytics.favoritePrompts}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Favoritos</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{analytics.categoriesUsed.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categorías</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gestión de Datos */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              onClick={exportData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar Datos
            </Button>
            
            <Button
              onClick={importData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Importar Datos
            </Button>
            
            <Button
              onClick={clearAllData}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar Todo
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>• <strong>Exportar:</strong> Descarga un backup de todos tus prompts</p>
            <p>• <strong>Importar:</strong> Restaura prompts desde un archivo de backup</p>
            <p>• <strong>Eliminar:</strong> Borra todos los datos de este dispositivo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
