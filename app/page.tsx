import { Metadata } from 'next'
import { HeroSlider } from '@/components/HeroSlider'
import { HeroVideo } from '@/components/HeroVideo'
import { ServicesSection } from '@/components/ServicesSection'
import { AboutPreview } from '@/components/AboutPreview'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { NeighborhoodsGrid } from '@/components/NeighborhoodsGrid'
import { CTASection } from '@/components/CTASection'
import { getSettings, getNeighborhoods, getFeaturedTestimonials } from '@/lib/data-fetchers'

export const metadata: Metadata = {
  title: 'Merrav Berko | Austin Real Estate Agent | Greater Austin Homes',
  description: 'Merrav Berko is a trusted Austin real estate agent helping buyers and sellers across Greater Austin. Personalized service, local expertise, exceptional results.',
  openGraph: {
    title: 'Merrav Berko | Austin Real Estate Agent | Greater Austin Homes',
    description: 'Merrav Berko is a trusted Austin real estate agent helping buyers and sellers across Greater Austin. Personalized service, local expertise, exceptional results.',
    url: 'https://www.merravberko.com',
  },
  alternates: {
    canonical: 'https://www.merravberko.com',
  },
}

export const revalidate = 60 // Revalidate every 60 seconds (ISR)

export default async function HomePage() {
  const [settings, neighborhoods, testimonials] = await Promise.all([
    getSettings(),
    getNeighborhoods(),
    getFeaturedTestimonials()
  ])

  // Determine which hero to show
  const showVideo = settings.heroMediaType === 'video' && settings.heroVideoUrl

  return (
    <>
      {showVideo ? (
        <HeroVideo settings={settings} />
      ) : (
        <HeroSlider settings={settings} />
      )}
      <ServicesSection />
      <AboutPreview settings={settings} />
      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}
      <NeighborhoodsGrid neighborhoods={neighborhoods.slice(0, 6)} />
      <CTASection settings={settings} />
    </>
  )
}
