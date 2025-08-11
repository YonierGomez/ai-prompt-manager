import * as React from 'react'
import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toaster'

interface ToastItem {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

interface ToastContextValue {
  toasts: ToastItem[]
  push: (t: Omit<ToastItem, 'id'>) => void
  remove: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function ToastSystemProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const push = React.useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(curr => [...curr, { id, ...t }])
    setTimeout(() => {
      setToasts(curr => curr.filter(x => x.id !== id))
    }, 4000)
  }, [])

  const remove = React.useCallback((id: string) => {
    setToasts(curr => curr.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, push, remove }}>
      <ToastProvider>
        {children}
        <ToastViewport />
        {toasts.map(t => {
          return (
            <Toast
              key={t.id}
              className="bg-slate-900/90 border-white/10 backdrop-blur"
              onOpenChange={(open) => { if (!open) remove(t.id) }}
            >
              {t.title ? <ToastTitle className="text-white/90">{t.title}</ToastTitle> : null}
              {t.description ? <ToastDescription className="text-white/60">{t.description}</ToastDescription> : null}
            </Toast>
          )
        })}
      </ToastProvider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastSystemProvider')
  return ctx
}
