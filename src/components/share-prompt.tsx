'use client'

import React, { useState, useEffect } from 'react'
import { Share2, Copy, Twitter, Facebook, Linkedin, MessageCircle, Download, QrCode, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface SharePromptProps {
  prompt: {
    id: string
    title: string
    content: string
    category: string
    model: string
    tags: string[]
  }
  onClose?: () => void
}

export function SharePrompt({ prompt, onClose }: SharePromptProps) {
  const [shareMethod, setShareMethod] = useState<'link' | 'text' | 'qr'>('link')
  const [supportsNativeShare, setSupportsNativeShare] = useState(false)

  // Verificar si el navegador soporta Web Share API
  useEffect(() => {
    setSupportsNativeShare(!!navigator.share)
  }, [])

  // Generar URL de compartir
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/prompts/${prompt.id}`
  
  // Texto para compartir
  const shareText = `¡Mira este increíble prompt para ${prompt.model}! 🤖\n\n"${prompt.title}"\n\nCategoría: ${prompt.category}\nTags: ${prompt.tags.join(', ')}`

  // Compartir usando Web Share API nativo
  const shareNative = async () => {
    try {
      await navigator.share({
        title: `Prompt: ${prompt.title}`,
        text: shareText,
        url: shareUrl
      })
    } catch (err) {
      console.log('Error sharing:', err)
      // Fallback a copiar al portapapeles
      copyToClipboard(shareUrl)
    }
  }

  // Copiar al portapapeles
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('¡Copiado al portapapeles! 📋')
    } catch (err) {
      alert('Error al copiar al portapapeles')
    }
  }

  // Compartir en redes sociales
  const shareOnSocial = (platform: string) => {
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(shareUrl)
    
    let url = ''
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(prompt.title)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}`
        break
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  // Generar código QR (simulado)
  const generateQR = () => {
    // En una implementación real, usarías una librería como qrcode
    // Por ahora, simularemos con una URL de servicio QR
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`
  }

  // Exportar como archivo
  const exportAsFile = () => {
    const promptData = {
      title: prompt.title,
      content: prompt.content,
      category: prompt.category,
      model: prompt.model,
      tags: prompt.tags,
      exportedAt: new Date().toISOString(),
      shareUrl: shareUrl
    }
    
    const blob = new Blob([JSON.stringify(promptData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-${prompt.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    alert('¡Prompt exportado como archivo JSON! 💾')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Compartir Prompt
          </h2>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Información del prompt */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 mb-4">
          <h3 className="font-semibold mb-2 text-sm sm:text-base">{prompt.title}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline" className="text-xs">{prompt.category}</Badge>
            <Badge variant="outline" className="text-xs">{prompt.model}</Badge>
          </div>
          <div className="flex flex-wrap gap-1">
            {prompt.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Botón de compartir nativo (solo en móviles) */}
        {supportsNativeShare && (
          <div className="mb-4">
            <Button
              onClick={shareNative}
              className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Share2 className="h-4 w-4" />
              Compartir usando apps del sistema
            </Button>
          </div>
        )}

        {/* Métodos de compartir */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex border-b text-sm">
            <button
              onClick={() => setShareMethod('link')}
              className={`px-3 py-2 font-medium border-b-2 ${
                shareMethod === 'link' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Enlace
            </button>
            <button
              onClick={() => setShareMethod('text')}
              className={`px-3 py-2 font-medium border-b-2 ${
                shareMethod === 'text' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Texto
            </button>
            <button
              onClick={() => setShareMethod('qr')}
              className={`px-3 py-2 font-medium border-b-2 ${
                shareMethod === 'qr' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              QR
            </button>
          </div>

          {/* Contenido según el método */}
          {shareMethod === 'link' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(shareUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Comparte este enlace para que otros puedan ver tu prompt
              </p>
            </div>
          )}

          {shareMethod === 'text' && (
            <div className="space-y-3">
              <textarea
                value={shareText}
                readOnly
                className="w-full h-32 p-3 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 resize-none"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(shareText)}
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar texto completo
              </Button>
            </div>
          )}

          {shareMethod === 'qr' && (
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <img
                  src={generateQR()}
                  alt="Código QR del prompt"
                  className="border rounded-lg"
                />
              </div>
              <p className="text-xs text-gray-500">
                Escanea este código QR para acceder al prompt
              </p>
            </div>
          )}

          {/* Redes sociales */}
          <div>
            <p className="text-sm font-medium mb-3">Compartir en redes sociales</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('twitter')}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Twitter className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                <span className="hidden sm:inline">Twitter</span>
                <span className="sm:hidden">X</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('facebook')}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Facebook className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('linkedin')}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Linkedin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-700" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('whatsapp')}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Exportar */}
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={exportAsFile}
              className="w-full flex items-center gap-2 text-xs sm:text-sm"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              Exportar como archivo JSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
