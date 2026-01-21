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

// Sample properties data
const sampleProperties = [
  {
    title: 'Modern Lakefront Estate',
    slug: 'modern-lakefront-estate',
    status: 'for-sale',
    price: 2850000,
    address: { street: '1234 Lake Austin Blvd', city: 'Austin', state: 'TX', zip: '78703' },
    beds: 5,
    baths: 4.5,
    sqft: 4800,
    lotSize: 0.75,
    yearBuilt: 2021,
    garage: 3,
    shortDescription: 'Stunning contemporary estate with panoramic lake views, infinity pool, and private boat dock.',
    features: ['Lake Views', 'Infinity Pool', 'Private Dock', 'Smart Home', 'Wine Cellar', 'Home Theater'],
  },
  {
    title: 'Downtown Luxury Condo',
    slug: 'downtown-luxury-condo',
    status: 'for-sale',
    price: 975000,
    address: { street: '200 Congress Ave #2001', city: 'Austin', state: 'TX', zip: '78701' },
    beds: 2,
    baths: 2,
    sqft: 1650,
    yearBuilt: 2019,
    garage: 2,
    shortDescription: 'High-rise luxury living with stunning Capitol views and world-class amenities.',
    features: ['Capitol Views', 'Concierge Service', 'Rooftop Pool', 'Fitness Center', 'Pet Friendly'],
  },
  {
    title: 'Tarrytown Family Home',
    slug: 'tarrytown-family-home',
    status: 'pending',
    price: 1650000,
    address: { street: '3456 Windsor Rd', city: 'Austin', state: 'TX', zip: '78703' },
    beds: 4,
    baths: 3,
    sqft: 3200,
    lotSize: 0.35,
    yearBuilt: 1955,
    garage: 2,
    shortDescription: 'Beautifully updated mid-century home in the heart of Tarrytown with mature trees and modern amenities.',
    features: ['Updated Kitchen', 'Hardwood Floors', 'Large Backyard', 'Casis Elementary', 'Walk to Hike & Bike'],
  },
  {
    title: 'Zilker Modern Retreat',
    slug: 'zilker-modern-retreat',
    status: 'for-sale',
    price: 1425000,
    address: { street: '2100 Kinney Ave', city: 'Austin', state: 'TX', zip: '78704' },
    beds: 3,
    baths: 2.5,
    sqft: 2400,
    lotSize: 0.2,
    yearBuilt: 2020,
    garage: 2,
    shortDescription: 'Contemporary design meets Austin lifestyle. Steps from Barton Springs and Zilker Park.',
    features: ['Open Floor Plan', 'Chef\'s Kitchen', 'Outdoor Living', 'Near Zilker Park', 'Energy Efficient'],
  },
]

// Sample deals data
const sampleDeals = [
  {
    clientName: 'John & Sarah Mitchell',
    clientEmail: 'mitchells@email.com',
    clientPhone: '(512) 555-1234',
    dealType: 'buying',
    propertyAddress: 'Modern Lakefront Estate - 1234 Lake Austin Blvd',
    price: 2850000,
    transactionStage: 4,
    keyDates: {
      contractDate: '2024-01-15',
      optionPeriodEnds: '2024-01-25',
      inspectionDate: '2024-01-22',
      appraisalDate: '2024-02-01',
      closingDate: '2024-02-28',
    },
    notes: 'Pre-approved with First National. Requesting home warranty.',
    isActive: true,
  },
  {
    clientName: 'Emily Rodriguez',
    clientEmail: 'emily.r@email.com',
    clientPhone: '(512) 555-5678',
    dealType: 'selling',
    propertyAddress: '456 Oak Lane, Westlake',
    price: 1875000,
    transactionStage: 6,
    keyDates: {
      contractDate: '2024-01-10',
      inspectionDate: '2024-01-18',
      closingDate: '2024-02-15',
    },
    notes: 'Relocating to Denver. Flexible on closing date.',
    isActive: true,
  },
  {
    clientName: 'David Chen',
    clientEmail: 'dchen@email.com',
    clientPhone: '(512) 555-9012',
    dealType: 'buying',
    propertyAddress: 'Downtown Luxury Condo - 200 Congress Ave #2001',
    price: 975000,
    transactionStage: 2,
    keyDates: {
      contractDate: '2024-01-20',
      optionPeriodEnds: '2024-01-30',
    },
    notes: 'First-time buyer. Working with loan officer at Chase.',
    isActive: true,
  },
]

