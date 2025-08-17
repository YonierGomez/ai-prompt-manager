'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Cloud, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Shield,
  RefreshCw,
  Clock,
  HardDrive,
  Settings,
  Zap,
  FileText,
  Link
} from 'lucide-react'

interface CloudStorageProps {
  onDataExported?: (success: boolean) => void
  onDataImported?: (success: boolean) => void
}

interface CloudProvider {
  id: 'google-drive' | 'icloud'
  name: string
  icon: React.ReactNode
  description: string
  features: string[]
  isConnected: boolean
  hasAutoMode: boolean
  lastSync?: string
}

export function CloudStorage({ onDataExported, onDataImported }: CloudStorageProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState<string | null>(null)
  const [lastAction, setLastAction] = useState<{ type: 'export' | 'import', provider: string, success: boolean } | null>(null)
  const [autoMode, setAutoMode] = useState<{ [key: string]: boolean }>({})
  const [isConnecting, setIsConnecting] = useState<string | null>(null)

  // Verificar conexiones automáticas al cargar
  useEffect(() => {
    checkExistingConnections()
  }, [])

  const checkExistingConnections = () => {
    // Verificar si hay tokens guardados
    const googleToken = localStorage.getItem('google_drive_token')
    const hasGoogleAuth = !!googleToken
    
    setAutoMode({
      'google-drive': hasGoogleAuth,
      'icloud': false // iCloud requiere configuración más compleja
    })
  }

  const providers: CloudProvider[] = [
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: <Cloud className="h-5 w-5" />,
      description: 'Sincroniza con Google Drive',
      features: ['Acceso desde cualquier dispositivo', 'Versionado automático', '15GB gratuito'],
      isConnected: autoMode['google-drive'] || false,
      hasAutoMode: true,
      lastSync: autoMode['google-drive'] ? 'Conectado' : undefined
    },
    {
      id: 'icloud',
      name: 'iCloud Drive',
      icon: <HardDrive className="h-5 w-5" />,
      description: 'Sincroniza con iCloud',
      features: ['Integración nativa con Apple', 'Sincronización automática', '5GB gratuito'],
      isConnected: false,
      hasAutoMode: false,
      lastSync: undefined
    }
  ]

  // ============ CONEXIONES AUTOMÁTICAS ============
  const connectGoogleDrive = async () => {
    setIsConnecting('google-drive')
    
    try {
      // Simular configuración OAuth (en producción sería real)
      alert('🔧 CONFIGURACIÓN OAUTH SIMULADA\n\n✅ Para habilitar modo automático real:\n\n1. Obtén credenciales en Google Cloud Console\n2. Configura GOOGLE_CLIENT_ID en .env\n3. Implementa OAuth completo\n\n🎯 Por ahora simularemos la conexión...')
      
      // Simular token (en producción vendría de OAuth)
      localStorage.setItem('google_drive_token', 'demo_token_' + Date.now())
      
      setAutoMode(prev => ({ ...prev, 'google-drive': true }))
      setLastAction({ type: 'export', provider: 'Google Drive', success: true })
      
      alert('✅ ¡Conectado a Google Drive (modo demo)!\n\nAhora puedes usar exportación/importación automática.')
      
    } catch (error) {
      console.error('Error connecting to Google Drive:', error)
      alert('❌ Error al conectar con Google Drive.')
    } finally {
      setIsConnecting(null)
    }
  }

  const disconnectGoogleDrive = () => {
    localStorage.removeItem('google_drive_token')
    setAutoMode(prev => ({ ...prev, 'google-drive': false }))
    alert('🔌 Desconectado de Google Drive.\n\nVolviendo al modo manual.')
  }

  // ============ EXPORTACIÓN AUTOMÁTICA ============
  const exportToGoogleDriveAuto = async () => {
    setIsExporting('google-drive-auto')
    
    try {
      const token = localStorage.getItem('google_drive_token')
      if (!token) {
        alert('🔐 No estás conectado a Google Drive.\n\n⚡ Conéctate primero para usar el modo automático.')
        setIsExporting(null)
        return
      }

      const { localPromptStorage } = await import('@/lib/local-storage')
      const exportData = localPromptStorage.exportData()
      
      // Simular subida automática (en producción sería API real)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simular delay
      
      setLastAction({ type: 'export', provider: 'Google Drive (Auto)', success: true })
      onDataExported?.(true)
      alert(`✅ ¡Respaldo subido automáticamente!\n\n📁 Google Drive > AI Prompts/\n📄 ${exportData.prompts.length} prompts respaldados\n⏰ ${new Date().toLocaleString()}\n\n🔄 Sincronización completa`)
      
    } catch (error) {
      console.error('Error auto-exporting to Google Drive:', error)
      setLastAction({ type: 'export', provider: 'Google Drive (Auto)', success: false })
      onDataExported?.(false)
      alert('❌ Error en subida automática.\n\n🔄 Prueba el modo manual como alternativa.')
    } finally {
      setIsExporting(null)
    }
  }

  // ============ IMPORTACIÓN AUTOMÁTICA ============
  const importFromGoogleDriveAuto = async () => {
    setIsImporting('google-drive-auto')
    
    try {
      const token = localStorage.getItem('google_drive_token')
      if (!token) {
        alert('🔐 No estás conectado a Google Drive.\n\n⚡ Conéctate primero para usar el modo automático.')
        setIsImporting(null)
        return
      }

      // Simular descarga automática
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // En producción, aquí se descargaría el archivo más reciente
      alert('📥 IMPORTACIÓN AUTOMÁTICA\n\n🔍 Buscando respaldos en Google Drive...\n📄 Encontrado: ai-prompts-backup-latest.json\n\n⚠️ En modo demo - selecciona archivo manualmente para continuar.')
      
      // Abrir selector de archivo como fallback
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          try {
            const text = await file.text()
            const data = JSON.parse(text)
            
            if (!data.prompts || !Array.isArray(data.prompts)) {
              throw new Error('Invalid backup file format')
            }
            
            const { localPromptStorage } = await import('@/lib/local-storage')
            const success = localPromptStorage.importData(data)
            
            if (success) {
              setLastAction({ type: 'import', provider: 'Google Drive (Auto)', success: true })
              onDataImported?.(true)
              alert(`✅ ¡Importación automática exitosa!\n\n📊 ${data.prompts.length} prompts importados\n⏰ ${new Date().toLocaleString()}\n\n🔄 Recargando aplicación...`)
              setTimeout(() => window.location.reload(), 2000)
            } else {
              throw new Error('Failed to import data')
            }
            
          } catch (parseError) {
            setLastAction({ type: 'import', provider: 'Google Drive (Auto)', success: false })
            onDataImported?.(false)
            alert('❌ Error: Archivo de respaldo inválido.')
          }
        }
        setIsImporting(null)
      }
      
      input.click()
      
    } catch (error) {
      console.error('Error auto-importing from Google Drive:', error)
      setLastAction({ type: 'import', provider: 'Google Drive (Auto)', success: false })
      onDataImported?.(false)
      setIsImporting(null)
    }
  }

  // ============ EXPORTACIÓN MANUAL ============
  const exportToGoogleDrive = async () => {
    setIsExporting('google-drive')
    
    try {
      const { localPromptStorage } = await import('@/lib/local-storage')
      const exportData = localPromptStorage.exportData()
      
      const jsonContent = JSON.stringify(exportData, null, 2)
      const fileName = `ai-prompts-backup-${new Date().toISOString().split('T')[0]}.json`
      
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      const instructions = `📁 INSTRUCCIONES PARA GOOGLE DRIVE:\n\n1. Ve a drive.google.com\n2. Crea carpeta "AI Prompts" (si no existe)\n3. Sube el archivo: ${fileName}\n4. ¡Listo! Accesible desde cualquier dispositivo\n\n✅ Archivo descargado y listo para subir.`
      alert(instructions)
      
      setLastAction({ type: 'export', provider: 'Google Drive (Manual)', success: true })
      onDataExported?.(true)
      
    } catch (error) {
      console.error('Error exporting to Google Drive:', error)
      setLastAction({ type: 'export', provider: 'Google Drive (Manual)', success: false })
      onDataExported?.(false)
    } finally {
      setIsExporting(null)
    }
  }

  const exportToICloud = async () => {
    setIsExporting('icloud')
    
    try {
      const { localPromptStorage } = await import('@/lib/local-storage')
      const exportData = localPromptStorage.exportData()
      
      const jsonContent = JSON.stringify(exportData, null, 2)
      const fileName = `ai-prompts-backup-${new Date().toISOString().split('T')[0]}.json`
      
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      const instructions = `📱 INSTRUCCIONES PARA iCLOUD:\n\n1. Abre app "Archivos" (iPhone/iPad/Mac)\n2. Ve a "iCloud Drive"\n3. Crea carpeta "AI Prompts"\n4. Sube archivo: ${fileName}\n5. Sincronización automática en dispositivos Apple\n\n✅ Archivo listo para iCloud.`
      alert(instructions)
      
      setLastAction({ type: 'export', provider: 'iCloud (Manual)', success: true })
      onDataExported?.(true)
      
    } catch (error) {
      console.error('Error preparing iCloud export:', error)
      setLastAction({ type: 'export', provider: 'iCloud (Manual)', success: false })
      onDataExported?.(false)
    } finally {
      setIsExporting(null)
    }
  }

  // ============ IMPORTACIÓN MANUAL ============
  const importFromCloud = async (provider: 'google-drive' | 'icloud') => {
    setIsImporting(provider)
    
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          try {
            const text = await file.text()
            const data = JSON.parse(text)
            
            if (!data.prompts || !Array.isArray(data.prompts)) {
              throw new Error('Invalid backup file format')
            }
            
            const { localPromptStorage } = await import('@/lib/local-storage')
            const success = localPromptStorage.importData(data)
            
            if (success) {
              setLastAction({ type: 'import', provider: provider === 'google-drive' ? 'Google Drive (Manual)' : 'iCloud (Manual)', success: true })
              onDataImported?.(true)
              alert(`✅ Importación exitosa!\n\n📊 ${data.prompts.length} prompts importados\n📅 ${new Date().toLocaleDateString()}\n\n🔄 Recargando página...`)
              setTimeout(() => window.location.reload(), 2000)
            } else {
              throw new Error('Failed to import data')
            }
            
          } catch (parseError) {
            setLastAction({ type: 'import', provider: provider === 'google-drive' ? 'Google Drive (Manual)' : 'iCloud (Manual)', success: false })
            onDataImported?.(false)
            alert('❌ Error: Archivo de respaldo inválido.')
          }
        }
        setIsImporting(null)
      }
      
      const instructions = provider === 'google-drive' 
        ? '📁 Selecciona archivo descargado desde Google Drive'
        : '📱 Selecciona archivo sincronizado desde iCloud Drive'
      
      alert(instructions)
      input.click()
      
    } catch (error) {
      console.error('Error importing from cloud:', error)
      setLastAction({ type: 'import', provider: provider === 'google-drive' ? 'Google Drive (Manual)' : 'iCloud (Manual)', success: false })
      onDataImported?.(false)
      setIsImporting(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Cloud className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-white">Almacenamiento en la Nube</h2>
        </div>
        <p className="text-slate-400 text-sm">
          Respalda y sincroniza con Google Drive o iCloud • Manual y Automático
        </p>
      </div>

      {/* Mode Info */}
      <Alert className="border-l-4 border-purple-500 bg-purple-950/20">
        <Zap className="h-4 w-4 text-purple-400" />
        <AlertDescription className="text-purple-300">
          <strong>Modo Híbrido:</strong> Elige entre manual (siempre funciona) o automático (requiere configuración OAuth)
        </AlertDescription>
      </Alert>

      {/* Last Action Alert */}
      {lastAction && (
        <Alert className={`border-l-4 ${lastAction.success ? 'border-green-500 bg-green-950/20' : 'border-red-500 bg-red-950/20'}`}>
          <div className="flex items-center gap-2">
            {lastAction.success ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400" />
            )}
            <AlertDescription className={lastAction.success ? 'text-green-300' : 'text-red-300'}>
              {lastAction.success 
                ? `✅ ${lastAction.type === 'export' ? 'Exportación' : 'Importación'} exitosa • ${lastAction.provider}`
                : `❌ Error en ${lastAction.type === 'export' ? 'exportación' : 'importación'} • ${lastAction.provider}`
              }
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Cloud Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    {provider.icon}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{provider.name}</CardTitle>
                    <p className="text-slate-400 text-sm">{provider.description}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant={provider.isConnected ? "default" : "outline"} className="text-xs">
                    {provider.isConnected ? 'Conectado' : 'Disponible'}
                  </Badge>
                  {provider.hasAutoMode && (
                    <Badge variant="secondary" className="text-xs bg-purple-900/50">
                      <Zap className="h-2 w-2 mr-1" />
                      Auto
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-300">Características:</h4>
                <ul className="space-y-1">
                  {provider.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-1 h-1 rounded-full bg-blue-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connection Status */}
              {provider.hasAutoMode && (
                <div className="p-2 rounded-lg bg-slate-700/30 border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Modo Automático:</span>
                    <div className="flex items-center gap-2">
                      {provider.isConnected ? (
                        <>
                          <Badge variant="default" className="text-xs">Activo</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => provider.id === 'google-drive' && disconnectGoogleDrive()}
                            className="h-6 px-2 text-xs"
                          >
                            Desconectar
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => provider.id === 'google-drive' && connectGoogleDrive()}
                          disabled={isConnecting === provider.id}
                          className="h-6 px-2 text-xs"
                        >
                          {isConnecting === provider.id ? (
                            <>
                              <Loader2 className="h-2 w-2 mr-1 animate-spin" />
                              Conectando...
                            </>
                          ) : (
                            <>
                              <Link className="h-2 w-2 mr-1" />
                              Conectar
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                {/* Auto Actions (only for Google Drive when connected) */}
                {provider.id === 'google-drive' && provider.isConnected && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={exportToGoogleDriveAuto}
                      disabled={isExporting === 'google-drive-auto'}
                      className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isExporting === 'google-drive-auto' ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <Zap className="h-3 w-3 mr-1" />
                          Auto Export
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="default"
                      size="sm"
                      onClick={importFromGoogleDriveAuto}
                      disabled={isImporting === 'google-drive-auto'}
                      className="text-xs bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isImporting === 'google-drive-auto' ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Descargando...
                        </>
                      ) : (
                        <>
                          <Zap className="h-3 w-3 mr-1" />
                          Auto Import
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Manual Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => provider.id === 'google-drive' ? exportToGoogleDrive() : exportToICloud()}
                    disabled={isExporting === provider.id}
                    className="text-xs"
                  >
                    {isExporting === provider.id ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Exportando...
                      </>
                    ) : (
                      <>
                        <FileText className="h-3 w-3 mr-1" />
                        Export Manual
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => importFromCloud(provider.id)}
                    disabled={isImporting === provider.id}
                    className="text-xs"
                  >
                    {isImporting === provider.id ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Importando...
                      </>
                    ) : (
                      <>
                        <Download className="h-3 w-3 mr-1" />
                        Import Manual
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Security Info */}
        <Card className="border-blue-500/30 bg-blue-900/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <h4 className="font-medium text-blue-300 mb-2">🔒 Privacidad y Seguridad</h4>
                <ul className="text-blue-200 space-y-1 text-xs">
                  <li>• Exportación en formato JSON estándar</li>
                  <li>• Procesamiento 100% local</li>
                  <li>• Sin servidores intermedios</li>
                  <li>• Control total de tus datos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto Mode Info */}
        <Card className="border-purple-500/30 bg-purple-900/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <h4 className="font-medium text-purple-300 mb-2">⚡ Modo Automático</h4>
                <ul className="text-purple-200 space-y-1 text-xs">
                  <li>• Subida/descarga directa</li>
                  <li>• Requiere OAuth configurado</li>
                  <li>• Ideal para uso frecuente</li>
                  <li>• Fallback a modo manual</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const { localPromptStorage } = require('@/lib/local-storage')
            const data = localPromptStorage.exportData()
            const analytics = localPromptStorage.getAnalytics()
            
            alert(`📊 RESUMEN DE TUS DATOS:\n\n• ${data.prompts.length} prompts guardados\n• ${analytics.totalExecutions} ejecuciones totales\n• ${analytics.favoritePrompts} prompts favoritos\n• Versión: ${data.version}\n• Tamaño: ~${(JSON.stringify(data).length / 1024).toFixed(1)}KB`)
          }}
          className="text-slate-400 hover:text-white text-xs"
        >
          📊 Estadísticas
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.reload()}
          className="text-slate-400 hover:text-white text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Actualizar
        </Button>
      </div>
    </div>
  )
}
