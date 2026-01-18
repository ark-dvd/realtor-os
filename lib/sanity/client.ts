// ═══════════════════════════════════════════════════════════════════════════
// SANITY CLIENT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImage, AgentSettings } from '@/lib/types'

// Environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

// Check if Sanity is configured
export const isSanityConfigured = Boolean(projectId && projectId !== 'your-project-id')

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK DEMO TENANT
// Used when Sanity is not configured
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_TENANT: AgentSettings = {
  _id: 'demo',
  _type: 'agentSettings',
  domain: 'demo.realtoros.com',
  agentName: 'Sarah Mitchell',
  agentTitle: 'Luxury Real Estate Specialist',
  brokerageName: 'Elite Properties',
  branding: {
    primaryColor: '#1A1A1A',
    secondaryColor: '#2D2D2D',
    accentColor: '#C9A962',
    fontHeading: 'Cormorant Garamond',
    fontBody: 'Plus Jakarta Sans',
  },
  contactInfo: {
    email: 'sarah@eliteproperties.com',
    phone: '(512) 555-0123',
    address: '123 Luxury Lane',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
  },
  heroTagline: 'Find Your Perfect Home',
  heroSubtagline: 'Exceptional properties, personalized service',
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT INSTANCES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Public client - uses CDN for faster reads
 * Use for: Property pages, public content, agent settings
 */
export const sanityClient = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: true, // CDN for public pages (ISR)
  perspective: 'published',
})

/**
 * Private client - bypasses CDN for real-time data
 * Use for: Client dashboard, private documents, authenticated content
 */
export const sanityClientPrivate = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: false, // No CDN for real-time data
  perspective: 'published',
  token: process.env.SANITY_API_TOKEN, // Required for private content
})

/**
 * Preview client - for draft content (Sanity Studio preview)
 */
export const sanityClientPreview = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_TOKEN,
})

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE URL BUILDER
// ─────────────────────────────────────────────────────────────────────────────

const builder = imageUrlBuilder(sanityClient)

/**
 * Generate optimized image URLs from Sanity images
 */
export function urlFor(source: SanityImage) {
  return builder.image(source)
}

/**
 * Get image URL with common presets
 */
export function getImageUrl(
  source: SanityImage | undefined | null,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  } = {}
): string {
  if (!source?.asset) {
    return '/images/placeholder-property.jpg'
  }

  let imageBuilder = urlFor(source)

  if (options.width) imageBuilder = imageBuilder.width(options.width)
  if (options.height) imageBuilder = imageBuilder.height(options.height)
  if (options.quality) imageBuilder = imageBuilder.quality(options.quality)
  if (options.format) imageBuilder = imageBuilder.format(options.format)
  if (options.fit) imageBuilder = imageBuilder.fit(options.fit)

  // Apply hotspot/crop if present
  if (source.hotspot || source.crop) {
    imageBuilder = imageBuilder.crop('focalpoint').fit('crop')
  }

  return imageBuilder.url()
}

// ─────────────────────────────────────────────────────────────────────────────
// FETCH HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch with tenant isolation
 * CRITICAL: Always use this for tenant-specific queries
 */
export async function fetchWithTenant<T>(
  query: string,
  domain: string,
  params: Record<string, unknown> = {},
  options: { preview?: boolean; realtime?: boolean } = {}
): Promise<T | null> {
  // Return null if Sanity is not configured
  if (!isSanityConfigured) {
    console.warn('Sanity not configured, returning null')
    return null
  }

  const client = options.preview
    ? sanityClientPreview
    : options.realtime
    ? sanityClientPrivate
    : sanityClient

  try {
    const result = await client.fetch<T>(query, { ...params, currentDomain: domain })
    return result
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return null
  }
}

/**
 * Generic fetch helper
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: { preview?: boolean; realtime?: boolean } = {}
): Promise<T | null> {
  // Return null if Sanity is not configured
  if (!isSanityConfigured) {
    console.warn('Sanity not configured, returning null')
    return null
  }

  const client = options.preview
    ? sanityClientPreview
    : options.realtime
    ? sanityClientPrivate
    : sanityClient

  try {
    const result = await client.fetch<T>(query, params)
    return result
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
}
