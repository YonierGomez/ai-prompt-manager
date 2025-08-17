'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Edit, Maximize2, Minimize2, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MarkdownRenderer } from './markdown-renderer'
import { Button } from './ui/button'

interface MobileMarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function MobileMarkdownEditor({ 
  value, 
  onChange, 
  placeholder = 'Escribe tu prompt aquí...', 
  className,
  minHeight = 'min-h-[300px]'
}: MobileMarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const markdownTips = [
    { syntax: '**texto**', description: 'Texto en negrita' },
    { syntax: '*texto*', description: 'Texto en cursiva' },
    { syntax: '`código`', description: 'Código inline' },
    { syntax: '# Título', description: 'Título principal' },
    { syntax: '## Subtítulo', description: 'Subtítulo' },
    { syntax: '- Item', description: 'Lista con viñetas' },
    { syntax: '1. Item', description: 'Lista numerada' },
    { syntax: '[enlace](url)', description: 'Crear enlace' },
  ]

  return (
    <>
      <div className={cn(
        'w-full border-2 border-slate-600 rounded-xl overflow-hidden bg-slate-900/70 backdrop-blur-sm shadow-xl',
        'focus-within:border-purple-500/50 focus-within:shadow-purple-500/20',
        isFullscreen && 'fixed inset-4 z-50 rounded-2xl',
        className
      )}>
        {/* Mobile Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/90 border-b border-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-200">Editor</span>
            <div className="h-4 w-px bg-slate-600"></div>
            <span className="text-xs text-slate-400">{value.length} chars</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="text-slate-400 hover:text-slate-300 p-2"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center bg-slate-900/70 rounded-lg p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={cn(
                  'inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  viewMode === 'edit'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                )}
              >
                <Edit className="h-3 w-3" />
                Editar
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={cn(
                  'inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  viewMode === 'preview'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                )}
              >
                <Eye className="h-3 w-3" />
                Vista
              </button>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-slate-400 hover:text-slate-300 p-2 ml-1"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Help Panel */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-800/70 border-b border-slate-600 px-4 py-3"
            >
              <div className="text-xs text-slate-300 mb-2 font-medium">Sintaxis Markdown:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {markdownTips.map((tip, index) => (
                  <div key={index} className="flex flex-col">
                    <code className="text-purple-300 font-mono bg-slate-700/50 px-1 rounded">
                      {tip.syntax}
                    </code>
                    <span className="text-slate-400 mt-0.5">{tip.description}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className={cn(
          'relative',
          isFullscreen ? 'h-[calc(100vh-200px)]' : minHeight
        )}>
          {/* Editor */}
          <AnimatePresence mode="wait">
            {viewMode === 'edit' && (
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute inset-0"
              >
                <textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className={cn(
                    'w-full h-full p-4 bg-transparent text-slate-200 placeholder-slate-500 border-0 outline-none resize-none text-base leading-relaxed',
                    'focus:ring-0 focus:outline-none',
                    'scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600'
                  )}
                  style={{ 
                    fontSize: '16px', // Prevent zoom on iOS
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Menlo, Consolas, "Liberation Mono", "Courier New", monospace'
                  }}
                />
              </motion.div>
            )}

            {/* Preview */}
            {viewMode === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 overflow-auto"
              >
                <div className="p-4">
                  {value.trim() ? (
                    <MarkdownRenderer content={value} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-slate-500">
                        <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">La vista previa aparecerá aquí</p>
                        <p className="text-xs mt-1">Comienza escribiendo en el editor</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-800/70 border-t border-slate-600">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1">
                <span className="font-bold">**</span>
                <span>negrita</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="italic">*</span>
                <span>cursiva</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="font-mono bg-slate-700 px-1 rounded">`</span>
                <span>código</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="bg-slate-700 px-2 py-1 rounded text-xs">
                {value.split('\n').length} líneas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </>
  )
}

// Hook para usar en formularios móviles
export function useMobileMarkdownEditor(initialValue = '') {
  const [value, setValue] = useState(initialValue)
  
  return {
    value,
    onChange: setValue,
    reset: () => setValue(''),
    isEmpty: () => value.trim().length === 0,
    wordCount: () => value.trim().split(/\s+/).filter(word => word.length > 0).length,
    lineCount: () => value.split('\n').length
  }
}
