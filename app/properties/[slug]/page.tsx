import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Bed, Bath, Square, MapPin, Calendar, Phone, Mail, ArrowLeft, Share2, Heart, Car, Ruler, FileText, Play, Maximize } from 'lucide-react'
import { CTASection } from '@/components/CTASection'
import { JsonLd } from '@/components/JsonLd'
import { getPropertyBySlug, getProperties, getSettings, displayPrice, getStatusLabel, Property } from '@/lib/data-fetchers'
import { PropertyGalleryClient } from './PropertyPageClient'

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
  
  const title = property.seoTitle || property.title
  const description = property.seoDescription || property.shortDescription || `${property.beds} bed, ${property.baths} bath property in Austin, TX`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: property.heroImage ? [{ url: property.heroImage }] : [],
    },
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
      <JsonLd type="SingleFamilyResidence" property={property} />
      
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
              className="inline-flex items-center gap-2 text-white/80 hover:text-white active:text-white/60 transition-colors py-2 -my-2 px-1 -mx-1"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Properties</span>
              <span className="sm:hidden">Back</span>
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
                {/* Listing Agent Attribution */}
                {property.listingType === 'other' && property.listingAgent && (
                  <p className="text-white/60 text-sm mt-2 italic">
                    {property.listingAgent}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-display text-4xl md:text-5xl text-brand-gold">
                  {displayPrice(property)}
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

              {/* Facts & Features */}
              <FactsAndFeatures property={property} />

              {/* Floor Plan */}
              {property.floorPlan && (
                <div className="mb-12">
                  <h2 className="font-display text-2xl text-brand-navy mb-4 flex items-center gap-2">
                    <Maximize size={24} className="text-brand-gold" />
                    Floor Plan
                  </h2>
                  <div className="relative bg-neutral-50 rounded-lg overflow-hidden p-4">
                    <a href={property.floorPlan} target="_blank" rel="noopener noreferrer" className="block">
                      <Image
                        src={property.floorPlan}
                        alt={`${property.title} - Floor Plan`}
                        width={800}
                        height={600}
                        className="w-full h-auto object-contain"
                      />
                      <p className="text-center text-sm text-brand-gold mt-4 hover:underline">
                        Click to view full size
                      </p>
                    </a>
                  </div>
                </div>
              )}

              {/* Documents */}
              {property.documents && property.documents.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-display text-2xl text-brand-navy mb-4 flex items-center gap-2">
                    <FileText size={24} className="text-brand-gold" />
                    Documents
                  </h2>
                  <div className="space-y-3">
                    {property.documents.map((doc: { title: string; url: string }, index: number) => (
                      <a
                        key={index}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 min-h-[56px] bg-neutral-50 rounded-lg hover:bg-neutral-100 active:bg-neutral-200 transition-colors group"
                      >
                        <FileText size={20} className="text-brand-gold flex-shrink-0" />
                        <span className="flex-1 text-neutral-700 group-hover:text-brand-navy">
                          {doc.title}
                        </span>
                        <span className="text-sm text-brand-gold whitespace-nowrap">Download →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* MLS Number */}
              {property.mlsNumber && (
                <div className="mb-12 p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-500">MLS# {property.mlsNumber}</p>
                </div>
              )}

              {/* Gallery with Lightbox */}
              {images.length > 0 && (
                <PropertyGalleryClient
                  images={images}
                  title={property.title}
                  videoUrl={property.heroVideo}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-4 sm:space-y-6">
                {/* Contact Card */}
                <div className="bg-brand-cream p-6 sm:p-8 border border-neutral-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
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

                  <div className="space-y-2 mb-6">
                    <a
                      href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center gap-3 text-neutral-600 hover:text-brand-gold active:text-brand-gold/70 transition-colors py-2 -my-1"
                    >
                      <Phone size={18} className="text-brand-gold flex-shrink-0" />
                      {phone}
                    </a>
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-3 text-neutral-600 hover:text-brand-gold active:text-brand-gold/70 transition-colors py-2 -my-1 break-all"
                    >
                      <Mail size={18} className="text-brand-gold flex-shrink-0" />
                      {email}
                    </a>
                  </div>

                  <Link href="/contact" className="btn-gold w-full justify-center mb-3 h-12 sm:h-auto">
                    Schedule a Showing
                  </Link>
                  <Link href="/contact" className="btn-secondary w-full justify-center h-12 sm:h-auto">
                    Ask a Question
                  </Link>
                </div>

                {/* Share */}
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 h-12 border border-neutral-200 text-neutral-600 hover:border-brand-gold hover:text-brand-gold active:bg-neutral-50 transition-colors rounded">
                    <Share2 size={18} />
                    Share
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 h-12 border border-neutral-200 text-neutral-600 hover:border-brand-gold hover:text-brand-gold active:bg-neutral-50 transition-colors rounded">
                    <Heart size={18} />
                    Save
                  </button>
                </div>

                {/* Neighborhood Link */}
                {property.neighborhoodSlug && (
                  <Link
                    href={`/neighborhoods/${property.neighborhoodSlug}`}
                    className="block p-4 bg-white border border-neutral-200 rounded-lg hover:border-brand-gold active:bg-neutral-50 transition-colors"
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

// ═══════════════════════════════════════════════════════════════════════════════
// FACTS & FEATURES COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  'residential': 'Residential / Single Family',
  'condo': 'Condo / Townhome',
  'multi-family': 'Multi-Family',
  'land': 'Land / Lot',
  'commercial': 'Commercial',
}

interface FactRow {
  label: string
  value: string | number | undefined | null
}

function FactsSection({ title, facts }: { title: string; facts: FactRow[] }) {
  // Filter out empty/null values
  const validFacts = facts.filter(f => f.value !== undefined && f.value !== null && f.value !== '')
  if (validFacts.length === 0) return null

  return (
    <div className="mb-8">
      <h3 className="font-display text-lg text-brand-navy mb-4 pb-2 border-b border-neutral-200">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        {validFacts.map((fact, index) => (
          <div key={index} className="flex justify-between py-1">
            <span className="text-neutral-500">{fact.label}</span>
            <span className="text-neutral-800 font-medium text-right">{fact.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FactsAndFeatures({ property }: { property: Property }) {
  // Interior facts
  const interiorFacts: FactRow[] = [
    { label: 'Total Bedrooms', value: property.beds },
    { label: 'Total Bathrooms', value: property.baths },
    { label: 'Full Bathrooms', value: property.fullBathrooms },
    { label: 'Half Bathrooms', value: property.halfBathrooms },
    { label: 'Stories', value: property.stories },
    { label: 'Flooring', value: property.flooring },
    { label: 'Fireplace', value: property.fireplace },
    { label: 'Appliances', value: property.appliances },
    { label: 'Other Interior Features', value: property.interiorFeatures },
  ]

  // Exterior & Construction facts
  const exteriorFacts: FactRow[] = [
    { label: 'Property Type', value: property.propertyType ? PROPERTY_TYPE_LABELS[property.propertyType] : undefined },
    { label: 'Year Built', value: property.yearBuilt },
    { label: 'Square Feet', value: property.sqft?.toLocaleString() },
    { label: 'Roof', value: property.roofType },
    { label: 'Foundation', value: property.foundation },
    { label: 'Garage Spaces', value: property.garage },
    { label: 'Parking', value: property.parkingFeatures },
    { label: 'Pool', value: property.pool },
    { label: 'Heating', value: property.heatingType },
    { label: 'Cooling', value: property.coolingType },
    { label: 'Exterior Features', value: property.exteriorFeatures },
  ]

  // Lot & Area facts
  const lotFacts: FactRow[] = [
    { label: 'Lot Size', value: property.lotSize ? `${property.lotSize} acres` : undefined },
    { label: 'Lot Features', value: property.lotFeatures },
    { label: 'View', value: property.viewDescription },
    { label: 'Water Source', value: property.waterSource },
    { label: 'Sewer', value: property.sewer },
    { label: 'Utilities', value: property.utilities },
  ]

  // Schools facts
  const schoolFacts: FactRow[] = [
    { label: 'Elementary School', value: property.elementarySchool },
    { label: 'Middle School', value: property.middleSchool },
    { label: 'High School', value: property.highSchool },
    { label: 'School District', value: property.schoolDistrict },
  ]

  // Financial facts
  const financialFacts: FactRow[] = [
    { label: 'HOA Fee', value: property.hoaFee },
    { label: 'Annual Taxes', value: property.taxRate },
  ]

  // Check if any section has data
  const hasInterior = interiorFacts.some(f => f.value !== undefined && f.value !== null && f.value !== '')
  const hasExterior = exteriorFacts.some(f => f.value !== undefined && f.value !== null && f.value !== '')
  const hasLot = lotFacts.some(f => f.value !== undefined && f.value !== null && f.value !== '')
  const hasSchools = schoolFacts.some(f => f.value !== undefined && f.value !== null && f.value !== '')
  const hasFinancial = financialFacts.some(f => f.value !== undefined && f.value !== null && f.value !== '')

  // If no facts & features data, don't render the section
  if (!hasInterior && !hasExterior && !hasLot && !hasSchools && !hasFinancial) {
    return null
  }

  return (
    <div className="mb-12">
      <h2 className="font-display text-2xl text-brand-navy mb-6">Facts & Features</h2>
      <div className="bg-neutral-50 rounded-xl p-6">
        <FactsSection title="Interior" facts={interiorFacts} />
        <FactsSection title="Exterior & Construction" facts={exteriorFacts} />
        <FactsSection title="Lot & Area" facts={lotFacts} />
        <FactsSection title="Schools" facts={schoolFacts} />
        <FactsSection title="Financial" facts={financialFacts} />
      </div>
    </div>
  )
}
