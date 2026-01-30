// ═══════════════════════════════════════════════════════════════════════════
// DATA FETCHERS - Sanity with EXPLICIT Demo Mode
// ═══════════════════════════════════════════════════════════════════════════

import { getSanityClient, isSanityConfigured, getSanityStatus } from './sanity'
import { communities as fallbackCommunities, cities as fallbackCities } from './communities-data'

// ═══════════════════════════════════════════════════════════════════════════
// DEMO MODE TRACKING
// ═══════════════════════════════════════════════════════════════════════════

// Track if we're serving demo data (for UI indicators)
let _isDemoMode = false
let _demoReason: string | null = null

/**
 * Check if the site is currently serving demo data.
 * Use this to show a banner to the agent.
 */
export function isDemoMode(): boolean {
  return _isDemoMode
}

/**
 * Get the reason for demo mode (for debugging).
 */
export function getDemoReason(): string | null {
  return _demoReason
}

/**
 * Set demo mode with reason (internal use).
 */
function setDemoMode(reason: string) {
  _isDemoMode = true
  _demoReason = reason
  
  // Always log to server console - this is important!
  console.warn(`⚠️ DEMO MODE ACTIVE: ${reason}`)
  console.warn('   Site is showing demo data, NOT real Sanity content!')
  console.warn('   Status:', getSanityStatus())
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface LegalLink {
  _key?: string
  title: string
  url?: string
}

export interface SiteSettings {
  _id?: string
  siteTitle?: string
  heroHeadline?: string
  heroSubheadline?: string
  heroMediaType?: 'images' | 'video'
  heroImages?: Array<{ _key?: string; url: string; alt?: string }>
  heroVideoUrl?: string
  agentName?: string
  agentTitle?: string
  agentPhoto?: string
  aboutHeadline?: string
  aboutText?: string
  aboutStats?: Array<{ _key?: string; value: string; label: string }>
  phone?: string
  email?: string
  address?: string
  officeHours?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  youtube?: string
  legalLinks?: LegalLink[]
  iabsDocumentUrl?: string
  privacyPolicy?: string
  termsOfService?: string
  agentLicenseNumber?: string
  brokerName?: string
  brokerLicenseNumber?: string
  showFairHousing?: boolean
  equalHousingLogo?: string
  logo?: string
  pwaIcon?: string
}

export interface Property {
  _id?: string
  title: string
  slug: string
  status: string
  price: number
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  neighborhood?: string
  neighborhoodSlug?: string
  beds?: number
  baths?: number
  sqft?: number
  lotSize?: number
  yearBuilt?: number
  garage?: number
  mlsNumber?: string
  heroImage?: string
  heroVideo?: string
  gallery?: Array<{ url: string; alt?: string }>
  floorPlan?: string
  documents?: Array<{ title: string; url: string }>
  shortDescription?: string
  description?: string
  features?: string[]
  seoTitle?: string
  seoDescription?: string
}

export interface School {
  _key?: string
  name: string
  type: 'Elementary' | 'Middle' | 'High School'
  rating: number
  note?: string
}

export interface City {
  _id?: string
  name: string
  slug: string
  description?: string
  image?: string
  order?: number
}

export interface Community {
  _id?: string
  name: string
  slug: string
  city?: City
  citySlug?: string // For fallback data
  tagline: string
  vibe: string
  description: string
  population?: string
  commute?: {
    toDowntown?: string
    toDomain?: string
  }
  schoolDistrict?: string
  schools?: School[]
  whyPeopleLove?: string[]
  highlights?: Array<{ _key?: string; name: string; description: string }>
  avgPrice: string
  image?: string
  gallery?: Array<{ url: string; alt?: string }>
  order?: number
  isActive?: boolean
}

// Backward compatibility alias
export type Neighborhood = Community

export interface Deal {
  _id?: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  dealType: 'buying' | 'selling'
  propertyAddress?: string
  price?: number
  transactionStage: number
  keyDates?: {
    contractDate?: string
    optionExpiry?: string
    closingDate?: string
  }
  notes?: string
  isActive: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT DATA (Demo Mode)
// ═══════════════════════════════════════════════════════════════════════════

export const defaultSettings: SiteSettings = {
  siteTitle: 'Merrav Berko Real Estate',
  heroHeadline: 'Find Your Home in Austin',
  heroSubheadline: 'Luxury real estate with personalized service. Your journey to the perfect home starts here.',
  heroMediaType: 'images',
  heroImages: [
    { url: '/images/hero-1.jpg', alt: 'Luxury homes in Austin with Pennybacker Bridge' },
    { url: '/images/hero-2.jpg', alt: 'Austin community center aerial view' },
    { url: '/images/hero-3.jpg', alt: 'Austin skyline at night' },
    { url: '/images/hero-4.jpg', alt: 'Pennybacker Bridge sunset' },
  ],
  agentName: 'Merrav Berko',
  agentTitle: 'REALTOR® | Austin Luxury Specialist',
  agentPhoto: '/images/merav-berko.jpg',
  aboutHeadline: 'Meet Merrav Berko',
  aboutText: `Merrav Berko holds a Bachelor of Arts in Management from Israel's Open University and brings over 12 years of experience living in Austin to her work in real estate. Her deep understanding of the city—its neighborhoods, culture, and evolving market—allows her to guide clients with clarity and confidence.

With a refined eye for design, a strong foundation in investment strategy, and meticulous attention to detail, Merrav is committed to exceeding her clients' expectations at every step.`,
  aboutStats: [
    { value: '12+', label: 'Years in Austin' },
    { value: 'B.A.', label: 'Management' },
    { value: '5★', label: 'Service' },
  ],
  phone: '(512) 599-9995',
  email: 'merrav@merrav.com',
  address: 'Austin, Texas',
  officeHours: 'Monday - Friday: 9am - 6pm\nSaturday: 10am - 4pm\nSunday: By appointment',
  legalLinks: [
    { _key: 'trec', title: 'TREC Consumer Protection', url: 'https://www.trec.texas.gov/forms/consumer-protection-notice' },
    { _key: 'fair-housing', title: 'Fair Housing Statement', url: '' },
    { _key: 'privacy', title: 'Privacy Policy', url: '' },
    { _key: 'terms', title: 'Terms of Use', url: '' },
  ],
  privacyPolicy: '',
  termsOfService: '',
  agentLicenseNumber: '',
  brokerName: '',
  brokerLicenseNumber: '',
  showFairHousing: true,
}

export const defaultProperties: Property[] = [
  {
    _id: 'demo-1',
    title: 'Modern Lakefront Estate',
    slug: 'modern-lakefront-estate',
    price: 2850000,
    address: { street: '1234 Lake Austin Blvd', city: 'Austin', state: 'TX', zip: '78703' },
    neighborhood: 'Westlake',
    beds: 5,
    baths: 4.5,
    sqft: 4800,
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    status: 'for-sale',
    shortDescription: 'Stunning lakefront property with panoramic views',
  },
  {
    _id: 'demo-2',
    title: 'Downtown Luxury Condo',
    slug: 'downtown-luxury-condo',
    price: 975000,
    address: { street: '200 Congress Ave #2001', city: 'Austin', state: 'TX', zip: '78701' },
    neighborhood: 'Downtown Austin',
    beds: 2,
    baths: 2,
    sqft: 1650,
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    status: 'for-sale',
    shortDescription: 'Sophisticated urban living in the heart of downtown',
  },
  {
    _id: 'demo-3',
    title: 'Tarrytown Family Home',
    slug: 'tarrytown-family-home',
    price: 1650000,
    address: { street: '3456 Windsor Rd', city: 'Austin', state: 'TX', zip: '78703' },
    neighborhood: 'Tarrytown',
    beds: 4,
    baths: 3,
    sqft: 3200,
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    status: 'for-sale',
    shortDescription: 'Classic charm meets modern comfort in coveted Tarrytown',
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// FETCH FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export async function getSettings(): Promise<SiteSettings> {
  // Not configured at all - demo mode
  if (!isSanityConfigured()) {
    setDemoMode('Sanity not configured (NEXT_PUBLIC_SANITY_PROJECT_ID missing)')
    return defaultSettings
  }

  try {
    const client = getSanityClient()
    const settings = await client.fetch(`
      *[_type == "siteSettings"][0] {
        _id,
        siteTitle,
        heroHeadline,
        heroSubheadline,
        heroMediaType,
        heroImages[]{ _key, "url": coalesce(asset->url, externalUrl), alt },
        "heroVideoUrl": heroVideo.asset->url,
        agentName,
        agentTitle,
        "agentPhoto": agentPhoto.asset->url,
        aboutHeadline,
        aboutText,
        aboutStats[]{ _key, value, label },
        phone,
        email,
        address,
        officeHours,
        instagram,
        facebook,
        linkedin,
        youtube,
        legalLinks[]{ _key, title, url },
        "iabsDocumentUrl": iabsDocument.asset->url,
        privacyPolicy,
        termsOfService,
        agentLicenseNumber,
        brokerName,
        brokerLicenseNumber,
        showFairHousing,
        "equalHousingLogo": equalHousingLogo.asset->url,
        "logo": logo.asset->url,
        "pwaIcon": pwaIcon.asset->url
      }
    `)

    // No settings document exists in Sanity
    if (!settings) {
      setDemoMode('No siteSettings document found in Sanity')
      return defaultSettings
    }

    // Success! Not in demo mode
    _isDemoMode = false
    _demoReason = null

    // Merge with defaults for any missing fields
    return {
      ...defaultSettings,
      ...settings,
      heroImages: settings.heroImages?.length > 0 ? settings.heroImages : defaultSettings.heroImages,
      aboutStats: settings.aboutStats?.length > 0 ? settings.aboutStats : defaultSettings.aboutStats,
      legalLinks: settings.legalLinks?.length > 0 ? settings.legalLinks : defaultSettings.legalLinks,
    }
  } catch (error) {
    // Sanity query failed - likely permissions issue with private dataset
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    setDemoMode(`Sanity query failed: ${errorMessage}`)
    console.error('getSettings() Sanity error:', error)
    return defaultSettings
  }
}

export async function getProperties(status?: string): Promise<Property[]> {
  if (!isSanityConfigured()) {
    setDemoMode('Sanity not configured')
    return status ? defaultProperties.filter(p => p.status === status) : defaultProperties
  }

  try {
    const client = getSanityClient()
    const filter = status
      ? `*[_type == "property" && status == $status]`
      : `*[_type == "property"]`

    const properties = await client.fetch(`
      ${filter} | order(_createdAt desc) {
        _id,
        title,
        "slug": slug.current,
        status,
        price,
        address,
        "neighborhood": neighborhood->name,
        "neighborhoodSlug": neighborhood->slug.current,
        beds,
        baths,
        sqft,
        lotSize,
        yearBuilt,
        garage,
        mlsNumber,
        "heroImage": heroImage.asset->url,
        heroVideo,
        gallery[]{ "url": asset->url, alt },
        "floorPlan": floorPlan.asset->url,
        documents[]{ title, "url": file.asset->url },
        shortDescription,
        description,
        features,
        seoTitle,
        seoDescription
      }
    `, status ? { status } : {})

    // No properties in Sanity - show demo
    if (!properties || properties.length === 0) {
      setDemoMode('No properties found in Sanity')
      return defaultProperties
    }

    return properties
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    setDemoMode(`Sanity properties query failed: ${errorMessage}`)
    console.error('getProperties() Sanity error:', error)
    return defaultProperties
  }
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!isSanityConfigured()) {
    return defaultProperties.find(p => p.slug === slug) || null
  }

  try {
    const client = getSanityClient()
    const property = await client.fetch(`
      *[_type == "property" && slug.current == $slug][0] {
        _id,
        title,
        "slug": slug.current,
        status,
        price,
        address,
        "neighborhood": neighborhood->name,
        "neighborhoodSlug": neighborhood->slug.current,
        beds,
        baths,
        sqft,
        lotSize,
        yearBuilt,
        garage,
        mlsNumber,
        "heroImage": heroImage.asset->url,
        heroVideo,
        gallery[]{ "url": asset->url, alt },
        "floorPlan": floorPlan.asset->url,
        documents[]{ title, "url": file.asset->url },
        shortDescription,
        description,
        features,
        seoTitle,
        seoDescription
      }
    `, { slug })

    // Not found in Sanity - check demo data
    if (!property) {
      return defaultProperties.find(p => p.slug === slug) || null
    }

    return property
  } catch (error) {
    console.error('getPropertyBySlug() Sanity error:', error)
    return defaultProperties.find(p => p.slug === slug) || null
  }
}

export async function getCities(): Promise<City[]> {
  if (!isSanityConfigured()) {
    setDemoMode('Sanity not configured')
    return fallbackCities
  }

  try {
    const client = getSanityClient()
    const cities = await client.fetch(`
      *[_type == "city"] | order(order asc) {
        _id,
        name,
        "slug": slug.current,
        description,
        "image": image.asset->url,
        order
      }
    `)

    if (!cities || cities.length === 0) {
      setDemoMode('No cities found in Sanity')
      return fallbackCities
    }

    return cities
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    setDemoMode(`Sanity cities query failed: ${errorMessage}`)
    console.error('getCities() Sanity error:', error)
    return fallbackCities
  }
}

export async function getCommunities(): Promise<Community[]> {
  if (!isSanityConfigured()) {
    setDemoMode('Sanity not configured')
    return fallbackCommunities
  }

  try {
    const client = getSanityClient()
    const communities = await client.fetch(`
      *[_type == "neighborhood" && isActive != false] | order(city->order asc, order asc) {
        _id,
        name,
        "slug": slug.current,
        city->{ _id, name, "slug": slug.current, description, order },
        tagline,
        vibe,
        description,
        population,
        commute,
        schoolDistrict,
        schools[]{ _key, name, type, rating, note },
        whyPeopleLove,
        highlights[]{ _key, name, description },
        avgPrice,
        "image": image.asset->url,
        gallery[]{ "url": asset->url, alt },
        order,
        isActive
      }
    `)

    // No communities in Sanity
    if (!communities || communities.length === 0) {
      setDemoMode('No communities found in Sanity')
      return fallbackCommunities
    }

    return communities
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    setDemoMode(`Sanity communities query failed: ${errorMessage}`)
    console.error('getCommunities() Sanity error:', error)
    return fallbackCommunities
  }
}

// Backward compatibility alias
export async function getNeighborhoods(): Promise<Community[]> {
  return getCommunities()
}

export async function getCommunityBySlug(slug: string): Promise<Community | null> {
  if (!isSanityConfigured()) {
    return fallbackCommunities.find(c => c.slug === slug) || null
  }

  try {
    const client = getSanityClient()
    const community = await client.fetch(`
      *[_type == "neighborhood" && slug.current == $slug][0] {
        _id,
        name,
        "slug": slug.current,
        city->{ _id, name, "slug": slug.current, description, order },
        tagline,
        vibe,
        description,
        population,
        commute,
        schoolDistrict,
        schools[]{ _key, name, type, rating, note },
        whyPeopleLove,
        highlights[]{ _key, name, description },
        avgPrice,
        "image": image.asset->url,
        gallery[]{ "url": asset->url, alt }
      }
    `, { slug })

    if (!community) {
      return fallbackCommunities.find(c => c.slug === slug) || null
    }

    return community
  } catch (error) {
    console.error('getCommunityBySlug() Sanity error:', error)
    return fallbackCommunities.find(c => c.slug === slug) || null
  }
}

// Backward compatibility alias
export async function getNeighborhoodBySlug(slug: string): Promise<Community | null> {
  return getCommunityBySlug(slug)
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price || 0)
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'for-sale': 'For Sale',
    'pending': 'Pending',
    'sold': 'Sold',
    'off-market': 'Off Market',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'for-sale': 'bg-green-100 text-green-700',
    'pending': 'bg-amber-100 text-amber-700',
    'sold': 'bg-blue-100 text-blue-700',
    'off-market': 'bg-neutral-100 text-neutral-700',
  }
  return colors[status] || 'bg-neutral-100 text-neutral-700'
}
