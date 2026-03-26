import { useLanguage } from '@/i18n'

interface CollectorProfileProps {
  totalCds: number
  totalDvds: number
  jazzPct: number
  prePct1970: number
  avgRating: number
}

export default function CollectorProfile({
  totalCds,
  totalDvds,
  jazzPct,
  prePct1970,
  avgRating,
}: CollectorProfileProps) {
  const { t } = useLanguage()

  function renderRichText(text: string) {
    const parts = text.split(/(<strong>.*?<\/strong>|<amber>.*?<\/amber>)/g)
    return parts.map((part, i) => {
      if (part.startsWith('<strong>')) {
        return <span key={i} className="text-foreground font-medium">{part.replace(/<\/?strong>/g, '')}</span>
      }
      if (part.startsWith('<amber>')) {
        return <span key={i} className="text-amber font-medium">{part.replace(/<\/?amber>/g, '')}</span>
      }
      return part
    })
  }

  return (
    <div className="rounded-xl border border-amber/20 bg-gradient-to-br from-surface to-surface-hover p-6 space-y-4">
      <h3 className="font-display text-xl text-amber">{t('insights.collectorProfile')}</h3>
      <div className="space-y-3 text-sm text-muted leading-relaxed">
        <p>{renderRichText(t('insights.collectorProfileP1', { totalCds: totalCds.toLocaleString(), totalDvds }))}</p>
        <p>{renderRichText(t('insights.collectorProfileP2', { jazzPct }))}</p>
        <p>{renderRichText(t('insights.collectorProfileP3', { avgRating, prePct1970 }))}</p>
        <p>{renderRichText(t('insights.collectorProfileP4'))}</p>
      </div>
    </div>
  )
}
