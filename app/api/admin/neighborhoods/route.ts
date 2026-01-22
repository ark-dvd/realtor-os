import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'
import { NeighborhoodInputSchema, validate } from '@/lib/validations'

// Proper interface for Sanity neighborhood document
interface NeighborhoodDocument {
  _type: 'neighborhood'
  name: string
  slug: { _type: 'slug'; current: string }
  tagline: string
  vibe: string
  description: string
  population?: string
  commute?: { toDowntown?: string; toDomain?: string }
  schoolDistrict?: string
  schools?: Array<{ _key: string; name: string; type: string; rating: number; note?: string }>
  whyPeopleLove?: string[]
  highlights?: Array<{ _key: string; name: string; description: string }>
  avgPrice: string
  order?: number
  isActive?: boolean
  image?: { _type: 'image'; asset: { _type: 'reference'; _ref: string } }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const client = getSanityWriteClient()
    const data = await client.fetch(`
      *[_type == "neighborhood"] | order(order asc) {
        _id, name, "slug": slug.current, tagline, vibe, description,
        population, commute, schoolDistrict, schools, whyPeopleLove,
        highlights, avgPrice, "image": image.asset->url, order, isActive
      }
    `)
    return NextResponse.json(data || [])
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const body = await request.json()
    const v = validate(NeighborhoodInputSchema, body)
    if (!v.success) {
      return NextResponse.json({ error: 'Validation failed', details: v.errors }, { status: 400 })
    }
    
    const d = v.data
    const client = getSanityWriteClient()
    
    const doc: NeighborhoodDocument = {
      _type: 'neighborhood',
      name: d.name,
      slug: { _type: 'slug', current: d.slug },
      tagline: d.tagline,
      vibe: d.vibe,
      description: d.description,
      population: d.population,
      commute: d.commute || {},
      schoolDistrict: d.schoolDistrict,
      schools: d.schools?.map((s, i) => ({
        _key: s._key || `s-${i}-${Date.now()}`,
        name: s.name,
        type: s.type,
        rating: s.rating,
        note: s.note,
      })) || [],
      whyPeopleLove: d.whyPeopleLove || [],
      highlights: d.highlights?.map((h, i) => ({
        _key: h._key || `h-${i}-${Date.now()}`,
        name: h.name,
        description: h.description,
      })) || [],
      avgPrice: d.avgPrice,
      order: d.order || 10,
      isActive: d.isActive ?? true,
    }
    
    if (d.imageAssetId) {
      doc.image = { _type: 'image', asset: { _type: 'reference', _ref: d.imageAssetId } }
    }
    
    const result = await client.create(doc)
    return NextResponse.json(result, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const body = await request.json()
    const v = validate(NeighborhoodInputSchema, body)
    if (!v.success) {
      return NextResponse.json({ error: 'Validation failed', details: v.errors }, { status: 400 })
    }
    
    const d = v.data
    if (!d._id) {
      return NextResponse.json({ error: 'Missing _id' }, { status: 400 })
    }
    
    const client = getSanityWriteClient()
    
    const updates: Partial<Omit<NeighborhoodDocument, '_type'>> = {
      name: d.name,
      slug: { _type: 'slug', current: d.slug },
      tagline: d.tagline,
      vibe: d.vibe,
      description: d.description,
      population: d.population,
      commute: d.commute,
      schoolDistrict: d.schoolDistrict,
      schools: d.schools?.map((s, i) => ({
        _key: s._key || `s-${i}-${Date.now()}`,
        name: s.name,
        type: s.type,
        rating: s.rating,
        note: s.note,
      })),
      whyPeopleLove: d.whyPeopleLove,
      highlights: d.highlights?.map((h, i) => ({
        _key: h._key || `h-${i}-${Date.now()}`,
        name: h.name,
        description: h.description,
      })),
      avgPrice: d.avgPrice,
      order: d.order,
      isActive: d.isActive,
    }
    
    if (d.imageAssetId) {
      updates.image = { _type: 'image', asset: { _type: 'reference', _ref: d.imageAssetId } }
    }
    
    const result = await client.patch(d._id).set(updates).commit()
    return NextResponse.json(result)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }
    
    await getSanityWriteClient().delete(id)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
