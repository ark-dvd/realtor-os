import Image from 'next/image'
import { CTASection } from '@/components/CTASection'
import { CommunitiesExplorer } from '@/components/CommunitiesExplorer'
import { getCommunities, getCities, getSettings } from '@/lib/data-fetchers'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Greater Austin Communities & Neighborhoods | Merrav Berko',
  description: 'Explore 50+ communities across Austin, Cedar Park, Round Rock, Pflugerville, Leander, and more. Find your perfect Greater Austin neighborhood.',
  openGraph: {
    title: 'Greater Austin Communities & Neighborhoods | Merrav Berko',
    description: 'Explore 50+ communities across Austin, Cedar Park, Round Rock, Pflugerville, Leander, and more. Find your perfect Greater Austin neighborhood.',
    url: 'https://www.merravberko.com/communities',
  },
  alternates: {
    canonical: 'https://www.merravberko.com/communities',
  },
}

export const revalidate = 60

export default async function CommunitiesPage() {
  const [communities, cities, settings] = await Promise.all([
    getCommunities(),
    getCities(),
    getSettings()
  ])

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/hero-2.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="container-wide relative z-10 text-center">
          <div className="gold-line mx-auto mb-6" />
          <h1 className="font-display text-hero mb-4">Greater Austin Communities</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Explore {communities.length} communities across {cities.length} cities.
            Search by name, filter by price, schools, or commute time to find your perfect neighborhood.
          </p>
        </div>
      </section>

      {/* Communities Explorer with Search & Filters */}
      <CommunitiesExplorer communities={communities} cities={cities} />

      <CTASection settings={settings} />
    </>
  )
}
