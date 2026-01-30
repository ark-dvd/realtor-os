import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import {
  MapPin, Clock, GraduationCap, Users, Heart, Star,
  ArrowLeft, Car, Building2, TreePine
} from 'lucide-react'
import { CTASection } from '@/components/CTASection'
import { JsonLd } from '@/components/JsonLd'
import { getCommunityBySlug, getCommunities, getSettings } from '@/lib/data-fetchers'

export const revalidate = 60

export async function generateStaticParams() {
  const communities = await getCommunities()
  return communities.map((c) => ({
    slug: c.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const community = await getCommunityBySlug(slug)

  if (!community) {
    return { title: 'Community Not Found' }
  }

  const cityName = community.city?.name || 'Greater Austin'

  return {
    title: `${community.name} | ${cityName} TX Real Estate | Merrav Berko`,
    description: `${community.tagline}. ${community.vibe?.slice(0, 100)}`,
    openGraph: {
      title: `${community.name} | ${cityName} TX Real Estate | Merrav Berko`,
      description: community.tagline,
      url: `https://www.merravberko.com/communities/${slug}`,
      images: community.image ? [{ url: community.image, width: 1200, height: 630, alt: community.name }] : [],
    },
    alternates: {
      canonical: `https://www.merravberko.com/communities/${slug}`,
    },
  }
}

export default async function CommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [community, settings] = await Promise.all([
    getCommunityBySlug(slug),
    getSettings()
  ])

  if (!community) {
    notFound()
  }

  const cityName = community.city?.name || 'Greater Austin'
  const citySlug = community.city?.slug || community.citySlug

  return (
    <>
      <JsonLd type="Place" neighborhood={community} />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px]">
        <Image
          src={community.image || 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1200&q=80'}
          alt={community.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/30" />

        {/* Back Button */}
        <div className="absolute top-24 left-0 right-0">
          <div className="container-wide">
            <Link
              href={`/communities${citySlug ? `#${citySlug}` : ''}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              All Communities
            </Link>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container-wide">
            <div className="gold-line mb-6" />
            <p className="text-brand-gold font-medium mb-2">{cityName}</p>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
              {community.name}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              {community.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white border-b">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-200">
            <div className="p-6 md:p-8 text-center">
              <Clock className="w-6 h-6 text-brand-gold mx-auto mb-2" />
              <p className="font-display text-xl text-brand-navy">{community.commute?.toDowntown || 'N/A'}</p>
              <p className="text-sm text-neutral-500">to Downtown Austin</p>
            </div>
            <div className="p-6 md:p-8 text-center">
              <Car className="w-6 h-6 text-brand-gold mx-auto mb-2" />
              <p className="font-display text-xl text-brand-navy">{community.commute?.toDomain || 'N/A'}</p>
              <p className="text-sm text-neutral-500">to The Domain</p>
            </div>
            <div className="p-6 md:p-8 text-center">
              <Users className="w-6 h-6 text-brand-gold mx-auto mb-2" />
              <p className="font-display text-xl text-brand-navy">{community.population || 'N/A'}</p>
              <p className="text-sm text-neutral-500">Population</p>
            </div>
            <div className="p-6 md:p-8 text-center">
              <Building2 className="w-6 h-6 text-brand-gold mx-auto mb-2" />
              <p className="font-display text-xl text-brand-navy">{community.avgPrice}</p>
              <p className="text-sm text-neutral-500">Avg. Home Price</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* The Vibe */}
              <div>
                <h2 className="font-display text-2xl text-brand-navy mb-4">The Vibe</h2>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  {community.vibe}
                </p>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-display text-2xl text-brand-navy mb-4">About {community.name}</h2>
                <div className="prose prose-lg max-w-none text-neutral-600">
                  {community.description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              {community.gallery && community.gallery.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl text-brand-navy mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {community.gallery.map((img, index) => (
                      <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <Image
                          src={img.url}
                          alt={img.alt || `${community.name} - Image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why People Love It */}
              {community.whyPeopleLove && community.whyPeopleLove.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl text-brand-navy mb-6 flex items-center gap-2">
                    <Heart className="text-brand-gold" size={24} />
                    Why People Love {community.name}
                  </h2>
                  <div className="space-y-4">
                    {community.whyPeopleLove.map((reason, index) => (
                      <div key={index} className="flex items-start gap-4 bg-white p-6 border border-neutral-200">
                        <span className="flex-shrink-0 w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center font-display">
                          {index + 1}
                        </span>
                        <p className="text-neutral-600">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {community.highlights && community.highlights.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl text-brand-navy mb-6 flex items-center gap-2">
                    <TreePine className="text-brand-gold" size={24} />
                    Community Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {community.highlights.map((highlight, index) => (
                      <div key={highlight._key || index} className="bg-white p-6 border border-neutral-200">
                        <h3 className="font-display text-lg text-brand-navy mb-2">{highlight.name}</h3>
                        <p className="text-neutral-600 text-sm">{highlight.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Schools */}
                {community.schools && community.schools.length > 0 && (
                  <div className="bg-white p-6 border border-neutral-200">
                    <h3 className="font-display text-xl text-brand-navy mb-4 flex items-center gap-2">
                      <GraduationCap className="text-brand-gold" size={20} />
                      Schools
                    </h3>
                    {community.schoolDistrict && (
                      <p className="text-sm text-neutral-500 mb-4">{community.schoolDistrict}</p>
                    )}
                    <div className="space-y-4">
                      {community.schools.map((school, index) => (
                        <div key={school._key || index} className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-brand-navy">{school.name}</p>
                              <p className="text-sm text-neutral-500">{school.type}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-brand-gold/10 px-2 py-1 rounded">
                              <Star size={14} className="text-brand-gold fill-brand-gold" />
                              <span className="text-sm font-medium text-brand-navy">{school.rating}/10</span>
                            </div>
                          </div>
                          {school.note && (
                            <p className="text-xs text-neutral-400 mt-1">{school.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact CTA */}
                <div className="bg-brand-navy text-white p-6">
                  <h3 className="font-display text-xl mb-4">Interested in {community.name}?</h3>
                  <p className="text-white/70 mb-6 text-sm">
                    Let me help you find your perfect home in this amazing community.
                  </p>
                  <Link href="/contact" className="btn-gold w-full justify-center">
                    Schedule a Tour
                  </Link>
                </div>

                {/* View Properties CTA */}
                <Link
                  href={`/properties?community=${community.slug}`}
                  className="block bg-white p-6 border border-neutral-200 hover:border-brand-gold transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-500">Browse</p>
                      <p className="font-display text-brand-navy group-hover:text-brand-gold transition-colors">
                        Properties in {community.name}
                      </p>
                    </div>
                    <MapPin className="text-brand-gold" size={24} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection settings={settings} />
    </>
  )
}
