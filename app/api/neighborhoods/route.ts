import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// GET all neighborhoods
export async function GET() {
  try {
    const neighborhoods = await client.fetch(`
      *[_type == "neighborhood"] | order(order asc) {
        _id,
        name,
        "slug": slug.current,
        tagline,
        vibe,
        description,
        population,
        commute,
        schoolDistrict,
        schools,
        whyPeopleLove,
        highlights,
        avgPrice,
        "image": image.asset->url,
        order,
        isActive
      }
    `)
    return NextResponse.json(neighborhoods)
  } catch (error) {
    console.error('Error fetching neighborhoods:', error)
    return NextResponse.json({ error: 'Failed to fetch neighborhoods' }, { status: 500 })
  }
}

// POST create new neighborhood
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const doc = {
      _type: 'neighborhood',
      name: data.name,
      slug: { _type: 'slug', current: data.slug },
      tagline: data.tagline,
      vibe: data.vibe,
      description: data.description,
      population: data.population,
      commute: data.commute,
      schoolDistrict: data.schoolDistrict,
      schools: data.schools,
      whyPeopleLove: data.whyPeopleLove,
      highlights: data.highlights,
      avgPrice: data.avgPrice,
      order: data.order || 10,
      isActive: data.isActive ?? true,
    }

    // If there's an image URL, we'll handle it separately
    if (data.imageAssetId) {
      doc.image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.imageAssetId }
      }
    }

    const result = await client.create(doc)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating neighborhood:', error)
    return NextResponse.json({ error: 'Failed to create neighborhood' }, { status: 500 })
  }
}

// PUT update neighborhood
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { _id, ...updateData } = data

    if (!_id) {
      return NextResponse.json({ error: 'Missing _id' }, { status: 400 })
    }

    const updates: any = {
      name: updateData.name,
      tagline: updateData.tagline,
      vibe: updateData.vibe,
      description: updateData.description,
      population: updateData.population,
      commute: updateData.commute,
      schoolDistrict: updateData.schoolDistrict,
      schools: updateData.schools,
      whyPeopleLove: updateData.whyPeopleLove,
      highlights: updateData.highlights,
      avgPrice: updateData.avgPrice,
      order: updateData.order,
      isActive: updateData.isActive,
    }

    if (updateData.slug) {
      updates.slug = { _type: 'slug', current: updateData.slug }
    }

    if (updateData.imageAssetId) {
      updates.image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: updateData.imageAssetId }
      }
    }

    const result = await client.patch(_id).set(updates).commit()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating neighborhood:', error)
    return NextResponse.json({ error: 'Failed to update neighborhood' }, { status: 500 })
  }
}

// DELETE neighborhood
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    await client.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting neighborhood:', error)
    return NextResponse.json({ error: 'Failed to delete neighborhood' }, { status: 500 })
  }
}
