import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  placeholder?: string
  large?: boolean
  defaultValue?: string
  onSearch?: (query: string) => void
}

export default function SearchBar({
  placeholder = 'Search artists, albums, directors, genres...',
  large = false,
  defaultValue = '',
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    if (onSearch) {
      onSearch(q)
    } else {
      navigate(`/browse/cds?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <svg
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted ${large ? 'h-5 w-5' : 'h-4 w-4'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-surface-light bg-surface pl-10 pr-4 text-foreground placeholder:text-muted-dark focus:border-amber/50 focus:outline-none focus:ring-1 focus:ring-amber/30 transition-colors ${
            large ? 'py-4 text-lg' : 'py-2.5 text-sm'
          }`}
        />
      </div>
    </form>
  )
}
