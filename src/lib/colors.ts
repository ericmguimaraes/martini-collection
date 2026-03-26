const TAG_COLORS: Record<string, string> = {
  Jazz: 'bg-amber-900/60 text-amber-200',
  'Música Brasileira': 'bg-emerald-900/60 text-emerald-200',
  'Música Clássica': 'bg-purple-900/60 text-purple-200',
  Rock: 'bg-red-900/60 text-red-200',
  Pop: 'bg-blue-900/60 text-blue-200',
  'Soul/R&B': 'bg-orange-900/60 text-orange-200',
  World: 'bg-teal-900/60 text-teal-200',
}

const GENRE_COLORS: Record<string, string> = {
  Drama: 'bg-indigo-900/60 text-indigo-200',
  Romance: 'bg-pink-900/60 text-pink-200',
  Comedy: 'bg-yellow-900/60 text-yellow-200',
  'Science Fiction': 'bg-cyan-900/60 text-cyan-200',
  Adventure: 'bg-green-900/60 text-green-200',
  War: 'bg-slate-800/60 text-slate-200',
  Western: 'bg-amber-900/60 text-amber-200',
  Crime: 'bg-red-900/60 text-red-200',
  Thriller: 'bg-violet-900/60 text-violet-200',
  Music: 'bg-fuchsia-900/60 text-fuchsia-200',
  Documentary: 'bg-lime-900/60 text-lime-200',
}

const DEFAULT_COLOR = 'bg-stone-800/60 text-stone-200'

export function getTagColor(tag: string): string {
  return TAG_COLORS[tag] || DEFAULT_COLOR
}

export function getGenreColor(genre: string): string {
  return GENRE_COLORS[genre] || DEFAULT_COLOR
}
