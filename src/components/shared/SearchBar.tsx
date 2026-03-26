import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  placeholder?: string
  large?: boolean
  defaultValue?: string
  value?: string
  onChange?: (query: string) => void
  onSearch?: (query: string) => void
}

export default function SearchBar({
  placeholder = 'Search artists, albums, directors, genres...',
  large = false,
  defaultValue = '',
  value,
  onChange,
  onSearch,
}: SearchBarProps) {
  const controlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const query = controlled ? value : internal
  const navigate = useNavigate()

  useEffect(() => {
    if (!controlled) setInternal(defaultValue)
  }, [defaultValue, controlled])

  function handleChange(val: string) {
    if (controlled) {
      onChange?.(val)
    } else {
      setInternal(val)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (onSearch) {
      onSearch(q)
    } else if (!controlled) {
      if (!q) return
      navigate(`/search?q=${encodeURIComponent(q)}`)
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
          onChange={e => handleChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-surface-light bg-surface pl-10 pr-4 text-foreground placeholder:text-muted-dark focus:border-amber/50 focus:outline-none focus:ring-1 focus:ring-amber/30 transition-colors ${
            large ? 'py-4 text-lg' : 'py-2.5 text-sm'
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={() => handleChange('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  )
}
