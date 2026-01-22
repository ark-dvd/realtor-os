import { HeroSlider } from '@/components/HeroSlider'
import { ServicesSection } from '@/components/ServicesSection'
import { AboutPreview } from '@/components/AboutPreview'
import { NeighborhoodsGrid } from '@/components/NeighborhoodsGrid'
import { CTASection } from '@/components/CTASection'
import { getSettings, getNeighborhoods } from '@/lib/data-fetchers'

export const revalidate = 60 // Revalidate every 60 seconds (ISR)

export default async function HomePage() {
  const [settings, neighborhoods] = await Promise.all([
    getSettings(),
    getNeighborhoods()
  ])

  return (
    <>
      <HeroSlider settings={settings} />
      <ServicesSection />
      <AboutPreview settings={settings} />
      <NeighborhoodsGrid neighborhoods={neighborhoods.slice(0, 6)} />
      <CTASection settings={settings} />
    </>
  )
}
