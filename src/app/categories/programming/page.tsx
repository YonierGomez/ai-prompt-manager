'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Code, ArrowLeft, Filter, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Prompt {
  id: string
  title: string
  content: string
  description: string
  category: string
  tags: string[]
  aiModel: string
  createdAt: string
  isPublic: boolean
}

export default function ProgrammingPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedModel, setSelectedModel] = useState('all')
  const router = useRouter()

  useEffect(() => {
    fetchProgrammingPrompts()
  }, [])

  useEffect(() => {
    filterPrompts()
  }, [prompts, searchQuery, selectedLanguage, selectedModel])

  const fetchProgrammingPrompts = async () => {
    try {
      const response = await fetch('/api/prompts?category=Programación,Desarrollo,Código,Programming')
      if (response.ok) {
        const data = await response.json()
        setPrompts(data)
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterPrompts = () => {
    let filtered = prompts

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filtrar por lenguaje (basado en tags)
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(prompt =>
        prompt.tags.some(tag => tag.toLowerCase().includes(selectedLanguage.toLowerCase()))
      )
    }

    // Filtrar por modelo de IA
    if (selectedModel !== 'all') {
      filtered = filtered.filter(prompt => prompt.aiModel === selectedModel)
    }

    setFilteredPrompts(filtered)
  }

  // Extraer lenguajes de programación de los tags
  const programmingLanguages = Array.from(new Set(
    prompts.flatMap(p => p.tags)
      .filter(tag => 
        ['javascript', 'python', 'java', 'react', 'typescript', 'node', 'vue', 'angular', 'php', 'c++', 'c#', 'go', 'rust', 'swift'].some(lang => 
          tag.toLowerCase().includes(lang)
        )
      )
  ))

  const aiModels = Array.from(new Set(prompts.map(p => p.aiModel)))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando prompts de programación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
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
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-full bg-purple-500 text-white">
                <Code className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Prompts de Programación
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Prompts especializados para desarrollo de software y programación
            </p>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Búsqueda */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Lenguaje */}
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lenguaje" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los lenguajes</SelectItem>
                    {programmingLanguages.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Modelo de IA */}
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Modelo de IA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los modelos</SelectItem>
                    {aiModels.map(model => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Crear nuevo */}
                <Button asChild className="w-full">
                  <Link href="/new?category=Programación">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Prompt
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Total: {prompts.length} prompts</span>
                <span>Mostrando: {filteredPrompts.length}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Prompts Grid */}
        {filteredPrompts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <Code className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron prompts
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || selectedLanguage !== 'all' || selectedModel !== 'all'
                ? 'Intenta ajustar los filtros para encontrar más prompts'
                : 'Aún no hay prompts de programación. ¡Sé el primero en crear uno!'}
            </p>
            <Button asChild>
              <Link href="/new?category=Programación">
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Prompt
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-2">{prompt.title}</CardTitle>
                        <CardDescription className="line-clamp-3 mt-2">
                          {prompt.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs ml-2">
                        {prompt.aiModel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {prompt.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{prompt.tags.length - 4}
                          </Badge>
                        )}
                      </div>

                      {/* Meta info */}
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{prompt.category}</span>
                        <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Action */}
                      <Button 
                        onClick={() => router.push(`/prompts/${prompt.id}`)}
                        className="w-full group-hover:bg-purple-600 transition-colors"
                      >
                        Ver Prompt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
