// ═══════════════════════════════════════════════════════════════════════════
// PROPERTIES PAGE
// Listing page with filters and grid display
// ═══════════════════════════════════════════════════════════════════════════

import { headers } from 'next/headers'
import { sanityClient } from '@/lib/sanity/client'
import { PROPERTIES_BY_TENANT } from '@/lib/sanity/queries'
import { PropertiesGrid } from './PropertiesGrid'
import type { PropertyCard } from '@/lib/types'
import type { Metadata } from 'next'

// ─────────────────────────────────────────────────────────────────────────────
// DATA FETCHING
// ─────────────────────────────────────────────────────────────────────────────

async function getProperties() {
  const headersList = headers()
  const domain = headersList.get('x-tenant-domain') || 
                 process.env.DEFAULT_TENANT_DOMAIN ||
                 'demo.realtoros.com'

  const properties = await sanityClient.fetch<PropertyCard[]>(
    PROPERTIES_BY_TENANT,
    { currentDomain: domain },
    { next: { revalidate: 60 } }
  )

  return properties || []
}

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Properties',
  description: 'Browse our collection of exceptional properties',
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default async function PropertiesPage() {
  const properties = await getProperties()

  return (
    <>
      {/* Hero Banner */}
      <section className="pt-32 pb-16 bg-neutral-charcoal text-white">
        <div className="container-cinematic text-center">
          <span className="inline-block w-12 h-px bg-accent-gold mb-6" />
          <h1 className="font-heading text-display-lg mb-4">
            Our Properties
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-lg">
            Discover exceptional homes that define luxury living
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="section-dramatic bg-neutral-cream">
        <div className="container-cinematic">
          <PropertiesGrid initialProperties={properties} />
        </div>
      </section>
    </>
  )
}
