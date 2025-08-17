'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Edit, Split } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MarkdownRenderer } from './markdown-renderer'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = 'Escribe tu prompt aquí...', 
  className,
  minHeight = 'min-h-[500px]'
}: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split')

  return (
    <div className={cn(
      'w-full border-2 border-slate-600 rounded-xl overflow-hidden bg-slate-900/70 backdrop-blur-sm shadow-xl',
      'focus-within:border-purple-500/50 focus-within:shadow-purple-500/20',
      className
    )}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-800/90 border-b border-slate-600">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-200">Editor de Prompts</span>
          <div className="h-4 w-px bg-slate-600"></div>
          <span className="text-xs text-slate-400">Markdown soportado • Vista previa en tiempo real</span>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-900/70 rounded-lg p-1 border border-slate-700">
          <button
            onClick={() => setViewMode('edit')}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all',
              viewMode === 'edit'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
            )}
          >
            <Edit className="h-3 w-3" />
            Editar
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all',
              viewMode === 'split'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
            )}
          >
            <Split className="h-3 w-3" />
            Dividido
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all',
              viewMode === 'preview'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
            )}
          >
            <Eye className="h-3 w-3" />
            Vista Previa
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex">
        {/* Editor */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              'flex-1',
              viewMode === 'split' && 'border-r border-slate-700'
            )}
          >
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={cn(
                'w-full p-6 bg-transparent text-slate-200 placeholder-slate-500 border-0 outline-none resize-none text-base leading-relaxed',
                'focus:ring-0 focus:outline-none',
                'scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600',
                minHeight
              )}
              style={{ 
                scrollbarWidth: 'thin', 
                scrollbarColor: '#475569 #1e293b',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Menlo, Consolas, "Liberation Mono", "Courier New", monospace'
              }}
            />
          </motion.div>
        )}

        {/* Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              'flex-1 overflow-auto',
              minHeight
            )}
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
      </div>

      {/* Footer with helpful tips */}
      <div className="px-6 py-3 bg-slate-800/70 border-t border-slate-600">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-6 text-slate-400">
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
            <span className="flex items-center gap-1">
              <span>[</span>
              <span>enlace](url)</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="bg-slate-700 px-2 py-1 rounded text-xs">
              {value.length} caracteres
            </span>
            <span>•</span>
            <span className="bg-slate-700 px-2 py-1 rounded text-xs">
              {value.split('\n').length} líneas
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook para usar en formularios
export function useMarkdownEditor(initialValue = '') {
  const [value, setValue] = useState(initialValue)
  
  return {
    value,
    onChange: setValue,
    reset: () => setValue(''),
    isEmpty: () => value.trim().length === 0
  }
}
