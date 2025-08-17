'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Download, 
  Upload, 
  Settings,
  Sparkles,
  FileText,
  Code,
  BarChart3,
  Cloud
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const quickActionItems = [
  {
    title: 'Crear Prompt',
    description: 'Nuevo prompt personalizado',
    icon: <Plus className="h-5 w-5" />,
    href: '/new',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600'
  },
  {
    title: 'Almacenamiento',
    description: 'Google Drive / iCloud',
    icon: <Cloud className="h-5 w-5" />,
    href: '/cloud-storage',
    color: 'bg-cyan-500',
    hoverColor: 'hover:bg-cyan-600'
  },
  {
    title: 'Plantillas',
    description: 'Prompts predefinidos',
    icon: <FileText className="h-5 w-5" />,
    href: '/templates',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600'
  },
  {
    title: 'Análisis',
    description: 'Ver estadísticas',
    icon: <BarChart3 className="h-5 w-5" />,
    href: '/analytics',
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600'
  },
  {
    title: 'Importar',
    description: 'Importar prompts',
    icon: <Upload className="h-5 w-5" />,
    href: '/import',
    color: 'bg-cyan-500',
    hoverColor: 'hover:bg-cyan-600'
  },
  {
    title: 'Exportar',
    description: 'Exportar colección',
    icon: <Download className="h-5 w-5" />,
    href: '/export',
    color: 'bg-pink-500',
    hoverColor: 'hover:bg-pink-600'
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActionItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className="h-auto p-4 flex flex-col items-center gap-2 w-full hover:bg-muted/50"
                asChild
              >
                <Link href={item.href}>
                  <div className={`p-3 rounded-full text-white ${item.color} ${item.hoverColor} transition-colors`}>
                    {item.icon}
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
