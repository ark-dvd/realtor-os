// ═══════════════════════════════════════════════════════════════════════════
// HOME PAGE
// Main landing page with hero, featured properties, and about section
// ═══════════════════════════════════════════════════════════════════════════

import { headers } from 'next/headers'
import { sanityClient, getImageUrl, isSanityConfigured, DEMO_TENANT } from '@/lib/sanity/client'
import { AGENT_SETTINGS_BY_DOMAIN, ACTIVE_PROPERTIES_BY_TENANT } from '@/lib/sanity/queries'
import { CinematicHero } from '@/components/home/CinematicHero'
import { FeaturedProperties } from '@/components/home/FeaturedProperties'
import { AboutSection } from '@/components/home/AboutSection'
import type { AgentSettings, PropertyCard } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// DATA FETCHING
// ─────────────────────────────────────────────────────────────────────────────

async function getPageData() {
  // Return demo data if Sanity is not configured
  if (!isSanityConfigured) {
    return { 
      tenant: DEMO_TENANT, 
      properties: [] 
    }
  }

  const headersList = headers()
  const domain = headersList.get('x-tenant-domain') || 
                 process.env.DEFAULT_TENANT_DOMAIN ||
                 'demo.realtoros.com'

  try {
    const [tenant, properties] = await Promise.all([
      sanityClient.fetch<AgentSettings>(
        AGENT_SETTINGS_BY_DOMAIN,
        { currentDomain: domain },
        { next: { revalidate: 60 } }
      ),
      sanityClient.fetch<PropertyCard[]>(
        ACTIVE_PROPERTIES_BY_TENANT,
        { currentDomain: domain },
        { next: { revalidate: 60 } }
      ),
    ])

    return { 
      tenant: tenant || DEMO_TENANT, 
      properties: properties || [] 
    }
  } catch (error) {
    console.error('Error fetching page data:', error)
    return { 
      tenant: DEMO_TENANT, 
      properties: [] 
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata() {
  const { tenant } = await getPageData()
  
  return {
    title: tenant?.seoTitle || `${tenant?.agentName || 'RealtorOS'} - Luxury Real Estate`,
    description: tenant?.seoDescription || 'Discover exceptional properties with personalized service',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { tenant, properties } = await getPageData()

  // Determine hero media - use Unsplash as fallback
  const heroVideoUrl = tenant?.heroVideo?.url
  const heroImageUrl = tenant?.heroImage 
    ? getImageUrl(tenant.heroImage, { width: 1920, quality: 85 })
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85'
  const heroPosterUrl = tenant?.heroVideo?.posterImage
    ? getImageUrl(tenant.heroVideo.posterImage, { width: 1920, quality: 85 })
    : heroImageUrl

  // Featured properties (first 6)
  const featuredProperties = properties.slice(0, 6)

  return (
    <>
      {/* Hero Section */}
      <CinematicHero
        videoUrl={heroVideoUrl}
        imageUrl={heroImageUrl}
        posterUrl={heroPosterUrl}
        tagline={tenant?.heroTagline || 'Find Your Perfect Home'}
        subtagline={tenant?.heroSubtagline || 'Exceptional properties, personalized service'}
        ctaText="View Properties"
        ctaHref="/properties"
        showScrollIndicator
      />

      {/* Featured Properties - only show if we have properties */}
      {featuredProperties.length > 0 && (
        <FeaturedProperties
          properties={featuredProperties}
          title="Featured Properties"
          subtitle="Handpicked listings that define luxury living"
          showViewAll={properties.length > 6}
        />
      )}

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
