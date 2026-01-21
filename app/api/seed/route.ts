import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { neighborhoods } from '@/lib/neighborhoods-data'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// POST - Seed initial neighborhoods data
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'neighborhoods'

    if (type === 'neighborhoods') {
      // Check if neighborhoods already exist
      const existing = await client.fetch(`count(*[_type == "neighborhood"])`)
      
      if (existing > 0) {
        return NextResponse.json({ 
          message: `Skipped: ${existing} neighborhoods already exist`,
          count: existing 
        })
      }

      // Seed neighborhoods
      const results = []
      for (let i = 0; i < neighborhoods.length; i++) {
        const n = neighborhoods[i]
        const doc = {
          _type: 'neighborhood',
          name: n.name,
          slug: { _type: 'slug', current: n.slug },
          tagline: n.tagline,
          vibe: n.vibe,
          description: n.description,
          population: n.population,
          commute: n.commute,
          schoolDistrict: n.schoolDistrict,
          schools: n.schools?.map((s, idx) => ({
            _key: `school-${idx}`,
            name: s.name,
            type: s.type,
            rating: s.rating,
            note: s.note,
          })),
          whyPeopleLove: n.whyPeopleLove,
          highlights: n.highlights?.map((h, idx) => ({
            _key: `highlight-${idx}`,
            name: h.name,
            description: h.description,
          })),
          avgPrice: n.avgPrice,
          order: i + 1,
          isActive: true,
          // Note: Images will need to be uploaded separately
          // For now, we store the URL reference
        }
        
        const result = await client.create(doc)
        results.push(result)
      }

      return NextResponse.json({ 
        message: `Successfully seeded ${results.length} neighborhoods`,
        count: results.length 
      })
    }

    if (type === 'settings') {
      // Check if settings already exist
      const existing = await client.fetch(`*[_type == "siteSettings"][0]._id`)
      
      if (existing) {
        return NextResponse.json({ 
          message: 'Skipped: Site settings already exist',
        })
      }

      // Create default site settings
      const settings = await client.create({
        _type: 'siteSettings',
        _id: 'siteSettings',
        siteTitle: 'Merrav Berko Real Estate',
        heroHeadline: 'Find Your Home in Austin',
        heroSubheadline: 'Luxury real estate with personalized service. Your journey to the perfect home starts here.',
        heroMediaType: 'images',
        agentName: 'Merrav Berko',
        agentTitle: 'REALTOR® | Austin Luxury Specialist',
        phone: '(512) 599-9995',
        email: 'merrav@merravberko.com',
        address: 'Austin, Texas',
        trecLink: 'https://www.trec.texas.gov/forms/consumer-protection-notice',
      })

      return NextResponse.json({ 
        message: 'Successfully created site settings',
        settings 
      })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Error seeding data:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}
