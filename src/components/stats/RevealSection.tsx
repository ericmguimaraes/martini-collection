import type { ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

interface RevealSectionProps {
  children: ReactNode
  className?: string
}

export default function RevealSection({ children, className = '' }: RevealSectionProps) {
  const { ref, visible } = useReveal(0.1)

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  )
}
