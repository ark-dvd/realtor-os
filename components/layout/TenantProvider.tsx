'use client'

// ═══════════════════════════════════════════════════════════════════════════
// TENANT PROVIDER
// Provides tenant configuration and dynamic theming via React Context
// ═══════════════════════════════════════════════════════════════════════════

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { AgentSettings, TenantContextType } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  isLoading: true,
  error: null,
})

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS VARIABLE INJECTION
// ─────────────────────────────────────────────────────────────────────────────

function injectCssVariables(branding: AgentSettings['branding']) {
  const root = document.documentElement

  // Primary color
  if (branding.primaryColor) {
    root.style.setProperty('--color-primary', branding.primaryColor)
    
    // Extract RGB for rgba() usage
    const hex = branding.primaryColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    root.style.setProperty('--color-primary-rgb', `${r}, ${g}, ${b}`)
    
    // Generate shades
    generateAndSetShades(root, '--color-primary', branding.primaryColor)
  }

  // Secondary color
  if (branding.secondaryColor) {
    root.style.setProperty('--color-secondary', branding.secondaryColor)
  }

  // Accent color
  if (branding.accentColor) {
    root.style.setProperty('--color-accent', branding.accentColor)
    
    // Generate lighter/darker variants
    root.style.setProperty('--color-accent-light', lightenColor(branding.accentColor, 30))
    root.style.setProperty('--color-accent-dark', darkenColor(branding.accentColor, 20))
  }

  // Fonts
  if (branding.fontHeading) {
    root.style.setProperty('--font-heading', `'${branding.fontHeading}', serif`)
  }
  if (branding.fontBody) {
    root.style.setProperty('--font-body', `'${branding.fontBody}', sans-serif`)
  }
}

function generateAndSetShades(root: HTMLElement, prefix: string, hex: string) {
  const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
  
  weights.forEach((weight, index) => {
    // Simple shade calculation
    const lightness = 95 - (index * 10) // 95 to 5
    const shade = adjustLightness(hex, lightness)
    root.style.setProperty(`${prefix}-${weight}`, shade)
  })
}

function lightenColor(hex: string, percent: number): string {
  return adjustLightness(hex, 50 + percent / 2)
}

function darkenColor(hex: string, percent: number): string {
  return adjustLightness(hex, 50 - percent / 2)
}

function adjustLightness(hex: string, targetLightness: number): string {
  // Convert hex to HSL, adjust lightness, convert back
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  hsl.l = targetLightness / 100
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l)
  
  return `rgb(${Math.round(newRgb.r)}, ${Math.round(newRgb.g)}, ${Math.round(newRgb.b)})`
}

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

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h, s, l }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return { r: r * 255, g: g * 255, b: b * 255 }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface TenantProviderProps {
  children: React.ReactNode
  initialTenant?: AgentSettings | null
}

export function TenantProvider({ children, initialTenant = null }: TenantProviderProps) {
  const [tenant, setTenant] = useState<AgentSettings | null>(initialTenant)
  const [isLoading, setIsLoading] = useState(!initialTenant)
  const [error, setError] = useState<string | null>(null)

  // Fetch tenant config if not provided
  useEffect(() => {
    if (initialTenant) {
      // Apply CSS variables
      if (initialTenant.branding) {
        injectCssVariables(initialTenant.branding)
      }
      return
    }

    async function fetchTenantConfig() {
      try {
        const response = await fetch('/api/tenant-config')
        if (!response.ok) {
          throw new Error('Failed to fetch tenant configuration')
        }
        const data = await response.json()
        
        if (data.success && data.data) {
          setTenant(data.data)
          if (data.data.branding) {
            injectCssVariables(data.data.branding)
          }
        } else {
          throw new Error(data.error || 'Unknown error')
        }
      } catch (err) {
        console.error('Error fetching tenant config:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTenantConfig()
  }, [initialTenant])

  // Update CSS variables when tenant changes
  useEffect(() => {
    if (tenant?.branding) {
      injectCssVariables(tenant.branding)
    }
  }, [tenant])

  return (
    <TenantContext.Provider value={{ tenant, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER COMPONENT HELPER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate inline style tag for SSR
 * Use this in layout.tsx for initial render without FOUC
 */
export function generateTenantStyleTag(branding: AgentSettings['branding']): string {
  const vars: string[] = []

  if (branding.primaryColor) {
    vars.push(`--color-primary: ${branding.primaryColor}`)
    const hex = branding.primaryColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    vars.push(`--color-primary-rgb: ${r}, ${g}, ${b}`)
  }

  if (branding.secondaryColor) {
    vars.push(`--color-secondary: ${branding.secondaryColor}`)
  }

  if (branding.accentColor) {
    vars.push(`--color-accent: ${branding.accentColor}`)
  }

  if (branding.fontHeading) {
    vars.push(`--font-heading: '${branding.fontHeading}', serif`)
  }

  if (branding.fontBody) {
    vars.push(`--font-body: '${branding.fontBody}', sans-serif`)
  }

  return `:root { ${vars.join('; ')} }`
}
