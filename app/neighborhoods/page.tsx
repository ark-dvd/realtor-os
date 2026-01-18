import Image from 'next/image'
import Link from 'next/link'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'Neighborhoods',
  description: 'Explore Austin\'s most desirable neighborhoods and find your perfect community.',
}

const neighborhoods = [
  {
    name: 'Downtown Austin',
    slug: 'downtown-austin',
    description: 'The heart of the city with vibrant nightlife, world-class dining, and stunning high-rise living.',
    image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&q=80',
    avgPrice: '$850,000',
  },
  {
    name: 'Westlake',
    slug: 'westlake',
    description: 'Prestigious hillside community known for excellent schools and luxury estates.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    avgPrice: '$1,500,000',
  },
  {
    name: 'Tarrytown',
    slug: 'tarrytown',
    description: 'Historic neighborhood with tree-lined streets and charming family homes.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    avgPrice: '$1,200,000',
  },
  {
    name: 'Zilker',
    slug: 'zilker',
    description: 'Active lifestyle community near Barton Springs and the famous Zilker Park.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    avgPrice: '$950,000',
  },
  {
    name: 'Travis Heights',
    slug: 'travis-heights',
    description: 'Eclectic, walkable neighborhood with stunning views of downtown.',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    avgPrice: '$875,000',
  },
  {
    name: 'East Austin',
    slug: 'east-austin',
    description: 'Hip and rapidly evolving area known for arts, culture, and trendy eateries.',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    avgPrice: '$650,000',
  },
  {
    name: 'Clarksville',
    slug: 'clarksville',
    description: 'Historic district with boutique shops, galleries, and charming cottages.',
    image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80',
    avgPrice: '$1,100,000',
  },
  {
    name: 'Rollingwood',
    slug: 'rollingwood',
    description: 'Quiet, family-friendly enclave with excellent schools and mature trees.',
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80',
    avgPrice: '$1,300,000',
  },
  {
    name: 'Barton Hills',
    slug: 'barton-hills',
    description: 'Nature lover\'s paradise with access to the Greenbelt and Barton Springs.',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    avgPrice: '$825,000',
  },
  {
    name: 'SoCo',
    slug: 'soco',
    description: 'South Congress - Austin\'s iconic shopping and entertainment district.',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    avgPrice: '$775,000',
  },
  {
    name: 'Northwest Hills',
    slug: 'northwest-hills',
    description: 'Established neighborhood with great schools and easy access to tech corridor.',
    image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80',
    avgPrice: '$700,000',
  },
  {
    name: 'Bouldin Creek',
    slug: 'bouldin-creek',
    description: 'Diverse, artsy neighborhood with a strong sense of community.',
    image: 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=800&q=80',
    avgPrice: '$750,000',
  },
]

export default function NeighborhoodsPage() {
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
          <h1 className="font-display text-hero mb-4">Austin Neighborhoods</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Explore the diverse communities that make Austin one of the most 
            desirable places to live in Texas
          </p>
        </div>
      </section>

      {/* Neighborhoods Grid */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {neighborhoods.map((neighborhood, index) => (
              <Link
                key={neighborhood.slug}
                href={`/neighborhoods/${neighborhood.slug}`}
                className="group bg-white overflow-hidden card-hover"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={neighborhood.image}
                    alt={neighborhood.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-display text-2xl text-white group-hover:text-brand-gold transition-colors">
                      {neighborhood.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-neutral-600 mb-4 line-clamp-2">
                    {neighborhood.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">Avg. Home Price</span>
                    <span className="font-display text-lg text-brand-gold">
                      {neighborhood.avgPrice}
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
