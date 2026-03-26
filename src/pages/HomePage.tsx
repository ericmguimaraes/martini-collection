import stats from '@/data/stats.json'
import cds from '@/data/cds.json'
import dvds from '@/data/dvds.json'
import type { CollectionStats } from '@/types/stats'
import type { CdItem } from '@/types/cd'
import type { DvdItem } from '@/types/dvd'
import HeroSection from '@/components/home/HeroSection'
import CoverArtMarquee from '@/components/home/CoverArtMarquee'
import SpotlightStats from '@/components/home/SpotlightStats'
import TopArtistsGallery from '@/components/home/TopArtistsGallery'
import MusicMeetsCinema from '@/components/home/MusicMeetsCinema'
import FeaturedPicks from '@/components/home/FeaturedPicks'

const s = stats as CollectionStats
const cdData = cds as CdItem[]
const dvdData = dvds as DvdItem[]

function SectionDivider() {
  return (
    <div className="flex items-center justify-center px-4">
      <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-amber/25 to-transparent" />
      <div className="mx-3 h-1.5 w-1.5 rotate-45 bg-amber/30 flex-none" />
      <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-amber/25 to-transparent" />
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      <HeroSection totalCds={s.totalCds} totalDvds={s.totalDvds} />
      <CoverArtMarquee cds={cdData} />
      <SectionDivider />
      <SpotlightStats stats={s} />
      <SectionDivider />
      <TopArtistsGallery stats={s} cds={cdData} />
      <SectionDivider />
      <MusicMeetsCinema stats={s} />
      <SectionDivider />
      <FeaturedPicks cds={cdData} dvds={dvdData} />
    </div>
  )
}
