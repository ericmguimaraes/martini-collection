import { useEffect, useState } from 'react'
import { formatNumber } from '@/lib/format'

interface StatCardProps {
  label: string
  value: number
  suffix?: string
  icon?: React.ReactNode
}

export default function StatCard({ label, value, suffix, icon }: StatCardProps) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 30
    const increment = value / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      setDisplay(Math.min(Math.round(increment * step), value))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="rounded-xl border border-surface-light bg-surface p-5 text-center space-y-1">
      {icon && <div className="text-amber mb-2">{icon}</div>}
      <p className="font-display text-3xl text-foreground">
        {formatNumber(display)}
        {suffix && <span className="text-lg text-muted ml-1">{suffix}</span>}
      </p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  )
}