// Site settings data
const siteSettingsData = {
  siteTitle: 'Merrav Berko Real Estate',
  heroHeadline: 'Find Your Home in Austin',
  heroSubheadline: 'Luxury real estate with personalized service. Your journey to the perfect home starts here.',
  heroMediaType: 'images',
  agentName: 'Merrav Berko',
  agentTitle: 'REALTOR® | Austin Luxury Specialist',
  aboutHeadline: 'Meet Merrav Berko',
  aboutText: 'Merrav Berko holds a Bachelor of Arts in Management from Israel\'s Open University and brings over 12 years of experience living in Austin to her work in real estate. Her deep understanding of the city—its neighborhoods, culture, and evolving market—allows her to guide clients with clarity and confidence.\n\nWith a refined eye for design, a strong foundation in investment strategy, and meticulous attention to detail, Merrav is committed to exceeding her clients\' expectations at every step.',
  aboutStats: [
    { value: '12+', label: 'Years in Austin' },
    { value: '$50M+', label: 'in Transactions' },
    { value: '100%', label: 'Client Satisfaction' },
  ],
  phone: '(512) 599-9995',
  email: 'merrav@merravberko.com',
  address: 'Austin, Texas',
  officeHours: 'Monday - Friday: 9am - 6pm\nSaturday: 10am - 4pm\nSunday: By Appointment',
  primaryColor: '#1B2B4B',
  accentColor: '#C9A961',
  instagram: 'https://instagram.com/merravberko',
  facebook: 'https://facebook.com/merravberko',
  linkedin: 'https://linkedin.com/in/merravberko',
  trecLink: 'https://www.trec.texas.gov/forms/consumer-protection-notice',
}

// POST - Seed all data
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const results: any = {}

    // Seed Neighborhoods
    if (type === 'all' || type === 'neighborhoods') {
      const existingNeighborhoods = await client.fetch(`count(*[_type == "neighborhood"])`)
      
      if (existingNeighborhoods === 0) {
        const neighborhoodResults = []
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
          }
          
          const result = await client.create(doc)
          neighborhoodResults.push(result)
        }
        results.neighborhoods = { created: neighborhoodResults.length }
      } else {
        results.neighborhoods = { skipped: existingNeighborhoods, reason: 'Already exists' }
      }
    }

    // Seed Properties
    if (type === 'all' || type === 'properties') {
      const existingProperties = await client.fetch(`count(*[_type == "property"])`)
      
      if (existingProperties === 0) {
        const propertyResults = []
        for (const p of sampleProperties) {
          const doc = {
            _type: 'property',
            title: p.title,
            slug: { _type: 'slug', current: p.slug },
            status: p.status,
            price: p.price,
            address: p.address,
            beds: p.beds,
            baths: p.baths,
            sqft: p.sqft,
            lotSize: p.lotSize,
            yearBuilt: p.yearBuilt,
            garage: p.garage,
            shortDescription: p.shortDescription,
            features: p.features,
          }
          
          const result = await client.create(doc)
          propertyResults.push(result)
        }
        results.properties = { created: propertyResults.length }
      } else {
        results.properties = { skipped: existingProperties, reason: 'Already exists' }
      }
    }

    // Seed Deals
    if (type === 'all' || type === 'deals') {
      const existingDeals = await client.fetch(`count(*[_type == "activeDeal"])`)
      
      if (existingDeals === 0) {
        const dealResults = []
        for (const d of sampleDeals) {
          const doc = {
            _type: 'activeDeal',
            clientName: d.clientName,
            clientEmail: d.clientEmail,
            clientPhone: d.clientPhone,
            dealType: d.dealType,
            propertyAddress: d.propertyAddress,
            price: d.price,
            transactionStage: d.transactionStage,
            keyDates: d.keyDates,
            notes: d.notes,
            isActive: d.isActive,
          }
          
          const result = await client.create(doc)
          dealResults.push(result)
        }
        results.deals = { created: dealResults.length }
      } else {
        results.deals = { skipped: existingDeals, reason: 'Already exists' }
      }
    }

    // Seed Site Settings
    if (type === 'all' || type === 'settings') {
      const existingSettings = await client.fetch(`*[_type == "siteSettings"][0]._id`)
      
      if (!existingSettings) {
        const doc = {
          _type: 'siteSettings',
          ...siteSettingsData,
          aboutStats: siteSettingsData.aboutStats.map((stat, idx) => ({
            _key: `stat-${idx}`,
            value: stat.value,
            label: stat.label,
          })),
        }
        
        await client.create(doc)
        results.settings = { created: true }
      } else {
        results.settings = { skipped: true, reason: 'Already exists' }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Data seeded successfully',
      results,
    })
  } catch (error) {
    console.error('Error seeding data:', error)
    return NextResponse.json({ error: 'Failed to seed data', details: String(error) }, { status: 500 })
  }
}

// DELETE - Clear all data (use with caution)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const confirm = searchParams.get('confirm')

    if (confirm !== 'yes') {
      return NextResponse.json({ error: 'Add ?confirm=yes to confirm deletion' }, { status: 400 })
    }

    if (type === 'all') {
      await client.delete({ query: '*[_type in ["neighborhood", "property", "activeDeal", "siteSettings"]]' })
      return NextResponse.json({ success: true, message: 'All data deleted' })
    }

    if (type) {
      await client.delete({ query: `*[_type == "${type}"]` })
      return NextResponse.json({ success: true, message: `All ${type} deleted` })
    }

    return NextResponse.json({ error: 'Specify type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Error deleting data:', error)
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 })
  }
}
