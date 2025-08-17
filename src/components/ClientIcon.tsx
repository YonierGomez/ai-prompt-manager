'use client'

import { useEffect, useState } from 'react'
import { LucideIcon } from 'lucide-react'

interface ClientIconProps {
  Icon: LucideIcon
  className?: string
  size?: number
}

export function ClientIcon({ Icon, className, size }: ClientIconProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // Return a placeholder div with the same dimensions during SSR
    return (
      <div 
        className={className} 
        style={{ 
          width: size || '1rem', 
          height: size || '1rem',
          opacity: 0 
        }} 
      />
    )
  }

  return <Icon className={className} size={size} />
}
