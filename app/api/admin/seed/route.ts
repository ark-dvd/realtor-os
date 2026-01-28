import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'
import { cities, communities } from '@/lib/communities-data'

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

    // Seed cities first
    const cityCount = await client.fetch(`count(*[_type == "city"])`)
    const cityIdMap: Record<string, string> = {}
    if (cityCount === 0) {
      for (const c of cities) {
        const created = await client.create({ _type: 'city', name: c.name, slug: { _type: 'slug', current: c.slug }, description: c.description, order: c.order })
        cityIdMap[c.slug] = created._id
      }
      results.cities = { created: cities.length }
    } else {
      // Fetch existing city IDs
      const existingCities = await client.fetch(`*[_type == "city"]{ _id, "slug": slug.current }`)
      for (const ec of existingCities) cityIdMap[ec.slug] = ec._id
      results.cities = { skipped: cityCount }
    }

    // Seed communities with city references
    const nCount = await client.fetch(`count(*[_type == "neighborhood"])`)
    if (nCount === 0) {
      for (let i = 0; i < communities.length; i++) {
        const n = communities[i]
        const cityId = cityIdMap[n.citySlug]
        await client.create({
          _type: 'neighborhood',
          name: n.name,
          slug: { _type: 'slug', current: n.slug },
          city: cityId ? { _type: 'reference', _ref: cityId } : undefined,
          tagline: n.tagline,
          vibe: n.vibe,
          description: n.description,
          population: n.population,
          commute: n.commute,
          schoolDistrict: n.schoolDistrict,
          schools: n.schools?.map((s, idx) => ({ _key: `s-${idx}`, ...s })),
          whyPeopleLove: n.whyPeopleLove,
          highlights: n.highlights?.map((h, idx) => ({ _key: `h-${idx}`, ...h })),
          avgPrice: n.avgPrice,
          order: i + 1,
          isActive: true
        })
      }
      results.communities = { created: communities.length }
    } else {
      // Link existing communities without a city to Austin
      const austinId = cityIdMap['austin']
      if (austinId) {
        const communitiesWithoutCity = await client.fetch(`*[_type == "neighborhood" && !defined(city)]{ _id }`)
        let linkedCount = 0
        for (const c of communitiesWithoutCity) {
          await client.patch(c._id).set({ city: { _type: 'reference', _ref: austinId } }).commit()
          linkedCount++
        }
        results.communities = { skipped: nCount, linkedToAustin: linkedCount }
      } else {
        results.communities = { skipped: nCount }
      }
    }

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
