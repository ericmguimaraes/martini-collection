import { useEffect, useState } from 'react'
import SearchBar from '@/components/shared/SearchBar'
import { formatNumber } from '@/lib/format'

interface HeroSectionProps {
  totalCds: number
  totalDvds: number
}

function AnimatedCounter({ target, label }: { target: number; label: string }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const duration = 1200
    const steps = 40
    const increment = target / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      current = Math.min(Math.round(increment * step), target)
      setValue(current)
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])

  return (
    <div className="text-center">
      <p className="font-display text-3xl sm:text-4xl text-foreground">{formatNumber(value)}</p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </div>
  )
}

export default function HeroSection({ totalCds, totalDvds }: HeroSectionProps) {
  return (
    <section className="relative flex flex-col items-center justify-center gap-8 px-4 py-16 sm:py-24 text-center">
      {/* Warm radial gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--color-surface)_0%,_transparent_70%)]" />

      <div className="space-y-4">
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-amber leading-tight">
          The Martini Collection
        </h1>
        <p className="text-lg sm:text-xl text-muted max-w-lg mx-auto">
          A curated collection of music and cinema
        </p>
      </div>

      {/* Animated counters */}
      <div className="flex items-center gap-8 sm:gap-12">
        <AnimatedCounter target={totalCds} label="CDs" />
        <div className="h-10 w-px bg-surface-light" />
        <AnimatedCounter target={totalDvds} label="DVDs" />
      </div>

      {/* Search bar */}
      <div className="w-full max-w-xl">
        <SearchBar large />
      </div>
    </section>
  )
}
