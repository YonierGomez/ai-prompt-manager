/**
 * Utility functions for clipboard operations
 */

export interface ClipboardResult {
  success: boolean
  error?: string
}

/**
 * Copy text to clipboard with multiple fallback methods
 * @param text - Text to copy to clipboard
 * @returns Promise with success status and error if any
 */
export async function copyToClipboard(text: string): Promise<ClipboardResult> {
  try {
    // Method 1: Modern Clipboard API (preferred)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return { success: true }
    }

    // Method 2: Fallback using execCommand (for older browsers)
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    textArea.style.opacity = '0'
    textArea.style.pointerEvents = 'none'
    
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (success) {
      return { success: true }
    } else {
      throw new Error('execCommand copy failed')
    }

  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Check if clipboard API is available
 * @returns boolean indicating if clipboard operations are supported
 */
export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard?.writeText || document.execCommand)
}

/**
 * Show manual copy modal as last resort fallback
 * @param text - Text to display for manual copying
 */
export function showManualCopyModal(text: string): void {
  // Create modal overlay
  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
    backdrop-filter: blur(4px);
  `

  // Create modal content
  const content = document.createElement('div')
  content.style.cssText = `
    background: white;
    color: black;
    padding: 24px;
    border-radius: 12px;
    max-width: 90%;
    max-height: 80%;
    overflow: auto;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  `

  // Create title
  const title = document.createElement('h3')
  title.textContent = 'Copiar manualmente'
  title.style.cssText = `
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  `

  // Create instruction text
  const instruction = document.createElement('p')
  instruction.textContent = 'Selecciona todo el texto y cópialo con Ctrl+C (Cmd+C en Mac):'
  instruction.style.cssText = `
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #6b7280;
  `

  // Create textarea with the content
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.cssText = `
    width: 100%;
    height: 200px;
    margin-bottom: 16px;
    padding: 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-family: monospace;
    font-size: 14px;
    resize: vertical;
    line-height: 1.5;
  `
  textarea.readOnly = true

  // Create close button
  const button = document.createElement('button')
  button.textContent = 'Cerrar'
  button.style.cssText = `
    padding: 12px 24px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s;
  `
  
  button.onmouseover = () => button.style.background = '#2563eb'
  button.onmouseout = () => button.style.background = '#3b82f6'
  button.onclick = () => document.body.removeChild(modal)

  // Assemble modal
  content.appendChild(title)
  content.appendChild(instruction)
  content.appendChild(textarea)
  content.appendChild(button)
  modal.appendChild(content)
  document.body.appendChild(modal)

  // Auto-select text and focus
  setTimeout(() => {
    textarea.select()
    textarea.focus()
  }, 100)

  // Close modal on escape key
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      document.body.removeChild(modal)
      document.removeEventListener('keydown', handleEscape)
    }
  }
  document.addEventListener('keydown', handleEscape)

  // Close modal on click outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal)
      document.removeEventListener('keydown', handleEscape)
    }
  })
}
