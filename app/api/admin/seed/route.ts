import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'
import { neighborhoods } from '@/lib/neighborhoods-data'

// PRODUCTION SAFETY: Only allow seeding when explicitly enabled
const ALLOW_SEED = process.env.ALLOW_SEED === 'true'

const sampleProperties = [
  { title: 'Modern Lakefront Estate', slug: 'modern-lakefront-estate', status: 'for-sale', price: 2850000, address: { street: '1234 Lake Austin Blvd', city: 'Austin', state: 'TX', zip: '78703' }, beds: 5, baths: 4.5, sqft: 4800, features: ['Lake Views', 'Pool', 'Smart Home'] },
  { title: 'Downtown Luxury Condo', slug: 'downtown-luxury-condo', status: 'for-sale', price: 975000, address: { street: '200 Congress Ave #2001', city: 'Austin', state: 'TX', zip: '78701' }, beds: 2, baths: 2, sqft: 1650, features: ['Capitol Views', 'Concierge'] },
  { title: 'Tarrytown Family Home', slug: 'tarrytown-family-home', status: 'pending', price: 1650000, address: { street: '3456 Windsor Rd', city: 'Austin', state: 'TX', zip: '78703' }, beds: 4, baths: 3, sqft: 3200, features: ['Large Backyard', 'Updated Kitchen'] },
]

const sampleDeals = [
  { clientName: 'John & Sarah Mitchell', clientEmail: 'mitchells@email.com', clientPhone: '(512) 555-1234', dealType: 'buying', propertyAddress: '1234 Lake Austin Blvd', price: 2850000, transactionStage: 4, isActive: true, keyDates: { contractDate: '2024-01-15', closingDate: '2024-02-28' } },
  { clientName: 'Emily Rodriguez', clientEmail: 'emily.r@email.com', clientPhone: '(512) 555-5678', dealType: 'selling', propertyAddress: '456 Oak Lane, Westlake', price: 1875000, transactionStage: 6, isActive: true, keyDates: { contractDate: '2024-01-10', closingDate: '2024-02-15' } },
]

const siteSettingsData = {
  siteTitle: 'Merrav Berko Real Estate',
  heroHeadline: 'Find Your Home in Austin',
  heroSubheadline: 'Luxury real estate with personalized service.',
  heroMediaType: 'images',
  agentName: 'Merrav Berko',
  agentTitle: 'REALTOR® | Austin Luxury Specialist',
  aboutText: 'Merrav Berko brings over 12 years of Austin experience to real estate.',
  aboutStats: [{ _key: 'stat-1', value: '12+', label: 'Years in Austin' }, { _key: 'stat-2', value: '$50M+', label: 'in Transactions' }],
  phone: '(512) 599-9995',
  email: 'merrav@merravberko.com',
  address: 'Austin, Texas',
  primaryColor: '#1B2B4B',
  accentColor: '#C9A961',
}

export async function POST(request: NextRequest) {
  // Require authentication
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  // PRODUCTION SAFETY: Check if seeding is allowed
  if (!ALLOW_SEED) {
    return NextResponse.json(
      { error: 'Seeding is disabled in production. Set ALLOW_SEED=true to enable.' },
      { status: 403 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const client = getSanityWriteClient()
    const results: Record<string, unknown> = {}

    // Seed Neighborhoods
    if (type === 'all' || type === 'neighborhoods') {
      const existing = await client.fetch(`count(*[_type == "neighborhood"])`)
      if (existing === 0) {
        for (let i = 0; i < neighborhoods.length; i++) {
          const n = neighborhoods[i]
          await client.create({
            _type: 'neighborhood',
            name: n.name,
            slug: { _type: 'slug', current: n.slug },
            tagline: n.tagline,
            vibe: n.vibe,
            description: n.description,
            population: n.population,
            commute: n.commute,
            schoolDistrict: n.schoolDistrict,
            schools: n.schools?.map((s, idx) => ({ _key: `school-${idx}`, ...s })),
            whyPeopleLove: n.whyPeopleLove,
            highlights: n.highlights?.map((h, idx) => ({ _key: `highlight-${idx}`, ...h })),
            avgPrice: n.avgPrice,
            order: i + 1,
            isActive: true,
          })
        }
        results.neighborhoods = { created: neighborhoods.length }
      } else {
        results.neighborhoods = { skipped: existing, reason: 'Already exists' }
      }
    }

    // Seed Properties
    if (type === 'all' || type === 'properties') {
      const existing = await client.fetch(`count(*[_type == "property"])`)
      if (existing === 0) {
        for (const p of sampleProperties) {
          await client.create({ _type: 'property', ...p, slug: { _type: 'slug', current: p.slug } })
        }
        results.properties = { created: sampleProperties.length }
      } else {
        results.properties = { skipped: existing, reason: 'Already exists' }
      }
    }

    // Seed Deals
    if (type === 'all' || type === 'deals') {
      const existing = await client.fetch(`count(*[_type == "activeDeal"])`)
      if (existing === 0) {
        for (const d of sampleDeals) {
          await client.create({ _type: 'activeDeal', ...d })
        }
        results.deals = { created: sampleDeals.length }
      } else {
        results.deals = { skipped: existing, reason: 'Already exists' }
      }
    }

    // Seed Settings
    if (type === 'all' || type === 'settings') {
      const existing = await client.fetch(`*[_type == "siteSettings"][0]._id`)
      if (!existing) {
        await client.create({ _type: 'siteSettings', ...siteSettingsData })
        results.settings = { created: true }
      } else {
        results.settings = { skipped: true, reason: 'Already exists' }
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Error seeding data:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}

// IMPORTANT: No DELETE method - removing data should be done through Sanity Studio
// or individual delete operations through the specific entity endpoints
