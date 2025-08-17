import { StorageSettings } from '@/components/storage-settings'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function SettingsPage() {
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
            <h1 className="text-lg font-bold text-white truncate">Configuración</h1>
            <p className="text-xs text-slate-400 truncate">
              Ajustes y almacenamiento
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <StorageSettings />
      </div>
    </div>
  )
}
