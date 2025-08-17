'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Cloud, Download, Upload } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CloudStorage } from '@/components/cloud-storage-hybrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CloudStoragePage() {
  const [actionSuccess, setActionSuccess] = useState<{ type: 'export' | 'import', success: boolean } | null>(null)

  const handleDataExported = (success: boolean) => {
    setActionSuccess({ type: 'export', success })
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => setActionSuccess(null), 5000)
  }

  const handleDataImported = (success: boolean) => {
    setActionSuccess({ type: 'import', success })
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => setActionSuccess(null), 5000)
    
    // Si la importación fue exitosa, recargar la página para reflejar los cambios
    if (success) {
      setTimeout(() => window.location.reload(), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Mobile Header - Sticky */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="flex items-center justify-between p-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
          </Link>
          
          <div className="flex-1 mx-4">
            <h1 className="text-lg font-bold text-white truncate">Almacenamiento en la Nube</h1>
            <p className="text-xs text-slate-400 truncate">
              Respalda tus prompts en Google Drive o iCloud
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Success/Error Message */}
        {actionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={`border-l-4 ${
              actionSuccess.success 
                ? 'border-green-500 bg-green-950/20' 
                : 'border-red-500 bg-red-950/20'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  {actionSuccess.success ? (
                    <Download className="h-4 w-4 text-green-400" />
                  ) : (
                    <Upload className="h-4 w-4 text-red-400" />
                  )}
                  <p className={`text-sm font-medium ${
                    actionSuccess.success ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {actionSuccess.success 
                      ? `✅ ${actionSuccess.type === 'export' ? 'Exportación' : 'Importación'} completada exitosamente`
                      : `❌ Error en ${actionSuccess.type === 'export' ? 'exportación' : 'importación'}`
                    }
                  </p>
                </div>
                {actionSuccess.success && actionSuccess.type === 'import' && (
                  <p className="text-xs text-green-400 mt-1">
                    La página se recargará automáticamente para mostrar los nuevos datos...
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Cloud Storage Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CloudStorage 
            onDataExported={handleDataExported}
            onDataImported={handleDataImported}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link href="/export">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Download className="h-3 w-3 mr-2" />
                    Exportar Avanzado
                  </Button>
                </Link>
                
                <Link href="/import">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Upload className="h-3 w-3 mr-2" />
                    Importar Avanzado
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const { localPromptStorage } = require('@/lib/local-storage')
                    const data = localPromptStorage.exportData()
                    alert(`📊 Resumen de datos:\n\n• ${data.prompts.length} prompts\n• Versión: ${data.version}\n• Analytics incluidos\n• Tamaño: ~${JSON.stringify(data).length} caracteres`)
                  }}
                  className="w-full text-xs"
                >
                  📊 Ver Resumen
                </Button>
              </div>
              
              <div className="text-xs text-slate-500 text-center">
                También puedes usar las opciones de exportación e importación avanzadas para mayor control
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-blue-500/30 bg-blue-900/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-blue-300 text-lg">
                💡 Consejos para el Almacenamiento en la Nube
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-200">
                <div>
                  <h4 className="font-medium text-blue-300 mb-2">🚀 Google Drive</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Crea una carpeta "AI Prompts" en tu Drive</li>
                    <li>• Haz respaldos regulares (semanales)</li>
                    <li>• Puedes acceder desde cualquier dispositivo</li>
                    <li>• Versiona tus respaldos con fechas</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-blue-300 mb-2">📱 iCloud Drive</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Perfecto para usuarios de Apple</li>
                    <li>• Sincronización automática entre dispositivos</li>
                    <li>• Usa la app "Archivos" para gestionar</li>
                    <li>• Ideal para iPhone, iPad y Mac</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-blue-500/20 pt-3">
                <h4 className="font-medium text-blue-300 mb-2">🔄 Mejores Prácticas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-200">
                  <ul className="space-y-1">
                    <li>• Haz respaldos antes de cambios importantes</li>
                    <li>• Mantén múltiples versiones de respaldo</li>
                    <li>• Verifica la integridad de los archivos</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• Usa nombres descriptivos con fechas</li>
                    <li>• Prueba la restauración periódicamente</li>
                    <li>• Mantén respaldos tanto locales como en la nube</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
