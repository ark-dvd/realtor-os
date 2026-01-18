import Image from 'next/image'
import Link from 'next/link'
import { GraduationCap, Clock } from 'lucide-react'
import { CTASection } from '@/components/CTASection'
import { neighborhoods } from '@/lib/neighborhoods-data'

export const metadata = {
  title: 'Neighborhoods',
  description: 'Explore Austin\'s most desirable neighborhoods and find your perfect community.',
}

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
            desirable cities in the U.S. Find the perfect neighborhood for your lifestyle.
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
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-2xl text-white group-hover:text-brand-gold transition-colors">
                      {neighborhood.name}
                    </h3>
                    <p className="text-white/80 text-sm mt-1 line-clamp-1">
                      {neighborhood.tagline}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                    {neighborhood.vibe}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Clock size={14} className="text-brand-gold" />
                      <span>{neighborhood.commute.toDowntown} to Downtown</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <GraduationCap size={14} className="text-brand-gold" />
                      <span>{neighborhood.schoolDistrict}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
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
