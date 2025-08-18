'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { cn } from '@/lib/utils'

// Nota: Los estilos de highlight.js se cargan mediante CSS global

interface MarkdownRendererProps {
  content: string
  className?: string
  compact?: boolean
}

export function MarkdownRenderer({ content, className, compact = false }: MarkdownRendererProps) {
  return (
    <div className={cn(
      'markdown-content',
      compact && 'markdown-compact',
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Encabezados
          h1: ({ children }) => (
            <h1 className={cn(
              'font-bold mb-4 text-white',
              compact ? 'text-lg' : 'text-2xl'
            )}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={cn(
              'font-semibold mb-3 text-slate-100',
              compact ? 'text-base' : 'text-xl'
            )}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={cn(
              'font-medium mb-2 text-slate-200',
              compact ? 'text-sm' : 'text-lg'
            )}>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className={cn(
              'font-medium mb-2 text-slate-200',
              compact ? 'text-xs' : 'text-base'
            )}>
              {children}
            </h4>
          ),
          
          // Párrafos
          p: ({ children }) => (
            <p className={cn(
              'text-slate-300 leading-relaxed',
              compact ? 'mb-2 text-sm' : 'mb-4 text-base'
            )}>
              {children}
            </p>
          ),
          
          // Texto en negrita y cursiva
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-purple-200">{children}</em>
          ),
          
          // Listas
          ul: ({ children }) => (
            <ul className={cn(
              'list-disc list-inside text-slate-300 space-y-1',
              compact ? 'mb-2 text-sm ml-3' : 'mb-4 text-base ml-4'
            )}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={cn(
              'list-decimal list-inside text-slate-300 space-y-1',
              compact ? 'mb-2 text-sm ml-3' : 'mb-4 text-base ml-4'
            )}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-300">{children}</li>
          ),
          
          // Código
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            const inline = !language
            
            if (inline) {
              return (
                <code 
                  className="px-2 py-1 rounded bg-slate-800 text-purple-200 font-mono text-sm border border-slate-700"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            
            return (
              <div className={cn(
                'rounded-lg overflow-hidden border border-slate-700 shadow-lg',
                compact ? 'mb-2' : 'mb-4'
              )}>
                {language && (
                  <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 text-xs font-medium text-slate-400 uppercase tracking-wide">
                    {language}
                  </div>
                )}
                <pre className="bg-slate-900 p-4 overflow-x-auto">
                  <code className={cn('font-mono', compact ? 'text-xs' : 'text-sm')} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            )
          },
          
          // Citas
          blockquote: ({ children }) => (
            <blockquote className={cn(
              'border-l-4 border-purple-500 pl-4 italic text-slate-300 bg-purple-500/5 rounded-r-lg py-2',
              compact ? 'mb-2 text-sm' : 'mb-4 text-base'
            )}>
              {children}
            </blockquote>
          ),
          
          // Líneas horizontales
          hr: () => (
            <hr className={cn(
              'border-slate-700',
              compact ? 'my-2' : 'my-6'
            )} />
          ),
          
          // Enlaces
          a: ({ href, children }) => (
            <a 
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
          
          // Tablas
          table: ({ children }) => (
            <div className={cn(
              'overflow-x-auto rounded-lg border border-slate-700',
              compact ? 'mb-2' : 'mb-4'
            )}>
              <table className="w-full text-slate-300">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-800">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-slate-900/50">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-slate-700 last:border-b-0">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className={cn(
              'text-left font-medium text-slate-200 border-r border-slate-700 last:border-r-0',
              compact ? 'p-2 text-xs' : 'p-3 text-sm'
            )}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className={cn(
              'text-slate-300 border-r border-slate-700 last:border-r-0',
              compact ? 'p-2 text-xs' : 'p-3 text-sm'
            )}>
              {children}
            </td>
          ),
          
          // Tareas (checkboxes)
          input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled
                  className="mr-2 accent-purple-500"
                  {...props}
                />
              )
            }
            return <input type={type} {...props} />
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// Estilos adicionales para el markdown
export const markdownStyles = `
  .markdown-content {
    line-height: 1.6;
  }
  
  .markdown-content pre {
    scrollbar-width: thin;
    scrollbar-color: rgb(71 85 105) rgb(15 23 42);
  }
  
  .markdown-content pre::-webkit-scrollbar {
    height: 8px;
  }
  
  .markdown-content pre::-webkit-scrollbar-track {
    background: rgb(15 23 42);
  }
  
  .markdown-content pre::-webkit-scrollbar-thumb {
    background: rgb(71 85 105);
    border-radius: 4px;
  }
  
  .markdown-content pre::-webkit-scrollbar-thumb:hover {
    background: rgb(100 116 139);
  }
  
  .markdown-compact * {
    margin-bottom: 0.5rem !important;
  }
  
  .markdown-compact *:last-child {
    margin-bottom: 0 !important;
  }
`
