import Image from 'next/image'
import Link from 'next/link'
import { Bed, Bath, Square, MapPin } from 'lucide-react'
import { CTASection } from '@/components/CTASection'
import { getProperties, getSettings, formatPrice, getStatusLabel } from '@/lib/data-fetchers'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Austin Homes for Sale | Merrav Berko Real Estate',
  description: 'Browse available homes for sale in Greater Austin. From Downtown condos to Hill Country estates. Contact Merrav Berko for personalized assistance.',
  openGraph: {
    title: 'Austin Homes for Sale | Merrav Berko Real Estate',
    description: 'Browse available homes for sale in Greater Austin. From Downtown condos to Hill Country estates. Contact Merrav Berko for personalized assistance.',
    url: 'https://www.merravberko.com/properties',
  },
  alternates: {
    canonical: 'https://www.merravberko.com/properties',
  },
}

export const revalidate = 60

export default async function PropertiesPage() {
  const [properties, settings] = await Promise.all([
    getProperties(),
    getSettings()
  ])

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/hero-1.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="container-wide relative z-10 text-center">
          <div className="gold-line mx-auto mb-6" />
          <h1 className="font-display text-hero mb-4">Featured Properties</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Discover exceptional homes in Austin&apos;s most desirable neighborhoods
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          {/* Filter placeholder */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-8 border-b border-neutral-200">
            <p className="text-neutral-600">
              Showing <span className="font-medium text-brand-navy">{properties.length}</span> properties
            </p>
            <select className="input-field w-auto">
              <option>Sort by: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Square Feet</option>
            </select>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link
                key={property._id}
                href={`/properties/${property.slug}`}
                className="group bg-white overflow-hidden card-hover"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={property.heroImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium uppercase tracking-wider ${
                    property.status === 'pending' 
                      ? 'bg-amber-500 text-white' 
                      : property.status === 'sold'
                      ? 'bg-neutral-500 text-white'
                      : 'bg-brand-gold text-brand-navy'
                  }`}>
                    {getStatusLabel(property.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-2xl font-display text-brand-navy mb-2">
                    {formatPrice(property.price)}
                  </p>
                  <h3 className="font-display text-xl text-brand-navy group-hover:text-brand-gold transition-colors mb-2">
                    {property.title}
                  </h3>
                  <p className="flex items-center gap-1 text-neutral-500 text-sm mb-4">
                    <MapPin size={14} />
                    {property.address?.street || property.neighborhood || 'Austin, TX'}
                  </p>

                  {/* Details */}
                  <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 text-sm text-neutral-600">
                    {property.beds && (
                      <span className="flex items-center gap-1">
                        <Bed size={16} className="text-brand-gold" />
                        {property.beds} Beds
                      </span>
                    )}
                    {property.baths && (
                      <span className="flex items-center gap-1">
                        <Bath size={16} className="text-brand-gold" />
                        {property.baths} Baths
                      </span>
                    )}
                    {property.sqft && (
                      <span className="flex items-center gap-1">
                        <Square size={16} className="text-brand-gold" />
                        {property.sqft.toLocaleString()} sqft
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg">No properties available at this time.</p>
              <Link href="/contact" className="btn-gold mt-6">
                Contact Us About Upcoming Listings
              </Link>
            </div>
          )}
        </div>
      </section>

      <CTASection settings={settings} />
    </>
  )
}
