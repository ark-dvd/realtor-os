import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  MapPin, Clock, GraduationCap, Users, Heart, Star,
  ArrowLeft, Car, Building2, TreePine
} from 'lucide-react'
import { CTASection } from '@/components/CTASection'
import { neighborhoods, getNeighborhoodBySlug } from '@/lib/neighborhoods-data'

// Generate static params for all neighborhoods
export function generateStaticParams() {
  return neighborhoods.map((n) => ({
    slug: n.slug,
  }))
}

// Generate metadata
export function generateMetadata({ params }: { params: { slug: string } }) {
  const neighborhood = getNeighborhoodBySlug(params.slug)
  if (!neighborhood) return { title: 'Neighborhood Not Found' }
  
  return {
    title: `${neighborhood.name} - Austin Neighborhoods`,
    description: neighborhood.tagline,
  }
}

export default function NeighborhoodPage({ params }: { params: { slug: string } }) {
  const neighborhood = getNeighborhoodBySlug(params.slug)
  
  if (!neighborhood) {
    notFound()
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px]">
        <Image
          src={neighborhood.image}
          alt={neighborhood.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/30" />
        
        {/* Back Button */}
        <div className="absolute top-24 left-0 right-0">
          <div className="container-wide">
            <Link 
              href="/neighborhoods" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Neighborhoods
            </Link>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container-wide">
            <div className="max-w-3xl">
              <div className="gold-line mb-4" />
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
                {neighborhood.name}
              </h1>
              <p className="text-xl text-white/80">
                {neighborhood.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-brand-navy text-white py-6">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Users className="text-brand-gold" size={24} />
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Population</p>
                <p className="font-medium">{neighborhood.population}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Car className="text-brand-gold" size={24} />
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">To Downtown</p>
                <p className="font-medium">{neighborhood.commute.toDowntown}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="text-brand-gold" size={24} />
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">To Domain</p>
                <p className="font-medium">{neighborhood.commute.toDomain}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-brand-gold" size={24} />
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Avg. Price</p>
                <p className="font-medium text-brand-gold">{neighborhood.avgPrice}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div>
                <h2 className="font-display text-2xl text-brand-navy mb-4">Overview</h2>
                <div className="bg-white p-6 border border-neutral-200">
                  <p className="text-lg text-neutral-700 leading-relaxed mb-4">
                    {neighborhood.description}
                  </p>
                  <div className="pt-4 border-t border-neutral-100">
                    <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">The Vibe</p>
                    <p className="text-neutral-600 italic">{neighborhood.vibe}</p>
                  </div>
                </div>
              </div>

              {/* Why People Love It */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="text-brand-gold" size={24} />
                  <h2 className="font-display text-2xl text-brand-navy">Why People Love Living Here</h2>
                </div>
                <div className="bg-white p-6 border border-neutral-200 space-y-4">
                  {neighborhood.whyPeopleLove.map((reason, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center flex-shrink-0 text-sm font-medium">
                        {index + 1}
                      </span>
                      <p className="text-neutral-600">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schools */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="text-brand-gold" size={24} />
                  <h2 className="font-display text-2xl text-brand-navy">Schools</h2>
                </div>
                <div className="bg-white p-6 border border-neutral-200">
                  <p className="text-sm text-brand-gold font-medium uppercase tracking-wider mb-4">
                    {neighborhood.schoolDistrict}
                  </p>
                  <div className="space-y-4">
                    {neighborhood.schools.map((school, index) => (
                      <div key={index} className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium text-brand-navy">{school.name}</p>
                          <p className="text-sm text-neutral-500">{school.type}</p>
                          {school.note && (
                            <p className="text-sm text-neutral-600 mt-1">{school.note}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 bg-brand-cream px-3 py-1 rounded">
                          <Star className="text-brand-gold fill-brand-gold" size={14} />
                          <span className="font-medium text-brand-navy">{school.rating}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Highlights */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TreePine className="text-brand-gold" size={24} />
                  <h2 className="font-display text-2xl text-brand-navy">Key Highlights</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {neighborhood.highlights.map((highlight, index) => (
                    <div key={index} className="bg-white p-6 border border-neutral-200">
                      <h3 className="font-display text-lg text-brand-navy mb-2">{highlight.name}</h3>
                      <p className="text-neutral-600 text-sm">{highlight.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Contact Card */}
                <div className="bg-white p-8 border border-neutral-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src="/images/merav-berko.jpg"
                        alt="Merrav Berko"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-display text-lg text-brand-navy">Merrav Berko</p>
                      <p className="text-neutral-500 text-sm">Local Expert</p>
                    </div>
                  </div>
                  
                  <p className="text-neutral-600 text-sm mb-6">
                    Looking for a home in {neighborhood.name}? I can help you find the perfect property 
                    and navigate the local market.
                  </p>

                  <Link href="/contact" className="btn-gold w-full justify-center mb-3">
                    Schedule a Consultation
                  </Link>
                  <Link href="/properties" className="btn-secondary w-full justify-center">
                    View Properties
                  </Link>
                </div>

                {/* Price Info */}
                <div className="bg-brand-navy text-white p-8">
                  <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Average Home Price</p>
                  <p className="font-display text-4xl text-brand-gold mb-4">{neighborhood.avgPrice}</p>
                  <p className="text-white/70 text-sm">
                    Prices vary based on lot size, condition, and specific location within the neighborhood.
                  </p>
                </div>

                {/* Other Neighborhoods */}
                <div className="bg-white p-6 border border-neutral-200">
                  <h3 className="font-display text-lg text-brand-navy mb-4">Explore Other Areas</h3>
                  <div className="space-y-2">
                    {neighborhoods
                      .filter(n => n.slug !== neighborhood.slug)
                      .slice(0, 5)
                      .map(n => (
                        <Link 
                          key={n.slug}
                          href={`/neighborhoods/${n.slug}`}
                          className="block py-2 text-neutral-600 hover:text-brand-gold transition-colors border-b border-neutral-100 last:border-0"
                        >
                          {n.name}
                        </Link>
                      ))}
                  </div>
                  <Link 
                    href="/neighborhoods" 
                    className="block mt-4 text-sm text-brand-gold hover:underline"
                  >
                    View all neighborhoods →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
