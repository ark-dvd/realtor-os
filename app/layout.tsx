// ═══════════════════════════════════════════════════════════════════════════
// ROOT LAYOUT
// Main application layout with tenant theming
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import './globals.css'

import { TenantProvider, generateTenantStyleTag } from '@/components/layout/TenantProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { sanityClient, isSanityConfigured, DEMO_TENANT } from '@/lib/sanity/client'
import { AGENT_SETTINGS_BY_DOMAIN } from '@/lib/sanity/queries'
import type { AgentSettings } from '@/lib/types'

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
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A1A1A',
}

// ─────────────────────────────────────────────────────────────────────────────
// TENANT FETCHING
// ─────────────────────────────────────────────────────────────────────────────

async function getTenantConfig(): Promise<AgentSettings> {
  // If Sanity is not configured, return demo tenant
  if (!isSanityConfigured) {
    return DEMO_TENANT
  }

  const headersList = headers()
  const domain = headersList.get('x-tenant-domain') || 
                 headersList.get('x-forwarded-host')?.replace(/:\d+$/, '').replace(/^www\./, '') ||
                 process.env.DEFAULT_TENANT_DOMAIN ||
                 'demo.realtoros.com'

  try {
    const tenant = await sanityClient.fetch<AgentSettings>(
      AGENT_SETTINGS_BY_DOMAIN,
      { currentDomain: domain },
      { 
        next: { revalidate: 60 } // ISR: revalidate every 60 seconds
      }
    )
    return tenant || DEMO_TENANT
  } catch (error) {
    console.error('Error fetching tenant config:', error)
    return DEMO_TENANT
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tenant = await getTenantConfig()

  // Generate inline styles for SSR (prevents FOUC)
  const tenantStyles = tenant?.branding 
    ? generateTenantStyleTag(tenant.branding)
    : ''

  // Google Fonts URL
  const fontsUrl = tenant?.branding
    ? `https://fonts.googleapis.com/css2?family=${
        (tenant.branding.fontHeading || 'Cormorant+Garamond').replace(/\s+/g, '+')
      }:wght@400;500;600;700&family=${
        (tenant.branding.fontBody || 'Plus+Jakarta+Sans').replace(/\s+/g, '+')
      }:wght@400;500;600;700&display=swap`
    : 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'

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
        {tenant?.branding?.faviconUrl ? (
          <link rel="icon" href={tenant.branding.faviconUrl} />
        ) : (
          <link rel="icon" href="/favicon.ico" />
        )}

        {/* SEO Meta */}
        {tenant?.seoTitle && (
          <meta property="og:title" content={tenant.seoTitle} />
        )}
        {tenant?.seoDescription && (
          <meta property="og:description" content={tenant.seoDescription} />
        )}
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
