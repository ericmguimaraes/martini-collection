import { Link } from 'react-router-dom'
import { useLanguage } from '@/i18n'

export default function NotFoundPage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
      <p className="font-display text-2xl text-amber">{t('notFound.panquecaMessage')}</p>
      <img
        src={`${import.meta.env.BASE_URL}panqueca-not-found.jpeg`}
        alt={t('notFound.panquecaAlt')}
        className="w-80 sm:w-96 rounded-xl shadow-lg"
      />
      <h1 className="font-display text-4xl text-amber">404</h1>
      <p className="text-muted">{t('notFound.subtitle')}</p>
      <Link
        to="/"
        className="rounded-md bg-surface px-4 py-2 text-sm text-foreground hover:bg-surface-light transition-colors"
      >
        {t('notFound.backHome')}
      </Link>
    </div>
  )
}
