import { createClient, SanityClient } from '@sanity/client'

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-01-01'

// Lazy-initialized clients
let _readClient: SanityClient | null = null
let _writeClient: SanityClient | null = null

/**
 * Read client for public pages.
 * Supports both public AND private datasets.
 * 
 * For PUBLIC datasets: No token needed
 * For PRIVATE datasets: Set SANITY_READ_TOKEN (can be same as write token)
 * 
 * useCdn: false ensures fresh data on every request.
 */
export function getSanityClient(): SanityClient {
  if (!_readClient) {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    if (!projectId) {
      throw new Error('SANITY_CONFIG_ERROR: Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
    }
    
    // Use read token if available (required for private datasets)
    const readToken = process.env.SANITY_READ_TOKEN || process.env.SANITY_API_TOKEN
    
    _readClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false, // CRITICAL: false = fresh data, true = cached up to 60s
      token: readToken, // Optional - only needed for private datasets
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
      throw new Error('SANITY_CONFIG_ERROR: Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
    }
    if (!token) {
      throw new Error('SANITY_CONFIG_ERROR: Missing SANITY_API_TOKEN (required for admin)')
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
 * Check if Sanity is configured for reading.
 */
export function isSanityConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
}

/**
 * Check if Sanity is configured for writing (admin).
 */
export function isSanityWriteConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.SANITY_API_TOKEN
  )
}

/**
 * Get Sanity configuration status for debugging.
 */
export function getSanityStatus(): {
  configured: boolean
  projectId: string | null
  dataset: string
  hasReadToken: boolean
  hasWriteToken: boolean
} {
  return {
    configured: isSanityConfigured(),
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || null,
    dataset,
    hasReadToken: Boolean(process.env.SANITY_READ_TOKEN || process.env.SANITY_API_TOKEN),
    hasWriteToken: Boolean(process.env.SANITY_API_TOKEN),
  }
}
