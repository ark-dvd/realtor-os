import { createClient } from '@sanity/client'

// Validate required environment variables
function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function getOptionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue
}

// Read-only client for public pages (uses CDN for performance)
export const sanityClient = createClient({
  projectId: getRequiredEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: getOptionalEnv('NEXT_PUBLIC_SANITY_DATASET', 'production'),
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Write client for admin operations (no CDN, requires token)
// Only use this in server-side code (API routes)
export function getSanityWriteClient() {
  return createClient({
    projectId: getRequiredEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
    dataset: getOptionalEnv('NEXT_PUBLIC_SANITY_DATASET', 'production'),
    apiVersion: '2024-01-01',
    useCdn: false,
    token: getRequiredEnv('SANITY_API_TOKEN'),
  })
}

// Check if Sanity is properly configured
export function isSanityConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.SANITY_API_TOKEN
  )
}
