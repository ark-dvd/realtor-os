// ═══════════════════════════════════════════════════════════════════════════
// DATA FETCHERS - Sanity with Fallbacks
// ═══════════════════════════════════════════════════════════════════════════

import { getSanityClient, isSanityConfigured } from './sanity'
import { neighborhoods as fallbackNeighborhoods } from './neighborhoods-data'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

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
  trecLink?: string
  logo?: string
  primaryColor?: string
  accentColor?: string
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
  shortDescription?: string
  description?: string
  features?: string[]
}

export interface School {
  _key?: string
  name: string
  type: 'Elementary' | 'Middle' | 'High School'
  rating: number
  note?: string
}

export interface Neighborhood {
  _id?: string
  name: string
  slug: string
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
// DEFAULT DATA (Fallbacks)
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
  trecLink: 'https://www.trec.texas.gov/forms/consumer-protection-notice',
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
  {
    _id: 'demo-4',
    title: 'Zilker Modern Retreat',
    slug: 'zilker-modern-retreat',
    price: 1425000,
    address: { street: '789 Zilker Park Way', city: 'Austin', state: 'TX', zip: '78704' },
    neighborhood: 'Zilker',
    beds: 3,
    baths: 2.5,
    sqft: 2400,
    heroImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    status: 'pending',
    shortDescription: 'Contemporary design steps from Zilker Park',
  },
  {
    _id: 'demo-5',
    title: 'East Austin Bungalow',
    slug: 'east-austin-bungalow',
    price: 695000,
    address: { street: '456 E 6th Street', city: 'Austin', state: 'TX', zip: '78702' },
    neighborhood: 'East Austin',
    beds: 3,
    baths: 2,
    sqft: 1800,
    heroImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    status: 'for-sale',
    shortDescription: 'Charming bungalow in vibrant East Austin',
  },
  {
    _id: 'demo-6',
    title: 'Travis Heights Gem',
    slug: 'travis-heights-gem',
    price: 1125000,
    address: { street: '321 Travis Heights Blvd', city: 'Austin', state: 'TX', zip: '78704' },
    neighborhood: 'Travis Heights',
    beds: 4,
    baths: 3,
    sqft: 2800,
    heroImage: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80',
    status: 'for-sale',
    shortDescription: 'Beautiful home in iconic Travis Heights',
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// FETCH FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export async function getSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured()) {
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
        heroImages[] { _key, "url": coalesce(asset->url, externalUrl), alt, externalUrl },
        "heroVideoUrl": heroVideo.asset->url,
        agentName,
        agentTitle,
        "agentPhoto": agentPhoto.asset->url,
        aboutHeadline,
        aboutText,
        aboutStats[] { _key, value, label },
        phone,
        email,
        address,
        officeHours,
        instagram,
        facebook,
        linkedin,
        youtube,
        trecLink,
        "logo": logo.asset->url,
        primaryColor,
        accentColor
      }
    `)

    if (!settings) {
      return defaultSettings
    }

    // Merge with defaults - Sanity values override defaults
    return {
      ...defaultSettings,
      ...settings,
      // Ensure arrays have fallbacks
      heroImages: settings.heroImages?.length > 0 ? settings.heroImages : defaultSettings.heroImages,
      aboutStats: settings.aboutStats?.length > 0 ? settings.aboutStats : defaultSettings.aboutStats,
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    return defaultSettings
  }
}

export async function getProperties(status?: string): Promise<Property[]> {
  if (!isSanityConfigured()) {
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
        gallery[] { "url": asset->url, alt },
        shortDescription,
        description,
        features
      }
    `, { status })

    return properties?.length > 0 ? properties : defaultProperties
  } catch (error) {
    console.error('Error fetching properties:', error)
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
        gallery[] { "url": asset->url, alt },
        shortDescription,
        description,
        features
      }
    `, { slug })

    return property || defaultProperties.find(p => p.slug === slug) || null
  } catch (error) {
    console.error('Error fetching property:', error)
    return defaultProperties.find(p => p.slug === slug) || null
  }
}

export async function getNeighborhoods(): Promise<Neighborhood[]> {
  if (!isSanityConfigured()) {
    return fallbackNeighborhoods
  }

  try {
    const client = getSanityClient()
    const neighborhoods = await client.fetch(`
      *[_type == "neighborhood" && isActive != false] | order(order asc) {
        _id,
        name,
        "slug": slug.current,
        tagline,
        vibe,
        description,
        population,
        commute,
        schoolDistrict,
        schools[] { _key, name, type, rating, note },
        whyPeopleLove,
        highlights[] { _key, name, description },
        avgPrice,
        "image": image.asset->url,
        gallery[] { "url": asset->url, alt },
        order,
        isActive
      }
    `)

    return neighborhoods?.length > 0 ? neighborhoods : fallbackNeighborhoods
  } catch (error) {
    console.error('Error fetching neighborhoods:', error)
    return fallbackNeighborhoods
  }
}

export async function getNeighborhoodBySlug(slug: string): Promise<Neighborhood | null> {
  if (!isSanityConfigured()) {
    return fallbackNeighborhoods.find(n => n.slug === slug) || null
  }

  try {
    const client = getSanityClient()
    const neighborhood = await client.fetch(`
      *[_type == "neighborhood" && slug.current == $slug][0] {
        _id,
        name,
        "slug": slug.current,
        tagline,
        vibe,
        description,
        population,
        commute,
        schoolDistrict,
        schools[] { _key, name, type, rating, note },
        whyPeopleLove,
        highlights[] { _key, name, description },
        avgPrice,
        "image": image.asset->url,
        gallery[] { "url": asset->url, alt }
      }
    `, { slug })

    return neighborhood || fallbackNeighborhoods.find(n => n.slug === slug) || null
  } catch (error) {
    console.error('Error fetching neighborhood:', error)
    return fallbackNeighborhoods.find(n => n.slug === slug) || null
  }
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
