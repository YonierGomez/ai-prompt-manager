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
  FileText
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

  const connectGoogleDrive = async () => {
    setIsConnecting('google-drive')
    
    try {
      // Redirigir a OAuth de Google
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      
      if (!clientId) {
        // Modo manual si no hay configuración
        alert('⚙️ Modo Automático no configurado.\n\nPara habilitar la sincronización automática:\n1. Configura GOOGLE_CLIENT_ID en variables de entorno\n2. Reinicia la aplicación\n\n🔄 Usando modo manual por ahora...')
        setIsConnecting(null)
        return
      }

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: `${window.location.origin}/api/auth/google`,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/drive.file',
        access_type: 'offline',
        prompt: 'consent'
      })

      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
      
    } catch (error) {
      console.error('Error connecting to Google Drive:', error)
      setIsConnecting(null)
      alert('❌ Error al conectar con Google Drive. Usando modo manual.')
    }
  }

  const exportToGoogleDriveAuto = async () => {
    setIsExporting('google-drive-auto')
    
    try {
      const token = localStorage.getItem('google_drive_token')
      if (!token) {
        alert('🔐 No estás conectado a Google Drive.\n\nConéctate primero para usar el modo automático.')
        setIsExporting(null)
        return
      }

      const { localPromptStorage } = await import('@/lib/local-storage')
      const exportData = localPromptStorage.exportData()
      
      // Subir automáticamente a Google Drive
      const response = await fetch('/api/cloud/google-drive/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: exportData })
      })

      if (response.ok) {
        setLastAction({ type: 'export', provider: 'Google Drive (Auto)', success: true })
        onDataExported?.(true)
        alert('✅ ¡Respaldo subido automáticamente a Google Drive!\n\n📁 Carpeta: AI Prompts\n⏰ ' + new Date().toLocaleString())
      } else {
        throw new Error('Upload failed')
      }
      
    } catch (error) {
      console.error('Error auto-exporting to Google Drive:', error)
      setLastAction({ type: 'export', provider: 'Google Drive (Auto)', success: false })
      onDataExported?.(false)
      alert('❌ Error en subida automática. Prueba el modo manual.')
    } finally {
      setIsExporting(null)
    }
  }
    setIsExporting('google-drive')
    
    try {
      // Obtener datos para exportar
      const { localPromptStorage } = await import('@/lib/local-storage')
      const exportData = localPromptStorage.exportData()
      
      // Crear archivo JSON
      const jsonContent = JSON.stringify(exportData, null, 2)
      const fileName = `ai-prompts-backup-${new Date().toISOString().split('T')[0]}.json`
      
      // Descargar archivo y mostrar instrucciones
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      // Mostrar instrucciones específicas para Google Drive
      const instructions = `
📁 INSTRUCCIONES PARA GOOGLE DRIVE:

1. Ve a drive.google.com
2. Crea una carpeta llamada "AI Prompts" (si no existe)
3. Sube el archivo descargado (${fileName}) a esa carpeta
4. ¡Listo! Ahora puedes acceder a tu respaldo desde cualquier dispositivo

✅ El archivo se ha descargado y está listo para subir a Google Drive.

💡 Consejo: Puedes crear subcarpetas por fecha para organizar mejor tus respaldos.
      `
      
      alert(instructions)
      
      setLastAction({ type: 'export', provider: 'Google Drive', success: true })
      onDataExported?.(true)
      
    } catch (error) {
      console.error('Error exporting to Google Drive:', error)
      setLastAction({ type: 'export', provider: 'Google Drive', success: false })
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
      
      // Para iCloud, descargamos el archivo y damos instrucciones
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      // Mostrar instrucciones específicas para iCloud
      const instructions = `
📱 INSTRUCCIONES PARA iCLOUD:

1. Abre la app "Archivos" en tu iPhone/iPad/Mac
2. Ve a "iCloud Drive"
3. Crea una carpeta llamada "AI Prompts" (si no existe)
4. Sube el archivo descargado (${fileName}) a esa carpeta
5. El archivo se sincronizará automáticamente en todos tus dispositivos Apple

✅ El archivo se ha descargado y está listo para subir a iCloud.

🍎 Funciona perfecto en iPhone, iPad y Mac con sincronización automática.
      `
      
      alert(instructions)
      
      setLastAction({ type: 'export', provider: 'iCloud', success: true })
      onDataExported?.(true)
      
    } catch (error) {
      console.error('Error preparing iCloud export:', error)
      setLastAction({ type: 'export', provider: 'iCloud', success: false })
      onDataExported?.(false)
    } finally {
      setIsExporting(null)
    }
  }

  const importFromCloud = async (provider: 'google-drive' | 'icloud') => {
    setIsImporting(provider)
    
    try {
      // Crear input de archivo para que el usuario seleccione el backup
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
            
            if (success) {
              setLastAction({ type: 'import', provider: provider === 'google-drive' ? 'Google Drive' : 'iCloud', success: true })
              onDataImported?.(true)
              
              // Mostrar resumen de importación
              alert(`✅ Importación exitosa!\n\n📊 ${data.prompts.length} prompts importados\n🏷️ Versión: ${data.version || 'N/A'}\n📅 Fecha: ${new Date().toLocaleDateString()}\n\n🔄 La página se recargará para mostrar los cambios...`)
              
              // Recargar la página después de 2 segundos
              setTimeout(() => window.location.reload(), 2000)
            } else {
              throw new Error('Failed to import data')
            }
            
          } catch (parseError) {
            console.error('Error parsing backup file:', parseError)
            setLastAction({ type: 'import', provider: provider === 'google-drive' ? 'Google Drive' : 'iCloud', success: false })
            onDataImported?.(false)
            alert('❌ Error: El archivo seleccionado no es un respaldo válido.')
          }
        }
        setIsImporting(null)
      }
      
      // Mostrar instrucciones específicas según el proveedor
      const instructions = provider === 'google-drive' 
        ? '📁 Selecciona el archivo de respaldo descargado desde Google Drive'
        : '📱 Selecciona el archivo de respaldo sincronizado desde iCloud Drive'
      
      alert(instructions)
      input.click()
      
    } catch (error) {
      console.error('Error importing from cloud:', error)
      setLastAction({ type: 'import', provider: provider === 'google-drive' ? 'Google Drive' : 'iCloud', success: false })
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
          Respalda y sincroniza tus prompts con Google Drive o iCloud
        </p>
      </div>

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
                ? `✅ ${lastAction.type === 'export' ? 'Exportación' : 'Importación'} exitosa a ${lastAction.provider}`
                : `❌ Error en ${lastAction.type === 'export' ? 'exportación' : 'importación'} a ${lastAction.provider}`
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
                <Badge variant={provider.isConnected ? "default" : "outline"} className="text-xs">
                  {provider.isConnected ? 'Conectado' : 'Disponible'}
                </Badge>
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

              {/* Last Sync */}
              {provider.lastSync && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  Última sincronización: {provider.lastSync}
                </div>
              )}

              {/* Actions */}
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
                      <Upload className="h-3 w-3 mr-1" />
                      Exportar
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
                      Importar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Box */}
      <Card className="border-blue-500/30 bg-blue-900/20 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <h4 className="font-medium text-blue-300 mb-2">
                🔒 Privacidad y Seguridad
              </h4>
              <ul className="text-blue-200 space-y-1 text-xs">
                <li>• Tus prompts se exportan en formato JSON estándar</li>
                <li>• Los datos nunca pasan por servidores externos</li>
                <li>• El respaldo incluye prompts, configuraciones y analytics</li>
                <li>• Puedes importar respaldos en cualquier momento</li>
                <li>• Compatible con diferentes versiones de la aplicación</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Mostrar estadísticas de almacenamiento local
            const { localPromptStorage } = require('@/lib/local-storage')
            const data = localPromptStorage.exportData()
            const analytics = localPromptStorage.getAnalytics()
            
            alert(`📊 RESUMEN DE TUS DATOS:\n\n• ${data.prompts.length} prompts guardados\n• ${analytics.totalExecutions} ejecuciones totales\n• ${analytics.favoritePrompts} prompts favoritos\n• Versión: ${data.version}\n• Tamaño estimado: ~${(JSON.stringify(data).length / 1024).toFixed(1)}KB\n\n💾 Todo almacenado localmente en tu dispositivo`)
          }}
          className="text-slate-400 hover:text-white text-xs"
        >
          📊 Ver Estadísticas
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
