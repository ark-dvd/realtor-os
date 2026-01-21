import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'
import { NeighborhoodInputSchema, validate } from '@/lib/validations'

// GET all neighborhoods (protected)
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const client = getSanityWriteClient()
    const neighborhoods = await client.fetch(`
      *[_type == "neighborhood"] | order(order asc) {
        _id, name, "slug": slug.current, tagline, vibe, description,
        population, commute, schoolDistrict, schools, whyPeopleLove,
        highlights, avgPrice, "image": image.asset->url, order, isActive
      }
    `)
    return NextResponse.json(neighborhoods || [])
  } catch (error) {
    console.error('Error fetching neighborhoods:', error)
    return NextResponse.json({ error: 'Failed to fetch neighborhoods' }, { status: 500 })
  }
}

// POST create neighborhood (protected)
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const validation = validate(NeighborhoodInputSchema, body)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const data = validation.data
    const client = getSanityWriteClient()
    
    const doc: Record<string, unknown> = {
      _type: 'neighborhood',
      name: data.name,
      slug: { _type: 'slug', current: data.slug },
      tagline: data.tagline,
      vibe: data.vibe,
      description: data.description,
      population: data.population,
      commute: data.commute || { toDowntown: '', toDomain: '' },
      schoolDistrict: data.schoolDistrict,
      schools: data.schools?.map((s, idx) => ({ _key: s._key || `school-${idx}-${Date.now()}`, ...s })) || [],
      whyPeopleLove: data.whyPeopleLove || [],
      highlights: data.highlights?.map((h, idx) => ({ _key: h._key || `highlight-${idx}-${Date.now()}`, ...h })) || [],
      avgPrice: data.avgPrice,
      order: data.order || 10,
      isActive: data.isActive ?? true,
    }

    if (data.imageAssetId) {
      doc.image = { _type: 'image', asset: { _type: 'reference', _ref: data.imageAssetId } }
    }

    const result = await client.create(doc)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating neighborhood:', error)
    return NextResponse.json({ error: 'Failed to create neighborhood' }, { status: 500 })
  }
}

// PUT update neighborhood (protected)
export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const validation = validate(NeighborhoodInputSchema, body)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const data = validation.data
    if (!data._id) {
      return NextResponse.json({ error: 'Missing _id for update' }, { status: 400 })
    }

    const client = getSanityWriteClient()
    const updates: Record<string, unknown> = {
      name: data.name,
      slug: { _type: 'slug', current: data.slug },
      tagline: data.tagline,
      vibe: data.vibe,
      description: data.description,
      population: data.population,
      commute: data.commute,
      schoolDistrict: data.schoolDistrict,
      schools: data.schools?.map((s, idx) => ({ _key: s._key || `school-${idx}-${Date.now()}`, ...s })),
      whyPeopleLove: data.whyPeopleLove,
      highlights: data.highlights?.map((h, idx) => ({ _key: h._key || `highlight-${idx}-${Date.now()}`, ...h })),
      avgPrice: data.avgPrice,
      order: data.order,
      isActive: data.isActive,
    }

    if (data.imageAssetId) {
      updates.image = { _type: 'image', asset: { _type: 'reference', _ref: data.imageAssetId } }
    }

    const result = await client.patch(data._id).set(updates).commit()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating neighborhood:', error)
    return NextResponse.json({ error: 'Failed to update neighborhood' }, { status: 500 })
  }
}

// DELETE neighborhood (protected)
export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
      return NextResponse.json({ error: 'Invalid or missing id' }, { status: 400 })
    }

    const client = getSanityWriteClient()
    await client.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting neighborhood:', error)
    return NextResponse.json({ error: 'Failed to delete neighborhood' }, { status: 500 })
  }
}
