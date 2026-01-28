import Image from 'next/image'
import Link from 'next/link'
import { GraduationCap, Clock } from 'lucide-react'
import { CTASection } from '@/components/CTASection'
import { getCommunities, getCities, getSettings, Community, City } from '@/lib/data-fetchers'

export const metadata = {
  title: 'Communities',
  description: 'Explore Greater Austin\'s most desirable communities and find your perfect neighborhood across Austin, Bee Cave, Cedar Park, Georgetown, Lakeway, Leander, Pflugerville, and Round Rock.',
}

export const revalidate = 60

// Group communities by city
function groupByCity(communities: Community[], cities: City[]): Map<City, Community[]> {
  const grouped = new Map<City, Community[]>()

  for (const city of cities) {
    const citySlug = city.slug
    const cityComms = communities.filter(c => {
      // Check both Sanity reference and fallback data
      const commCitySlug = c.city?.slug || c.citySlug
      return commCitySlug === citySlug
    })
    if (cityComms.length > 0) {
      grouped.set(city, cityComms)
    }
  }

  return grouped
}

export default async function CommunitiesPage() {
  const [communities, cities, settings] = await Promise.all([
    getCommunities(),
    getCities(),
    getSettings()
  ])

  const groupedCommunities = groupByCity(communities, cities)

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
            Explore the diverse communities across the Greater Austin area.
            From urban living to Hill Country retreats, find the perfect place to call home.
          </p>
        </div>
      </section>

      {/* City Navigation */}
      <section className="bg-white border-b sticky top-20 z-40">
        <div className="container-wide">
          <nav className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
            {Array.from(groupedCommunities.keys()).map((city) => (
              <a
                key={city.slug}
                href={`#${city.slug}`}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-brand-cream hover:bg-brand-gold hover:text-white transition-colors text-sm font-medium text-brand-navy"
              >
                {city.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Communities by City */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide space-y-16">
          {Array.from(groupedCommunities.entries()).map(([city, cityCommunities]) => (
            <div key={city.slug} id={city.slug} className="scroll-mt-32">
              {/* City Header */}
              <div className="mb-8">
                <h2 className="font-display text-3xl text-brand-navy mb-2">{city.name}</h2>
                {city.description && (
                  <p className="text-neutral-600 max-w-2xl">{city.description}</p>
                )}
              </div>

              {/* Communities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cityCommunities.map((community, index) => (
                  <Link
                    key={community._id || community.slug}
                    href={`/communities/${community.slug}`}
                    className="group bg-white overflow-hidden card-hover"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={community.image || 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&q=80'}
                        alt={community.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-display text-2xl text-white group-hover:text-brand-gold transition-colors">
                          {community.name}
                        </h3>
                        <p className="text-white/80 text-sm mt-1 line-clamp-1">
                          {community.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                        {community.vibe}
                      </p>

                      {/* Quick Stats */}
                      <div className="space-y-2 mb-4">
                        {community.commute?.toDowntown && (
                          <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <Clock size={14} className="text-brand-gold" />
                            <span>{community.commute.toDowntown} to Downtown</span>
                          </div>
                        )}
                        {community.schoolDistrict && (
                          <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <GraduationCap size={14} className="text-brand-gold" />
                            <span>{community.schoolDistrict}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <span className="text-sm text-neutral-500">Avg. Home Price</span>
                        <span className="font-display text-lg text-brand-gold">
                          {community.avgPrice}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection settings={settings} />
    </>
  )
}
