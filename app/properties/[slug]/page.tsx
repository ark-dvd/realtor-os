// ═══════════════════════════════════════════════════════════════════════════
// SINGLE PROPERTY PAGE
// "The Story" - Editorial-style property presentation
// ═══════════════════════════════════════════════════════════════════════════

import Link from 'next/link'
import type { Metadata } from 'next'

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Property Details',
  description: 'View property details and schedule a tour',
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function PropertyPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-neutral-charcoal text-white">
        <div className="container-cinematic text-center">
          <span className="inline-block w-12 h-px bg-accent-gold mb-6" />
          <h1 className="font-heading text-display-lg mb-6">
            Property Details
          </h1>
          <p className="text-white/70 text-xl mb-8">
            Connect your Sanity CMS to view property details
          </p>
          <p className="text-white/50 text-sm">
            Property Slug: {params.slug}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-dramatic bg-neutral-cream">
        <div className="container-cinematic">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white p-12 border border-neutral-pearl">
              <div className="text-6xl mb-6">🏠</div>
              <h2 className="font-heading text-2xl text-neutral-charcoal mb-4">
                Sanity CMS Required
              </h2>
              <p className="text-neutral-silver mb-8">
                To view property details, please configure your Sanity CMS and add properties through the Sanity Studio.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/properties" className="btn-primary">
                  <span>Back to Properties</span>
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Contact Agent
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
