import { useEffect, useState } from 'react'
import SearchBar from '@/components/shared/SearchBar'
import { formatNumber } from '@/lib/format'
import { useLanguage } from '@/i18n'

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
  const { t } = useLanguage()

  return (
    <section className="relative flex flex-col items-center justify-center gap-8 px-4 pt-20 pb-10 sm:pt-28 sm:pb-14 text-center">
      {/* Layered ambient glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--color-surface)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_300px_at_50%_30%,_rgba(212,160,83,0.04)_0%,_transparent_100%)]" />

      <div className="space-y-4">
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-amber leading-tight">
          {t('nav.siteTitle')}
        </h1>

        {/* Decorative accent line */}
        <div className="flex justify-center">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber/60 to-transparent" />
        </div>

        <p className="text-lg sm:text-xl text-muted max-w-lg mx-auto">
          {t('home.tagline')}
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
        <SearchBar large placeholder={t('home.searchPlaceholder')} />
      </div>
    </section>
  )
}
