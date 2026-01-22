import { createClient, SanityClient } from '@sanity/client'

// Get environment variables with fallbacks for build time
function getEnv(name: string, fallback: string = ''): string {
  return process.env[name] || fallback
}

// Configuration values - use fallbacks during build
const projectId = getEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'placeholder')
const dataset = getEnv('NEXT_PUBLIC_SANITY_DATASET', 'production')
const apiVersion = '2024-01-01'

// Lazy-initialized clients to avoid build-time errors
let _readClient: SanityClient | null = null
let _writeClient: SanityClient | null = null

// Read-only client for public pages (uses CDN for performance)
export function getSanityClient(): SanityClient {
  if (!_readClient) {
    const actualProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    if (!actualProjectId) {
      throw new Error('Missing required environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID')
    }
    _readClient = createClient({
      projectId: actualProjectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  }
  return _readClient
}

// Write client for admin operations (no CDN, requires token)
// Only use this in server-side code (API routes)
export function getSanityWriteClient(): SanityClient {
  if (!_writeClient) {
    const actualProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const token = process.env.SANITY_API_TOKEN
    
    if (!actualProjectId) {
      throw new Error('Missing required environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID')
    }
    if (!token) {
      throw new Error('Missing required environment variable: SANITY_API_TOKEN')
    }
    
    _writeClient = createClient({
      projectId: actualProjectId,
      dataset,
      apiVersion,
      useCdn: false,
      token,
    })
  }
  return _writeClient
}

// Legacy export for backwards compatibility - lazily initialized
export const sanityClient = {
  fetch: async (...args: Parameters<SanityClient['fetch']>) => {
    return getSanityClient().fetch(...args)
  },
}

// Check if Sanity is properly configured
export function isSanityConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.SANITY_API_TOKEN
  )
}
