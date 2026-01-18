// ═══════════════════════════════════════════════════════════════════════════
// ROOT LAYOUT
// Main application layout with tenant theming
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata, Viewport } from 'next'
import './globals.css'

import { TenantProvider, generateTenantStyleTag } from '@/components/layout/TenantProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DEMO_TENANT } from '@/lib/sanity/client'

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    template: '%s | RealtorOS',
    default: 'RealtorOS - Luxury Real Estate',
  },
  description: 'Discover exceptional properties with personalized service',
  keywords: ['real estate', 'luxury homes', 'property', 'realtor'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A1A1A',
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Use demo tenant for now (Sanity integration can be added later)
  const tenant = DEMO_TENANT

  // Generate inline styles
  const tenantStyles = tenant?.branding 
    ? generateTenantStyleTag(tenant.branding)
    : ''

  // Google Fonts URL
  const fontsUrl = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontsUrl} rel="stylesheet" />

        {/* Tenant CSS Variables */}
        {tenantStyles && (
          <style dangerouslySetInnerHTML={{ __html: tenantStyles }} />
        )}

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-neutral-cream antialiased">
        <TenantProvider initialTenant={tenant}>
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="min-h-screen">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </TenantProvider>
      </body>
    </html>
  )
}
