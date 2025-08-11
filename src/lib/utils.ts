import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export const AI_MODELS = [
  // OpenAI 2025
  { value: 'gpt-5', label: 'GPT-5', color: '#00a67e' },
  { value: 'o3', label: 'OpenAI O3', color: '#00a67e' },
  { value: 'o4-mini', label: 'OpenAI O4 Mini', color: '#00a67e' },
  { value: 'gpt-4o', label: 'GPT-4o', color: '#00a67e' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', color: '#00a67e' },
  
  // Anthropic 2025
  { value: 'claude-opus-4.1', label: 'Claude Opus 4.1', color: '#ff6b35' },
  { value: 'claude-sonnet-4', label: 'Claude Sonnet 4', color: '#ff6b35' },
  { value: 'claude-haiku-3.5', label: 'Claude Haiku 3.5', color: '#ff6b35' },
  
  // Google 2025
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', color: '#4285f4' },
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', color: '#4285f4' },
  { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite', color: '#4285f4' },
  { value: 'gemini-2.5-deep-think', label: 'Gemini 2.5 Deep Think', color: '#4285f4' },
  
  // Legacy models (mantener compatibilidad)
  { value: 'gpt-4', label: 'GPT-4 (Legacy)', color: '#6b7280' },
  { value: 'claude-3', label: 'Claude 3 (Legacy)', color: '#6b7280' },
  { value: 'gemini-pro', label: 'Gemini Pro (Legacy)', color: '#6b7280' },
  
  // Otros
  { value: 'other', label: 'Otro', color: '#6b7280' }
] as const

export const DEFAULT_CATEGORIES = [
  { name: 'Escritura', description: 'Prompts para creación de contenido, copywriting y redacción', color: '#3b82f6', icon: 'PenTool' },
  { name: 'Programación', description: 'Code review, debugging, desarrollo y mejores prácticas', color: '#10b981', icon: 'Code' },
  { name: 'Análisis', description: 'Análisis de datos, insights y business intelligence', color: '#f59e0b', icon: 'BarChart3' },
  { name: 'Creatividad', description: 'Brainstorming, ideación y pensamiento creativo', color: '#ec4899', icon: 'Palette' },
  { name: 'Productividad', description: 'Optimización personal, gestión del tiempo y hábitos', color: '#8b5cf6', icon: 'Zap' },
  { name: 'Educación', description: 'Enseñanza, tutoriales y metodologías de aprendizaje', color: '#06b6d4', icon: 'GraduationCap' },
  { name: 'Marketing', description: 'Estrategias de marketing, growth hacking y ventas', color: '#ef4444', icon: 'TrendingUp' },
  { name: 'Investigación', description: 'Research, análisis de mercado y metodologías científicas', color: '#84cc16', icon: 'Search' }
] as const
