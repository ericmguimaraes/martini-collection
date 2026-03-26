import type { CdItem } from '@/types/cd'
import type { DvdItem } from '@/types/dvd'

const NOTABLE_LABELS = new Set([
  'Blue Note', 'Verve', 'Columbia', 'Prestige', 'Impulse!', 'ECM',
  'Atlantic', 'Riverside', 'Fantasy', 'CTI', 'Pacific Jazz',
  'Concord', 'Pablo', 'Savoy', 'Contemporary',
])

const NOTABLE_DIRECTORS = new Set([
  'Alfred Hitchcock', 'Akira Kurosawa', 'Charles Chaplin', 'Federico Fellini',
  'Luchino Visconti', 'Billy Wilder', 'Stanley Kubrick', 'Martin Scorsese',
  'Francis Ford Coppola', 'Ingmar Bergman', 'Woody Allen', 'John Ford',
  'Orson Welles', 'David Lean', 'Vittorio De Sica', 'Roberto Rossellini',
  'Jean-Luc Godard', 'François Truffaut', 'Michelangelo Antonioni',
  'Luis Buñuel', 'Sergio Leone', 'Fritz Lang', 'John Huston',
])

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]!
    a[i] = a[j]!
    a[j] = tmp
  }
  return a
}

export function pickFeaturedCds(cds: CdItem[], count = 3): CdItem[] {
  const candidates = cds.filter(cd => {
    const coreTag = cd.tag === 'Jazz' || cd.tag === 'Música Brasileira'
    const goodLabel = NOTABLE_LABELS.has(cd.label)
    return coreTag || goodLabel
  })
  return shuffle(candidates).slice(0, count)
}

export function pickFeaturedDvds(dvds: DvdItem[], count = 3): DvdItem[] {
  const candidates = dvds.filter(dvd => {
    const highRated = dvd.imdbRating !== null && dvd.imdbRating >= 7.5
    const notableDirector = dvd.directors.some(d => NOTABLE_DIRECTORS.has(d))
    return highRated || notableDirector
  })
  return shuffle(candidates).slice(0, count)
}

export function pickLatestAdditions(cds: CdItem[], dvds: DvdItem[], count = 8): (CdItem | DvdItem)[] {
  const all = [
    ...cds.map(c => ({ item: c as CdItem | DvdItem, date: c.addedDate })),
    ...dvds.map(d => ({ item: d as CdItem | DvdItem, date: d.addedDate })),
  ]
  all.sort((a, b) => {
    const da = new Date(a.date).getTime()
    const db = new Date(b.date).getTime()
    return db - da
  })
  return all.slice(0, count).map(x => x.item)
}
