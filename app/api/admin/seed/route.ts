import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'
import { neighborhoods } from '@/lib/neighborhoods-data'

const ALLOW_SEED = process.env.ALLOW_SEED === 'true'

const sampleProperties = [
  { title: 'Modern Lakefront Estate', slug: 'modern-lakefront-estate', status: 'for-sale', price: 2850000, address: { street: '1234 Lake Austin Blvd', city: 'Austin', state: 'TX', zip: '78703' }, beds: 5, baths: 4.5, sqft: 4800, features: ['Lake Views', 'Pool', 'Smart Home'] },
  { title: 'Downtown Luxury Condo', slug: 'downtown-luxury-condo', status: 'for-sale', price: 975000, address: { street: '200 Congress Ave #2001', city: 'Austin', state: 'TX', zip: '78701' }, beds: 2, baths: 2, sqft: 1650, features: ['Capitol Views', 'Concierge'] },
]

const sampleDeals = [
  { clientName: 'John & Sarah Mitchell', clientEmail: 'mitchells@email.com', clientPhone: '(512) 555-1234', dealType: 'buying', propertyAddress: '1234 Lake Austin Blvd', price: 2850000, transactionStage: 4, isActive: true, keyDates: { contractDate: '2024-01-15', closingDate: '2024-02-28' } },
]

const siteSettingsData = { siteTitle: 'Merrav Berko Real Estate', heroHeadline: 'Find Your Home in Austin', heroSubheadline: 'Luxury real estate with personalized service.', agentName: 'Merrav Berko', agentTitle: 'REALTOR® | Austin Luxury Specialist', phone: '(512) 599-9995', email: 'merrav@merravberko.com', address: 'Austin, Texas', primaryColor: '#1B2B4B', accentColor: '#C9A961' }

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error
  if (!ALLOW_SEED) return NextResponse.json({ error: 'Seeding disabled. Set ALLOW_SEED=true' }, { status: 403 })
  try {
    const client = getSanityWriteClient()
    const results: Record<string, unknown> = {}
    
    const nCount = await client.fetch(`count(*[_type == "neighborhood"])`)
    if (nCount === 0) {
      for (let i = 0; i < neighborhoods.length; i++) {
        const n = neighborhoods[i]
        await client.create({ _type: 'neighborhood', name: n.name, slug: { _type: 'slug', current: n.slug }, tagline: n.tagline, vibe: n.vibe, description: n.description, population: n.population, commute: n.commute, schoolDistrict: n.schoolDistrict, schools: n.schools?.map((s, idx) => ({ _key: `s-${idx}`, ...s })), whyPeopleLove: n.whyPeopleLove, highlights: n.highlights?.map((h, idx) => ({ _key: `h-${idx}`, ...h })), avgPrice: n.avgPrice, order: i + 1, isActive: true })
      }
      results.neighborhoods = { created: neighborhoods.length }
    } else results.neighborhoods = { skipped: nCount }

    const pCount = await client.fetch(`count(*[_type == "property"])`)
    if (pCount === 0) {
      for (const p of sampleProperties) await client.create({ _type: 'property', ...p, slug: { _type: 'slug', current: p.slug } })
      results.properties = { created: sampleProperties.length }
    } else results.properties = { skipped: pCount }

    const dCount = await client.fetch(`count(*[_type == "activeDeal"])`)
    if (dCount === 0) {
      for (const d of sampleDeals) await client.create({ _type: 'activeDeal', ...d })
      results.deals = { created: sampleDeals.length }
    } else results.deals = { skipped: dCount }

    const sExists = await client.fetch(`*[_type == "siteSettings"][0]._id`)
    if (!sExists) {
      await client.create({ _type: 'siteSettings', ...siteSettingsData })
      results.settings = { created: true }
    } else results.settings = { skipped: true }

    return NextResponse.json({ success: true, results })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Seed failed' }, { status: 500 }) }
}
