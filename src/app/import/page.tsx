'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ImportedPrompt {
  title: string
  content: string
  description?: string
  category?: string
  tags?: string[]
  aiModel?: string
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [prompts, setPrompts] = useState<ImportedPrompt[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [successCount, setSuccessCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/json' || selectedFile.name.endsWith('.json')) {
        setFile(selectedFile)
        setError('')
        parseFile(selectedFile)
      } else {
        setError('Por favor selecciona un archivo JSON válido')
      }
    }
  }

  const parseFile = async (file: File) => {
    setIsLoading(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      // Validar formato
      if (Array.isArray(data)) {
        const validPrompts = data.filter(item => 
          item.title && item.content && typeof item.title === 'string' && typeof item.content === 'string'
        )
        setPrompts(validPrompts)
        if (validPrompts.length !== data.length) {
          setError(`Se encontraron ${data.length - validPrompts.length} prompts con formato inválido`)
        }
      } else if (data.title && data.content) {
        // Un solo prompt
        setPrompts([data])
      } else {
        setError('Formato de archivo inválido. Debe ser un array de prompts o un prompt individual.')
      }
    } catch (err) {
      setError('Error al leer el archivo JSON. Verifica que sea un archivo válido.')
    } finally {
      setIsLoading(false)
    }
  }

  const importPrompts = async () => {
    setIsLoading(true)
    setError('')
    let imported = 0

    try {
      for (const prompt of prompts) {
        const response = await fetch('/api/prompts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: prompt.title,
            content: prompt.content,
            description: prompt.description || '',
            category: prompt.category || 'General',
            tags: Array.isArray(prompt.tags) ? prompt.tags : [],
            aiModel: prompt.aiModel || 'gpt-4o'
          }),
        })

        if (response.ok) {
          imported++
        }
      }

      setSuccessCount(imported)
      
      if (imported === prompts.length) {
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setError(`Solo se pudieron importar ${imported} de ${prompts.length} prompts`)
      }
    } catch (err) {
      setError('Error al importar los prompts')
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setPrompts([])
    setError('')
    setSuccessCount(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Importar Prompts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Importa prompts desde un archivo JSON para expandir tu colección
            </p>
          </motion.div>
        </div>

        {/* Upload Area */}
        {!file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Seleccionar archivo
                </CardTitle>
                <CardDescription>
                  Selecciona un archivo JSON con prompts para importar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Haz clic para seleccionar un archivo
                  </p>
                  <p className="text-sm text-gray-500">
                    Solo archivos JSON (máximo 10MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Formato esperado */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Formato esperado:
                  </h4>
                  <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
{`[
  {
    "title": "Título del prompt",
    "content": "Contenido del prompt...",
    "description": "Descripción opcional",
    "category": "Categoría",
    "tags": ["tag1", "tag2"],
    "aiModel": "gpt-4o"
  }
]`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* File Analysis */}
        {file && prompts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Archivo analizado: {file.name}
                </CardTitle>
                <CardDescription>
                  Se encontraron {prompts.length} prompts válidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {prompts.slice(0, 6).map((prompt, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <h4 className="font-medium text-sm mb-1 truncate">
                        {prompt.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate">
                        {prompt.description || 'Sin descripción'}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {prompt.category && (
                          <Badge variant="secondary" className="text-xs">
                            {prompt.category}
                          </Badge>
                        )}
                        {prompt.aiModel && (
                          <Badge variant="outline" className="text-xs">
                            {prompt.aiModel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {prompts.length > 6 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Y {prompts.length - 6} prompts más...
                  </p>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={importPrompts} 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Importando...' : `Importar ${prompts.length} prompts`}
                  </Button>
                  <Button onClick={reset} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Success Message */}
        {successCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                ¡Éxito! Se importaron {successCount} prompts correctamente. 
                Serás redirigido al inicio en unos segundos...
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>
    </div>
  )
}
