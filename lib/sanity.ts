import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Check if Sanity is configured
export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && 
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== ''
)

// Read-only client for public pages (uses CDN)
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Write client for mutations (no CDN, requires token)
export const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Image URL builder
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  if (!source) return null
  return builder.image(source)
}

// ═══════════════════════════════════════════════════════════════════════════
// NEIGHBORHOODS QUERIES
// ═══════════════════════════════════════════════════════════════════════════

export async function getNeighborhoods() {
  if (!isSanityConfigured) return null
  
  return sanityClient.fetch(`
    *[_type == "neighborhood" && isActive == true] | order(order asc) {
      _id,
      name,
      "slug": slug.current,
      tagline,
      vibe,
      description,
      population,
      commute,
      schoolDistrict,
      schools,
      whyPeopleLove,
      highlights,
      avgPrice,
      image,
      gallery,
      order
    }
  `)
}

export async function getNeighborhoodBySlug(slug: string) {
  if (!isSanityConfigured) return null
  
  return sanityClient.fetch(`
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
      schools,
      whyPeopleLove,
      highlights,
      avgPrice,
      image,
      gallery
    }
  `, { slug })
}

export async function getAllNeighborhoodSlugs() {
  if (!isSanityConfigured) return []
  
  return sanityClient.fetch(`
    *[_type == "neighborhood" && isActive == true].slug.current
  `)
}

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTIES QUERIES
// ═══════════════════════════════════════════════════════════════════════════

export async function getProperties(status?: string) {
  if (!isSanityConfigured) return null
  
  const filter = status 
    ? `*[_type == "property" && status == $status]`
    : `*[_type == "property" && status != "off-market"]`
  
  return sanityClient.fetch(`
    ${filter} | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      status,
      price,
      address,
      beds,
      baths,
      sqft,
      heroImage,
      "neighborhoodName": neighborhood->name
    }
  `, { status })
}

export async function getPropertyBySlug(slug: string) {
  if (!isSanityConfigured) return null
  
  return sanityClient.fetch(`
    *[_type == "property" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      status,
      price,
      address,
      beds,
      baths,
      sqft,
      lotSize,
      yearBuilt,
      garage,
      mlsNumber,
      shortDescription,
      description,
      features,
      heroImage,
      heroVideo,
      gallery,
      floorPlan,
      documents,
      "neighborhood": neighborhood->{name, "slug": slug.current}
    }
  `, { slug })
}

export async function getAllPropertySlugs() {
  if (!isSanityConfigured) return []
  
  return sanityClient.fetch(`
    *[_type == "property"].slug.current
  `)
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTIVE DEALS QUERIES
// ═══════════════════════════════════════════════════════════════════════════

export async function getActiveDeals() {
  if (!isSanityConfigured) return null
  
  return sanityClient.fetch(`
    *[_type == "activeDeal" && isActive == true] | order(_createdAt desc) {
      _id,
      clientName,
      clientEmail,
      clientPhone,
      dealType,
      propertyAddress,
      price,
      transactionStage,
      keyDates,
      notes,
      "property": property->{title, "slug": slug.current}
    }
  `)
}

export async function getDealByClientEmail(email: string) {
  if (!isSanityConfigured) return null
  
  return sanityClient.fetch(`
    *[_type == "activeDeal" && clientEmail == $email && isActive == true][0] {
      _id,
      clientName,
      clientEmail,
      dealType,
      propertyAddress,
      price,
      transactionStage,
      keyDates,
      documents[!isPrivate] {
        title,
        "url": asset->url
      },
      "property": property->{title, "slug": slug.current, heroImage}
    }
  `, { email })
}

// ═══════════════════════════════════════════════════════════════════════════
// SITE SETTINGS QUERIES
// ═══════════════════════════════════════════════════════════════════════════

export async function getSiteSettings() {
  if (!isSanityConfigured) return null
  
  return sanityClient.fetch(`
    *[_type == "siteSettings"][0] {
      siteTitle,
      heroHeadline,
      heroSubheadline,
      heroMediaType,
      heroImages,
      heroVideo,
      heroVideoUrl,
      agentName,
      agentTitle,
      agentPhoto,
      aboutHeadline,
      aboutText,
      aboutStats,
      phone,
      email,
      address,
      officeHours,
      logo,
      primaryColor,
      accentColor,
      instagram,
      facebook,
      linkedin,
      youtube,
      trecLink
    }
  `)
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN QUERIES (for Back Office)
// ═══════════════════════════════════════════════════════════════════════════

export async function getAllNeighborhoodsAdmin() {
  if (!isSanityConfigured) return null
  
  return sanityClient.fetch(`
    *[_type == "neighborhood"] | order(order asc) {
      _id,
      name,
      "slug": slug.current,
      avgPrice,
      isActive,
      order,
      image
    }
  `)
}

export async function getAllPropertiesAdmin() {
  if (!isSanityConfigured) return null
  
  return sanityClient.fetch(`
    *[_type == "property"] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      status,
      price,
      address,
      beds,
      baths,
      sqft,
      heroImage,
      _createdAt,
      _updatedAt
    }
  `)
}

export async function getAllDealsAdmin() {
  if (!isSanityConfigured) return null
  
  return sanityClient.fetch(`
    *[_type == "activeDeal"] | order(_createdAt desc) {
      _id,
      clientName,
      clientEmail,
      dealType,
      propertyAddress,
      price,
      transactionStage,
      keyDates,
      isActive,
      "property": property->{title}
    }
  `)
}
