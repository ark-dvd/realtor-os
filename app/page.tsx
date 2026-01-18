// ═══════════════════════════════════════════════════════════════════════════
// HOME PAGE
// Main landing page with hero, featured properties, and about section
// ═══════════════════════════════════════════════════════════════════════════

import { CinematicHero } from '@/components/home/CinematicHero'
import { AboutSection } from '@/components/home/AboutSection'
import { DEMO_TENANT } from '@/lib/sanity/client'

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────

export const metadata = {
  title: 'RealtorOS - Luxury Real Estate',
  description: 'Discover exceptional properties with personalized service',
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const tenant = DEMO_TENANT

  // Hero image from Unsplash
  const heroImageUrl = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85'

  return (
    <>
      {/* Hero Section */}
      <CinematicHero
        imageUrl={heroImageUrl}
        posterUrl={heroImageUrl}
        tagline={tenant?.heroTagline || 'Find Your Perfect Home'}
        subtagline={tenant?.heroSubtagline || 'Exceptional properties, personalized service'}
        ctaText="View Properties"
        ctaHref="/properties"
        showScrollIndicator
      />

      {/* About Section */}
      <AboutSection />

      {/* CTA Section */}
      <section className="section-dramatic bg-neutral-charcoal text-white grain-overlay">
        <div className="container-cinematic text-center relative z-10">
          <span className="inline-block w-12 h-px bg-accent-gold mb-8" />
          <h2 className="font-heading text-display-md mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8 text-lg">
            Whether you&apos;re buying, selling, or just exploring, I&apos;m here to guide you every step of the way.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/contact" className="btn-accent">
              Schedule a Consultation
            </a>
            <a href="/properties" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-neutral-charcoal">
              Browse Properties
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
