import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Bed, Bath, Square, MapPin, Calendar, Phone, Mail, ArrowLeft, Share2, Heart, Car, Ruler } from 'lucide-react'
import { CTASection } from '@/components/CTASection'
import { getPropertyBySlug, getProperties, getSettings, formatPrice, getStatusLabel } from '@/lib/data-fetchers'

export const revalidate = 60

export async function generateStaticParams() {
  const properties = await getProperties()
  return properties.map((property) => ({
    slug: property.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const property = await getPropertyBySlug(params.slug)
  if (!property) return { title: 'Property Not Found' }
  return {
    title: property.title,
    description: property.shortDescription || `${property.beds} bed, ${property.baths} bath property in Austin, TX`,
  }
}

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const [property, settings] = await Promise.all([
    getPropertyBySlug(params.slug),
    getSettings()
  ])

  if (!property) {
    notFound()
  }

  const images = property.gallery?.map(g => g.url) || []
  if (property.heroImage) {
    images.unshift(property.heroImage)
  }
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80')
  }

  const agentName = settings.agentName || 'Merrav Berko'
  const phone = settings.phone || '(512) 599-9995'
  const email = settings.email || 'merrav@merrav.com'

  return (
    <>
      {/* Hero Image */}
      <section className="relative h-[70vh] min-h-[500px]">
        <Image
          src={images[0]}
          alt={property.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        
        {/* Back Button */}
        <div className="absolute top-24 left-0 right-0">
          <div className="container-wide">
            <Link 
              href="/properties" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Properties
            </Link>
          </div>
        </div>

        {/* Property Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container-wide">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider mb-4 ${
                  property.status === 'pending' 
                    ? 'bg-amber-500 text-white' 
                    : property.status === 'sold'
                    ? 'bg-neutral-500 text-white'
                    : 'bg-brand-gold text-brand-navy'
                }`}>
                  {getStatusLabel(property.status)}
                </span>
                <h1 className="font-display text-4xl md:text-5xl text-white mb-2">
                  {property.title}
                </h1>
                <p className="flex items-center gap-2 text-white/80 text-lg">
                  <MapPin size={18} />
                  {property.address?.street ? `${property.address.street}, ${property.address.city || 'Austin'}, ${property.address.state || 'TX'}` : property.neighborhood || 'Austin, TX'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-4xl md:text-5xl text-brand-gold">
                  {formatPrice(property.price)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-8 pb-8 border-b border-neutral-200 mb-8">
                {property.beds && (
                  <div className="flex items-center gap-2">
                    <Bed className="text-brand-gold" size={24} />
                    <div>
                      <p className="font-display text-2xl text-brand-navy">{property.beds}</p>
                      <p className="text-sm text-neutral-500">Bedrooms</p>
                    </div>
                  </div>
                )}
                {property.baths && (
                  <div className="flex items-center gap-2">
                    <Bath className="text-brand-gold" size={24} />
                    <div>
                      <p className="font-display text-2xl text-brand-navy">{property.baths}</p>
                      <p className="text-sm text-neutral-500">Bathrooms</p>
                    </div>
                  </div>
                )}
                {property.sqft && (
                  <div className="flex items-center gap-2">
                    <Square className="text-brand-gold" size={24} />
                    <div>
                      <p className="font-display text-2xl text-brand-navy">{property.sqft.toLocaleString()}</p>
                      <p className="text-sm text-neutral-500">Sq Ft</p>
                    </div>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="text-brand-gold" size={24} />
                    <div>
                      <p className="font-display text-2xl text-brand-navy">{property.yearBuilt}</p>
                      <p className="text-sm text-neutral-500">Year Built</p>
                    </div>
                  </div>
                )}
                {property.garage && (
                  <div className="flex items-center gap-2">
                    <Car className="text-brand-gold" size={24} />
                    <div>
                      <p className="font-display text-2xl text-brand-navy">{property.garage}</p>
                      <p className="text-sm text-neutral-500">Garage</p>
                    </div>
                  </div>
                )}
                {property.lotSize && (
                  <div className="flex items-center gap-2">
                    <Ruler className="text-brand-gold" size={24} />
                    <div>
                      <p className="font-display text-2xl text-brand-navy">{property.lotSize}</p>
                      <p className="text-sm text-neutral-500">Acres</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-12">
                <h2 className="font-display text-2xl text-brand-navy mb-4">About This Property</h2>
                <div className="prose prose-lg max-w-none text-neutral-600">
                  {property.shortDescription && <p className="text-lg font-medium">{property.shortDescription}</p>}
                  {property.description ? (
                    property.description.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <p>Contact {agentName} for more details about this beautiful property and to schedule a private showing.</p>
                  )}
                </div>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-display text-2xl text-brand-navy mb-4">Features</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-neutral-600">
                        <span className="w-2 h-2 bg-brand-gold rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* MLS Number */}
              {property.mlsNumber && (
                <div className="mb-12 p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-500">MLS# {property.mlsNumber}</p>
                </div>
              )}

              {/* Gallery */}
              {images.length > 1 && (
                <div>
                  <h2 className="font-display text-2xl text-brand-navy mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {images.slice(1).map((image: string, index: number) => (
                      <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <Image
                          src={image}
                          alt={`${property.title} - Image ${index + 2}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Contact Card */}
                <div className="bg-brand-cream p-8 border border-neutral-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={settings.agentPhoto || '/images/merav-berko.jpg'}
                        alt={agentName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-display text-lg text-brand-navy">{agentName}</p>
                      <p className="text-neutral-500 text-sm">{settings.agentTitle || 'REALTOR®'}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <a 
                      href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center gap-3 text-neutral-600 hover:text-brand-gold transition-colors"
                    >
                      <Phone size={18} className="text-brand-gold" />
                      {phone}
                    </a>
                    <a 
                      href={`mailto:${email}`}
                      className="flex items-center gap-3 text-neutral-600 hover:text-brand-gold transition-colors"
                    >
                      <Mail size={18} className="text-brand-gold" />
                      {email}
                    </a>
                  </div>

                  <Link href="/contact" className="btn-gold w-full justify-center mb-3">
                    Schedule a Showing
                  </Link>
                  <Link href="/contact" className="btn-secondary w-full justify-center">
                    Ask a Question
                  </Link>
                </div>

                {/* Share */}
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-neutral-200 text-neutral-600 hover:border-brand-gold hover:text-brand-gold transition-colors rounded">
                    <Share2 size={18} />
                    Share
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-neutral-200 text-neutral-600 hover:border-brand-gold hover:text-brand-gold transition-colors rounded">
                    <Heart size={18} />
                    Save
                  </button>
                </div>

                {/* Neighborhood Link */}
                {property.neighborhoodSlug && (
                  <Link 
                    href={`/neighborhoods/${property.neighborhoodSlug}`}
                    className="block p-4 bg-white border border-neutral-200 rounded-lg hover:border-brand-gold transition-colors"
                  >
                    <p className="text-sm text-neutral-500 mb-1">Explore the Neighborhood</p>
                    <p className="font-display text-brand-navy">{property.neighborhood} →</p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection settings={settings} />
    </>
  )
}
