// ═══════════════════════════════════════════════════════════════════════════
// SINGLE PROPERTY PAGE
// "The Story" - Editorial-style property presentation
// ═══════════════════════════════════════════════════════════════════════════

import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Bed, Bath, Square, MapPin, Calendar, FileText, ExternalLink } from 'lucide-react'

import { sanityClient, getImageUrl } from '@/lib/sanity/client'
import { PROPERTY_BY_SLUG } from '@/lib/sanity/queries'
import { CinematicHero } from '@/components/home/CinematicHero'
import { ImageGallery } from '@/components/property/ImageGallery'
import { PropertyDetailsAccordion } from '@/components/ui/Accordion'
import { StickyActionBar } from '@/components/property/StickyActionBar'
import { ContactForm } from '@/components/ui/ContactForm'
import { formatPrice, formatSqFt, formatAddress, getStatusLabel } from '@/lib/utils'
import type { Property } from '@/lib/types'
import type { Metadata } from 'next'

// ─────────────────────────────────────────────────────────────────────────────
// DATA FETCHING
// ─────────────────────────────────────────────────────────────────────────────

async function getProperty(slug: string): Promise<Property | null> {
  const headersList = headers()
  const domain = headersList.get('x-tenant-domain') || 
                 process.env.DEFAULT_TENANT_DOMAIN ||
                 'demo.realtoros.com'

  const property = await sanityClient.fetch<Property>(
    PROPERTY_BY_SLUG,
    { currentDomain: domain, slug },
    { next: { revalidate: 60 } }
  )

  return property
}

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const property = await getProperty(params.slug)
  
  if (!property) {
    return { title: 'Property Not Found' }
  }

  return {
    title: property.seoTitle || property.title,
    description: property.seoDescription || property.shortDescription,
    openGraph: {
      title: property.title,
      description: property.shortDescription,
      images: property.heroImage 
        ? [getImageUrl(property.heroImage, { width: 1200, height: 630 })]
        : [],
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PORTABLE TEXT COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const portableTextComponents = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-neutral-slate leading-relaxed mb-6 text-lg">{children}</p>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="font-heading text-3xl text-neutral-charcoal mt-12 mb-6">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="font-heading text-2xl text-neutral-charcoal mt-8 mb-4">{children}</h3>
    ),
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default async function PropertyPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const property = await getProperty(params.slug)

  if (!property) {
    notFound()
  }

  const {
    title,
    status,
    price,
    address,
    specs,
    financials,
    heroType,
    heroVideo,
    heroImage,
    galleryImages,
    headline,
    shortDescription,
    fullDescription,
    highlights,
    amenities,
    documentsPublic,
    virtualTourUrl,
    agentName,
    agentImage,
    agentPhone,
    agentEmail,
  } = property

  // Hero media
  const heroVideoUrl = heroType === 'video' && heroVideo?.url ? heroVideo.url : undefined
  const heroImageUrl = heroImage 
    ? getImageUrl(heroImage, { width: 1920, quality: 85 })
    : '/images/placeholder-property.jpg'
  const heroPosterUrl = heroVideo?.posterImage
    ? getImageUrl(heroVideo.posterImage, { width: 1920, quality: 85 })
    : heroImageUrl

  return (
    <>
      {/* Hero */}
      <CinematicHero
        videoUrl={heroVideoUrl}
        imageUrl={heroImageUrl}
        posterUrl={heroPosterUrl}
        tagline={headline || title}
        subtagline={`${address.city}, ${address.state}`}
        ctaText="Schedule a Tour"
        ctaHref="#contact"
        showScrollIndicator
      />

      {/* Quick Stats Bar */}
      <section className="bg-white border-b border-neutral-pearl sticky top-0 z-30">
        <div className="container-cinematic py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Price & Status */}
            <div className="flex items-center gap-4">
              <p className="font-heading text-3xl font-semibold text-neutral-charcoal">
                {formatPrice(price)}
              </p>
              <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-accent-gold/10 text-accent-gold rounded-sm">
                {getStatusLabel(status)}
              </span>
            </div>

            {/* Specs */}
            <div className="flex items-center gap-6 text-neutral-slate">
              <div className="flex items-center gap-2">
                <Bed size={20} className="text-accent-gold" />
                <span className="font-semibold">{specs.bedrooms}</span>
                <span className="text-sm text-neutral-silver">Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={20} className="text-accent-gold" />
                <span className="font-semibold">{specs.bathrooms}</span>
                <span className="text-sm text-neutral-silver">Baths</span>
              </div>
              <div className="flex items-center gap-2">
                <Square size={20} className="text-accent-gold" />
                <span className="font-semibold">{formatSqFt(specs.squareFeet)}</span>
                <span className="text-sm text-neutral-silver">Sq Ft</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Story - Main Content */}
      <section className="section-dramatic bg-neutral-cream">
        <div className="container-cinematic">
          <div className="max-w-3xl mx-auto">
            {/* Location */}
            <div className="flex items-center gap-2 text-neutral-silver mb-6">
              <MapPin size={18} />
              <p>{formatAddress(address)}</p>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-display-sm text-neutral-charcoal mb-8">
              {headline || title}
            </h1>

            {/* Short Description - Drop Cap Style */}
            {shortDescription && (
              <p className="text-xl text-neutral-slate leading-relaxed mb-12 drop-cap">
                {shortDescription}
              </p>
            )}

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-12 p-6 bg-white border border-neutral-pearl">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-gold mt-2 flex-shrink-0" />
                    <span className="text-neutral-slate">{highlight}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Full Description */}
            {fullDescription && (
              <div className="prose prose-lg max-w-none">
                <PortableText 
                  value={fullDescription} 
                  components={portableTextComponents}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages && galleryImages.length > 0 && (
        <ImageGallery images={galleryImages} title="Gallery" />
      )}

      {/* Details Accordion */}
      <section className="section-dramatic bg-white">
        <div className="container-cinematic">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-display-sm text-neutral-charcoal mb-8">
              Property Details
            </h2>
            
            <PropertyDetailsAccordion
              financials={financials}
              specs={specs}
              amenities={amenities}
            />

            {/* Virtual Tour */}
            {virtualTourUrl && (
              <a
                href={virtualTourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center gap-3 p-4 bg-neutral-cream border border-neutral-pearl hover:border-accent-gold transition-colors"
              >
                <ExternalLink className="text-accent-gold" />
                <span className="font-semibold">Take a Virtual Tour</span>
              </a>
            )}

            {/* Documents */}
            {documentsPublic && documentsPublic.length > 0 && (
              <div className="mt-8">
                <h3 className="font-heading text-xl mb-4">Documents</h3>
                <div className="space-y-2">
                  {documentsPublic.map(doc => (
                    <a
                      key={doc._key}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-neutral-cream hover:bg-neutral-pearl transition-colors"
                    >
                      <FileText size={18} className="text-accent-gold" />
                      <span>{doc.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-dramatic bg-neutral-charcoal text-white">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Agent Info */}
            <div>
              <span className="inline-block w-12 h-px bg-accent-gold mb-6" />
              <h2 className="font-heading text-display-sm mb-6">
                Interested in This Property?
              </h2>
              <p className="text-white/70 mb-8">
                Schedule a private showing or ask any questions about this exceptional home.
              </p>

              {/* Agent Card */}
              <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10">
                {agentImage && (
                  <Image
                    src={getImageUrl(agentImage as any, { width: 100, height: 100 })}
                    alt={agentName || 'Agent'}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-heading text-xl">{agentName || 'Your Agent'}</p>
                  {agentPhone && (
                    <a href={`tel:${agentPhone}`} className="text-accent-gold hover:underline">
                      {agentPhone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 text-neutral-charcoal">
              <h3 className="font-heading text-2xl mb-6">Send a Message</h3>
              <ContactForm
                propertyTitle={title}
                propertyId={property._id}
                agentEmail={agentEmail}
                variant="compact"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Action Bar */}
      <StickyActionBar
        price={price}
        title={title}
        agentPhone={agentPhone}
        onScheduleTour={() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
        }}
      />
    </>
  )
}
