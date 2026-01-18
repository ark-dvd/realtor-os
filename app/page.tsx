import { HeroSlider } from '@/components/HeroSlider'
import { ServicesSection } from '@/components/ServicesSection'
import { AboutPreview } from '@/components/AboutPreview'
import { NeighborhoodsGrid } from '@/components/NeighborhoodsGrid'
import { CTASection } from '@/components/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <ServicesSection />
      <AboutPreview />
      <NeighborhoodsGrid />
      <CTASection />
    </>
  )
}
