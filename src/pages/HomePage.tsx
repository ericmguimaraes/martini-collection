import stats from '@/data/stats.json'
import cds from '@/data/cds.json'
import dvds from '@/data/dvds.json'
import type { CollectionStats } from '@/types/stats'
import type { CdItem } from '@/types/cd'
import type { DvdItem } from '@/types/dvd'
import HeroSection from '@/components/home/HeroSection'
import NavigationCards from '@/components/home/NavigationCards'
import SpotlightStats from '@/components/home/SpotlightStats'
import FeaturedPicks from '@/components/home/FeaturedPicks'
import CollectionPreview from '@/components/home/CollectionPreview'

const s = stats as CollectionStats
const cdData = cds as CdItem[]
const dvdData = dvds as DvdItem[]

export default function HomePage() {
  return (
    <div className="space-y-12 pb-12">
      <HeroSection totalCds={s.totalCds} totalDvds={s.totalDvds} />
      <NavigationCards totalCds={s.totalCds} totalDvds={s.totalDvds} />
      <SpotlightStats stats={s} />
      <FeaturedPicks cds={cdData} dvds={dvdData} />
      <CollectionPreview cds={cdData} dvds={dvdData} />
    </div>
  )
}
