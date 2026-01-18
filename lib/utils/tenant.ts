// ═══════════════════════════════════════════════════════════════════════════
// TENANT UTILITIES
// Multi-tenancy helpers for domain detection and configuration
// ═══════════════════════════════════════════════════════════════════════════

import { headers } from 'next/headers'
import type { AgentSettings } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extract hostname from request headers (server-side)
 */
export function getHostnameFromHeaders(): string {
  const headersList = headers()
  
  // Check for forwarded host (Netlify, Vercel, etc.)
  const forwardedHost = headersList.get('x-forwarded-host')
  if (forwardedHost) {
    return normalizeHostname(forwardedHost)
  }
  
  // Check standard host header
  const host = headersList.get('host')
  if (host) {
    return normalizeHostname(host)
  }
  
  // Fallback for development
  return 'localhost'
}

/**
 * Normalize hostname (remove port, www, etc.)
 */
export function normalizeHostname(hostname: string): string {
  return hostname
    .toLowerCase()
    .replace(/:\d+$/, '') // Remove port
    .replace(/^www\./, '') // Remove www prefix
}

/**
 * Check if hostname is a development/preview domain
 */
export function isPreviewDomain(hostname: string): boolean {
  const previewPatterns = [
    'localhost',
    '127.0.0.1',
    '.netlify.app',
    '.vercel.app',
    'preview.',
    'staging.',
  ]
  
  return previewPatterns.some(pattern => hostname.includes(pattern))
}

/**
 * Get default tenant for preview/development
 */
export function getDefaultTenantDomain(): string {
  return process.env.DEFAULT_TENANT_DOMAIN || 'demo.realtoros.com'
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS VARIABLE GENERATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Generate color shades from a base color
 */
function generateColorShades(hex: string): Record<string, string> {
  const rgb = hexToRgb(hex)
  if (!rgb) return {}

  // Simple shade generation (you could use a more sophisticated algorithm)
  const shades: Record<string, string> = {}
  const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
  
  weights.forEach((weight, index) => {
    const factor = (index - 4) * 0.1 // Lighten for lower weights, darken for higher
    const adjustedR = Math.round(Math.max(0, Math.min(255, rgb.r + (255 - rgb.r) * -factor)))
    const adjustedG = Math.round(Math.max(0, Math.min(255, rgb.g + (255 - rgb.g) * -factor)))
    const adjustedB = Math.round(Math.max(0, Math.min(255, rgb.b + (255 - rgb.b) * -factor)))
    
    shades[weight] = `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`
  })

  return shades
}

/**
 * Generate CSS variables from tenant branding
 */
export function generateCssVariables(branding: AgentSettings['branding']): string {
  const vars: string[] = []

  // Primary color and shades
  if (branding.primaryColor) {
    vars.push(`--color-primary: ${branding.primaryColor}`)
    const rgb = hexToRgb(branding.primaryColor)
    if (rgb) {
      vars.push(`--color-primary-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b}`)
    }
    const shades = generateColorShades(branding.primaryColor)
    Object.entries(shades).forEach(([weight, value]) => {
      vars.push(`--color-primary-${weight}: ${value}`)
    })
  }

  // Secondary color
  if (branding.secondaryColor) {
    vars.push(`--color-secondary: ${branding.secondaryColor}`)
  }

  // Accent color
  if (branding.accentColor) {
    vars.push(`--color-accent: ${branding.accentColor}`)
  }

  // Fonts
  if (branding.fontHeading) {
    vars.push(`--font-heading: '${branding.fontHeading}', serif`)
  }
  if (branding.fontBody) {
    vars.push(`--font-body: '${branding.fontBody}', sans-serif`)
  }

  return vars.map(v => `${v};`).join('\n')
}

/**
 * Get Google Fonts URL for tenant fonts
 */
export function getGoogleFontsUrl(branding: AgentSettings['branding']): string {
  const fonts: string[] = []
  
  // Default fonts
  const defaultHeading = 'Cormorant+Garamond:wght@400;500;600;700'
  const defaultBody = 'Plus+Jakarta+Sans:wght@400;500;600;700'
  
  // Add heading font
  if (branding.fontHeading) {
    const fontName = branding.fontHeading.replace(/\s+/g, '+')
    fonts.push(`${fontName}:wght@400;500;600;700`)
  } else {
    fonts.push(defaultHeading)
  }
  
  // Add body font
  if (branding.fontBody) {
    const fontName = branding.fontBody.replace(/\s+/g, '+')
    fonts.push(`${fontName}:wght@400;500;600;700`)
  } else {
    fonts.push(defaultBody)
  }

  return `https://fonts.googleapis.com/css2?family=${fonts.join('&family=')}&display=swap`
}

// ─────────────────────────────────────────────────────────────────────────────
// TENANT VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate tenant configuration
 */
export function validateTenantConfig(config: Partial<AgentSettings>): string[] {
  const errors: string[] = []

  if (!config.domain) errors.push('Domain is required')
  if (!config.agentName) errors.push('Agent name is required')
  if (!config.brokerageName) errors.push('Brokerage name is required')
  if (!config.contactInfo?.email) errors.push('Contact email is required')
  if (!config.contactInfo?.phone) errors.push('Contact phone is required')

  return errors
}

// ─────────────────────────────────────────────────────────────────────────────
// TENANT CACHE KEY GENERATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate cache key for tenant config
 */
export function getTenantCacheKey(domain: string): string {
  return `tenant_config_${normalizeHostname(domain)}`
}

/**
 * Generate cache key for tenant properties
 */
export function getPropertiesCacheKey(domain: string): string {
  return `tenant_properties_${normalizeHostname(domain)}`
}
