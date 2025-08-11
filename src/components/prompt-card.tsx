'use client'

import { useState } from 'react'
import { Copy, Star, ExternalLink, Share2, Heart, Zap, Clock, Eye, FileText, Code2, Maximize2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatDate, truncateText, AI_MODELS } from '@/lib/utils'
import { MarkdownRenderer } from './markdown-renderer'

interface Prompt {
  id: string
  title: string
  content: string
  description?: string
  category: string
  tags: string[]
  aiModel: string
  isFavorite: boolean
  usageCount: number
  createdAt: Date
}

interface PromptCardProps {
  prompt: Prompt
  viewMode: 'grid' | 'list'
  onCopy?: (p: Prompt) => void
  onShare?: (p: Prompt) => void
  onToggleFavorite?: (p: Prompt) => void
}

export function PromptCard({ prompt, viewMode, onCopy, onShare, onToggleFavorite }: PromptCardProps) {
  const [isFavorite, setIsFavorite] = useState(prompt.isFavorite)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMarkdownView, setIsMarkdownView] = useState(true)
  const [showFullContent, setShowFullContent] = useState(false)

  const handleCopy = async () => {
    if (onCopy) return onCopy(prompt)
    try { 
      await navigator.clipboard.writeText(prompt.content)
      
      // Registrar la ejecución/copia
      try {
        await fetch(`/api/prompts/${prompt.id}/execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            promptId: prompt.id,
            action: 'copy',
            model: prompt.aiModel,
            success: true
          })
        })
      } catch (analyticsError) {
        console.warn('No se pudo registrar la copia para analytics:', analyticsError)
      }
    } catch (err) { 
      console.error('Failed to copy:', err) 
    }
  }

  const handleShare = async () => {
    if (onShare) return onShare(prompt)
    const shareData = { 
      title: prompt.title, 
      text: prompt.description || `Prompt: ${prompt.title}`, 
      url: `${window.location.origin}/prompts/${prompt.id}` 
    }
    try { 
      if (navigator.share && navigator.canShare(shareData)) { 
        await navigator.share(shareData) 
      } else { 
        await navigator.clipboard.writeText(shareData.url) 
      } 
    } catch (err) { 
      console.error('Error sharing:', err) 
    }
  }

  const toggleFavorite = () => {
    if (onToggleFavorite) onToggleFavorite(prompt)
    setIsFavorite(v => !v)
  }

  const aiModelInfo = AI_MODELS.find(model => model.value === prompt.aiModel)

  // Modal para mostrar contenido completo
  const FullContentModal = () => (
    <AnimatePresence>
      {showFullContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowFullContent(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 max-w-4xl max-h-[80vh] overflow-y-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{prompt.title}</h2>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-200 border border-purple-500/30">
                    {prompt.category}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50" style={{ color: aiModelInfo?.color }}>
                    <Zap className="h-3 w-3" />
                    {aiModelInfo?.label || prompt.aiModel}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowFullContent(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="bg-slate-900/60 rounded-lg p-4 mb-4">
              <div className="text-slate-200 prose prose-invert max-w-none">
                <MarkdownRenderer content={prompt.content} />
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-700">
              <div className="flex gap-2">
                {prompt.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/40 text-slate-400 border border-slate-600/40">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                >
                  <Copy className="h-4 w-4" />
                  Copiar Prompt
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  <Share2 className="h-4 w-4" />
                  Compartir
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (viewMode === 'list') {
    return (
      <>
        <motion.article
          whileHover={{ y: -2, scale: 1.005 }}
          whileTap={{ scale: 0.99 }}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-xl shadow-black/20 transition-all duration-300 hover:shadow-purple-500/10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center min-h-[140px]">
            {/* Left Section - Header Info */}
            <div className="flex-1 p-4 lg:p-6 lg:pr-4 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-xl font-semibold text-slate-100 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                    {prompt.title}
                  </h3>
                  {prompt.description && (
                    <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                      {prompt.description}
                    </p>
                  )}
                </div>
                
                {/* Favorite Badge */}
                {isFavorite && (
                  <div className="flex-shrink-0 ml-2">
                    <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-500/30">
                      <Star className="h-3 w-3 fill-current mr-1" />
                      Favorito
                    </div>
                  </div>
                )}
              </div>

              {/* Tags Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-200 border border-purple-500/30">
                  {prompt.category}
                </span>
                
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50" style={{ color: aiModelInfo?.color }}>
                  <Zap className="h-3 w-3" />
                  {aiModelInfo?.label || prompt.aiModel}
                </span>
                
                {prompt.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/40 text-slate-400 border border-slate-600/40">
                    #{tag}
                  </span>
                ))}
                
                {prompt.tags.length > 3 && (
                  <span className="text-xs text-slate-500">+{prompt.tags.length - 3} más</span>
                )}
              </div>
            </div>

            {/* Center Section - Content Preview */}
            <div className="flex-[1.5] px-4 lg:px-6 py-4 border-t lg:border-t-0 lg:border-l border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Contenido del Prompt</span>
                <div className="flex items-center gap-1 bg-slate-800/60 rounded-md p-0.5">
                  <button
                    onClick={() => setIsMarkdownView(true)}
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200',
                      isMarkdownView
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-300'
                    )}
                  >
                    <Eye className="h-3 w-3" />
                    MD
                  </button>
                  <button
                    onClick={() => setIsMarkdownView(false)}
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200',
                      !isMarkdownView
                        ? 'bg-slate-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-300'
                    )}
                  >
                    <FileText className="h-3 w-3" />
                    TXT
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                <div className="h-16 overflow-hidden">
                  {isMarkdownView ? (
                    <MarkdownRenderer 
                      content={truncateText(prompt.content, 150)}
                      compact={true}
                      className="text-sm text-slate-300"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300 overflow-hidden">
                      {truncateText(prompt.content, 150)}
                    </pre>
                  )}
                </div>
                {prompt.content.length > 150 && (
                  <button
                    onClick={() => setShowFullContent(true)}
                    className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Ver contenido completo →
                  </button>
                )}
              </div>
            </div>

            {/* Right Section - Stats & Actions */}
            <div className="flex-shrink-0 p-4 lg:p-6 lg:pl-4 lg:w-[180px] border-t lg:border-t-0 lg:border-l border-slate-700/50">
              {/* Stats */}
              <div className="flex lg:flex-col items-center lg:items-start gap-3 lg:gap-2 mb-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {prompt.usageCount} usos
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(prompt.createdAt)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col items-center lg:items-stretch gap-2">
                <div className="flex lg:justify-center gap-1 mb-2 lg:mb-3">
                  <button
                    onClick={() => setShowFullContent(true)}
                    className="inline-flex items-center justify-center p-2 rounded-lg font-medium text-sm transition-all duration-200 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                    aria-label="Ver contenido completo"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={toggleFavorite}
                    className={cn(
                      'inline-flex items-center justify-center p-2 rounded-lg font-medium text-sm transition-all duration-200',
                      isFavorite 
                        ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20' 
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                    )}
                    aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                  >
                    <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
                  </button>
                  
                  <button 
                    onClick={handleCopy} 
                    className="inline-flex items-center justify-center p-2 rounded-lg font-medium text-sm transition-all duration-200 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300" 
                    aria-label="Copiar"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  <button 
                    onClick={handleShare} 
                    className="inline-flex items-center justify-center p-2 rounded-lg font-medium text-sm transition-all duration-200 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300" 
                    aria-label="Compartir"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
                
                <a 
                  href={`/prompts/${prompt.id}`} 
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25 w-full"
                  aria-label="Ver detalles"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span className="hidden lg:inline">Ver Detalles</span>
                  <span className="lg:hidden">Detalles</span>
                </a>
              </div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5"></div>
          </div>
        </motion.article>
        <FullContentModal />
      </>
    )
  }

  // Grid Mode (Card Mode)
  return (
    <>
      <motion.article
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/40 transition-all duration-300 h-[480px] flex flex-col hover:shadow-purple-500/20"
      >
        {/* Favorite Badge */}
        {isFavorite && (
          <div className="absolute right-4 top-4 z-10">
            <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-500/30">
              <Star className="h-3 w-3 fill-current mr-1" />
              Favorito
            </div>
          </div>
        )}

        {/* Header */}
        <header className="flex-1 min-w-0 mb-4 flex-shrink-0">
          <h3 className="font-semibold leading-snug pr-16 group-hover:text-white transition-colors text-slate-100 text-lg line-clamp-2 h-14 flex items-start">
            {prompt.title}
          </h3>
          
          {prompt.description && (
            <p className="text-slate-300 mt-2 text-sm overflow-hidden line-clamp-2 h-10">
              {prompt.description}
            </p>
          )}

          {/* Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-2 overflow-hidden h-16">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-200 border-purple-500/30 border">
              {prompt.category}
            </span>
            
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300 border border-white/20" style={{ color: aiModelInfo?.color }}>
              <Zap className="h-3 w-3" />
              {aiModelInfo?.label || prompt.aiModel}
            </span>
            
            {prompt.tags.slice(0, 2).map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300 border border-white/20">
                #{tag}
              </span>
            ))}
            
            {prompt.tags.length > 2 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300 border border-white/20">
                +{prompt.tags.length - 2} más
              </span>
            )}
          </div>
        </header>

        {/* Content Preview with Markdown Toggle */}
        <div className="text-slate-300 text-sm leading-relaxed mb-4 flex-1 flex flex-col min-h-0">
          {/* Toggle Header */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Contenido del Prompt</span>
            <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
              <button
                onClick={() => setIsMarkdownView(true)}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200',
                  isMarkdownView
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-300'
                )}
                title="Vista Markdown formateada"
              >
                <Eye className="h-3 w-3" />
                <span className="hidden sm:inline">MD</span>
              </button>
              <button
                onClick={() => setIsMarkdownView(false)}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200',
                  !isMarkdownView
                    ? 'bg-slate-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-300'
                )}
                title="Vista de texto plano"
              >
                <FileText className="h-3 w-3" />
                <span className="hidden sm:inline">TXT</span>
              </button>
            </div>
          </div>

          {/* Content Display */}
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30 overflow-hidden flex-1 min-h-0">
            <div className="h-32 overflow-hidden">
              {isMarkdownView ? (
                <MarkdownRenderer 
                  content={truncateText(prompt.content, 120)}
                  compact={true}
                  className="text-sm text-slate-300"
                />
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300 overflow-hidden">
                  {truncateText(prompt.content, 120)}
                </pre>
              )}
            </div>
            {prompt.content.length > 120 && (
              <button
                onClick={() => setShowFullContent(true)}
                className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Ver contenido completo →
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 flex-shrink-0">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {prompt.usageCount} usos
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(prompt.createdAt)}
          </div>
        </div>

        {/* Actions */}
        <footer className="flex items-center justify-between gap-2 pt-4 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowFullContent(true)}
              className="inline-flex items-center justify-center p-2 rounded-xl font-medium text-sm transition-all duration-200 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
              aria-label="Ver contenido completo"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            
            <button
              onClick={toggleFavorite}
              className={cn(
                'inline-flex items-center justify-center p-2 rounded-xl font-medium text-sm transition-all duration-200 text-slate-300 hover:bg-white/5 hover:text-white',
                isFavorite && 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
              )}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
              <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
            </button>
            
            <button 
              onClick={handleCopy} 
              className="inline-flex items-center justify-center p-2 rounded-xl font-medium text-sm transition-all duration-200 text-slate-300 hover:bg-white/5 hover:text-white" 
              aria-label="Copiar"
            >
              <Copy className="h-4 w-4" />
            </button>
            
            <button 
              onClick={handleShare} 
              className="inline-flex items-center justify-center p-2 rounded-xl font-medium text-sm transition-all duration-200 text-slate-300 hover:bg-white/5 hover:text-white" 
              aria-label="Compartir"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          
          <a 
            href={`/prompts/${prompt.id}`} 
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25"
            aria-label="Ver detalles"
          >
            <ExternalLink className="h-3 w-3" />
            <span className="hidden sm:inline">Ver Detalles</span>
          </a>
        </footer>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10"></div>
        </div>
      </motion.article>
      <FullContentModal />
    </>
  )
}
