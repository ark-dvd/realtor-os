import { createClient, SanityClient } from '@sanity/client'

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-01-01'

// Lazy-initialized clients
let _readClient: SanityClient | null = null
let _writeClient: SanityClient | null = null

/**
 * Read-only client for public pages.
 * useCdn: false ensures fresh data on every request (no Sanity edge caching).
 * No token required - reads from public dataset.
 */
export function getSanityClient(): SanityClient {
  if (!_readClient) {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    if (!projectId) {
      throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
    }
    _readClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false, // CRITICAL: false = fresh data, true = cached up to 60s
    })
  }
  return _readClient
}

/**
 * Write client for admin operations.
 * Requires SANITY_API_TOKEN (server-side only).
 */
export function getSanityWriteClient(): SanityClient {
  if (!_writeClient) {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const token = process.env.SANITY_API_TOKEN
    if (!projectId) {
      throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
    }
    if (!token) {
      throw new Error('Missing SANITY_API_TOKEN')
    }
    _writeClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token,
    })
  }
  return _writeClient
}

/**
 * Check if Sanity is configured for reading (public pages).
 * Only requires project ID - no token needed for public reads.
 */
export function isSanityConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
}

/**
 * Check if Sanity is configured for writing (admin).
 * Requires both project ID and write token.
 */
export function isSanityWriteConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.SANITY_API_TOKEN
  )
}
