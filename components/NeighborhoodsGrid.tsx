import Image from 'next/image'
import Link from 'next/link'

const neighborhoods = [
  {
    name: 'Downtown Austin',
    image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=600&q=80',
    slug: 'downtown-austin',
  },
  {
    name: 'Westlake',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    slug: 'westlake',
  },
  {
    name: 'Tarrytown',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    slug: 'tarrytown',
  },
  {
    name: 'Zilker',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    slug: 'zilker',
  },
  {
    name: 'Travis Heights',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80',
    slug: 'travis-heights',
  },
  {
    name: 'East Austin',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80',
    slug: 'east-austin',
  },
]

export function NeighborhoodsGrid() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-display text-display text-brand-navy mb-4">
            Austin Neighborhoods
          </h2>
          <p className="text-neutral-600 text-lg leading-relaxed">
            Explore the diverse neighborhoods that make Austin one of the most 
            desirable places to live in Texas.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {neighborhoods.map((neighborhood, index) => (
            <Link
              key={neighborhood.slug}
              href={`/neighborhoods/${neighborhood.slug}`}
              className="group relative aspect-[4/3] overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Image
                src={neighborhood.image}
                alt={neighborhood.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <h3 className="font-display text-xl md:text-2xl text-white group-hover:text-brand-gold transition-colors">
                    {neighborhood.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-white/70 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link href="/neighborhoods" className="btn-secondary">
            View All Neighborhoods
          </Link>
        </div>
      </div>
    </section>
  )
}
