'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Plus, 
  Zap, 
  Menu, 
  X, 
  Home,
  Heart,
  Folder,
  Download,
  Upload,
  BarChart3,
  Settings,
  Cloud
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  // Para evitar errores de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/categories', label: 'Categorías', icon: Folder },
    { href: '/favorites', label: 'Favoritos', icon: Heart },
    { href: '/cloud-storage', label: 'Nube', icon: Cloud },
    { href: '/analytics', label: 'Análisis', icon: BarChart3 },
    { href: '/settings', label: 'Configuración', icon: Settings },
  ]

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"></div>
            <span className="text-lg font-bold text-white">Prompt Studio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
            <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-1.5 sm:p-2 rounded-lg">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Prompt Studio
              </span>
              <div className="text-xs text-slate-400 -mt-1">AI Manager</div>
            </div>
            {/* Logo text móvil más pequeño */}
            <div className="block sm:hidden">
              <span className="text-sm font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Prompt Studio
              </span>
            </div>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar prompts..."
                className="w-full px-4 py-2.5 sm:py-3 pl-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition-all duration-200"
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center justify-center gap-1.5 xl:gap-2 px-3 xl:px-4 py-2 rounded-xl font-medium text-xs xl:text-sm transition-all duration-200 text-slate-300 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-black"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            ))}
            
            <div className="w-px h-6 bg-white/20 mx-2"></div>
            
            <Link 
              href="/new" 
              className="inline-flex items-center justify-center gap-1.5 xl:gap-2 px-4 xl:px-6 py-2 xl:py-3 rounded-xl font-medium text-xs xl:text-sm transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-black"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xl:inline">Nuevo</span>
            </Link>
          </div>

          {/* Mid-size screen actions (md-lg) */}
          <div className="hidden md:flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link 
              href="/new" 
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Nuevo</span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
              aria-label="Menú"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-1.5 sm:gap-2">
            <Link 
              href="/new" 
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all duration-200 shadow-lg"
              aria-label="Nuevo prompt"
            >
              <Plus className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
              aria-label="Menú"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-14 sm:top-16 left-0 right-0 z-40 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/20"
          >
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {/* Mobile/Tablet Search */}
              <div className="lg:hidden relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar prompts..."
                  className="w-full px-4 py-2.5 sm:py-3 pl-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition-all duration-200"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
              
              {/* Mobile/Tablet Navigation */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm transition-all duration-200 bg-white/5 backdrop-blur-md border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
              
              <Link 
                href="/new" 
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-sm transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25 w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus className="h-4 w-4" />
                Crear Nuevo Prompt
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
