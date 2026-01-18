import Image from 'next/image'
import Link from 'next/link'
import { Bed, Bath, Square, MapPin } from 'lucide-react'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'Properties',
  description: 'Browse luxury homes and properties for sale in Austin, Texas.',
}

// Demo properties - will be replaced with Sanity data
const demoProperties = [
  {
    id: '1',
    title: 'Modern Lakefront Estate',
    slug: 'modern-lakefront-estate',
    price: 2850000,
    address: '1234 Lake Austin Blvd',
    neighborhood: 'Westlake',
    beds: 5,
    baths: 4.5,
    sqft: 4800,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    status: 'For Sale',
  },
  {
    id: '2',
    title: 'Downtown Luxury Condo',
    slug: 'downtown-luxury-condo',
    price: 975000,
    address: '200 Congress Ave #2001',
    neighborhood: 'Downtown Austin',
    beds: 2,
    baths: 2,
    sqft: 1650,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    status: 'For Sale',
  },
  {
    id: '3',
    title: 'Tarrytown Family Home',
    slug: 'tarrytown-family-home',
    price: 1650000,
    address: '3456 Windsor Rd',
    neighborhood: 'Tarrytown',
    beds: 4,
    baths: 3,
    sqft: 3200,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    status: 'For Sale',
  },
  {
    id: '4',
    title: 'Zilker Modern Retreat',
    slug: 'zilker-modern-retreat',
    price: 1425000,
    address: '789 Zilker Park Way',
    neighborhood: 'Zilker',
    beds: 3,
    baths: 2.5,
    sqft: 2400,
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    status: 'Pending',
  },
  {
    id: '5',
    title: 'East Austin Bungalow',
    slug: 'east-austin-bungalow',
    price: 695000,
    address: '456 E 6th Street',
    neighborhood: 'East Austin',
    beds: 3,
    baths: 2,
    sqft: 1800,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    status: 'For Sale',
  },
  {
    id: '6',
    title: 'Travis Heights Gem',
    slug: 'travis-heights-gem',
    price: 1125000,
    address: '321 Travis Heights Blvd',
    neighborhood: 'Travis Heights',
    beds: 4,
    baths: 3,
    sqft: 2800,
    image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80',
    status: 'For Sale',
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function PropertiesPage() {
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
              Showing <span className="font-medium text-brand-navy">{demoProperties.length}</span> properties
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
            {demoProperties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.slug}`}
                className="group bg-white overflow-hidden card-hover"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium uppercase tracking-wider ${
                    property.status === 'Pending' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-brand-gold text-brand-navy'
                  }`}>
                    {property.status}
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
                    {property.address}
                  </p>

                  {/* Details */}
                  <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 text-sm text-neutral-600">
                    <span className="flex items-center gap-1">
                      <Bed size={16} className="text-brand-gold" />
                      {property.beds} Beds
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath size={16} className="text-brand-gold" />
                      {property.baths} Baths
                    </span>
                    <span className="flex items-center gap-1">
                      <Square size={16} className="text-brand-gold" />
                      {property.sqft.toLocaleString()} sqft
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
