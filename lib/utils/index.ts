// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─────────────────────────────────────────────────────────────────────────────
// CLASS NAME UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Merge Tailwind classes with conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─────────────────────────────────────────────────────────────────────────────
// FORMATTING UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format price in USD
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format price short (e.g., $1.2M)
 */
export function formatPriceShort(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`
  }
  if (price >= 1000) {
    return `$${(price / 1000).toFixed(0)}K`
  }
  return formatPrice(price)
}

/**
 * Format square feet
 */
export function formatSqFt(sqft: number): string {
  return new Intl.NumberFormat('en-US').format(sqft)
}

/**
 * Format address
 */
export function formatAddress(address: {
  street: string
  unit?: string
  city: string
  state: string
  zip: string
}): string {
  const parts = [address.street]
  if (address.unit) parts.push(`Unit ${address.unit}`)
  parts.push(`${address.city}, ${address.state} ${address.zip}`)
  return parts.join(', ')
}

/**
 * Format date
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...options,
  })
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get status badge color
 */
export function getStatusColor(status: string): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    active: { bg: 'bg-green-100', text: 'text-green-800' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    sold: { bg: 'bg-neutral-100', text: 'text-neutral-800' },
    coming_soon: { bg: 'bg-blue-100', text: 'text-blue-800' },
    off_market: { bg: 'bg-red-100', text: 'text-red-800' },
  }
  return colors[status] || { bg: 'bg-neutral-100', text: 'text-neutral-800' }
}

/**
 * Get human-readable status
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'For Sale',
    pending: 'Pending',
    sold: 'Sold',
    coming_soon: 'Coming Soon',
    off_market: 'Off Market',
  }
  return labels[status] || status
}

/**
 * Generate property summary
 */
export function getPropertySummary(specs: {
  bedrooms: number
  bathrooms: number
  squareFeet: number
}): string {
  return `${specs.bedrooms} Bed • ${specs.bathrooms} Bath • ${formatSqFt(specs.squareFeet)} Sq Ft`
}

// ─────────────────────────────────────────────────────────────────────────────
// URL UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate property URL
 */
export function getPropertyUrl(slug: string): string {
  return `/properties/${slug}`
}

/**
 * Check if URL is external
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Validate phone
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10
}

// ─────────────────────────────────────────────────────────────────────────────
// MISC UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Delay utility for animations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), ms)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= ms) {
      lastCall = now
      fn(...args)
    }
  }
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}
