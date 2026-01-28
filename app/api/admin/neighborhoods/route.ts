import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const client = getSanityWriteClient()
    const data = await client.fetch(`
      *[_type == "neighborhood"] | order(city->order asc, order asc) {
        _id,
        name,
        "slug": slug.current,
        city->{ _id, name, "slug": slug.current },
        "cityId": city._ref,
        tagline,
        vibe,
        description,
        population,
        commute,
        schoolDistrict,
        schools[]{ _key, name, type, rating, note },
        whyPeopleLove,
        highlights[]{ _key, name, description },
        avgPrice,
        "image": image.asset->url,
        "imageAssetId": image.asset._ref,
        gallery[]{ _key, "url": asset->url, "assetId": asset._ref, alt },
        order,
        isActive
      }
    `)
    return NextResponse.json(data || [])
  } catch (e) {
    console.error('GET neighborhoods error:', e)
    return NextResponse.json({ error: 'Failed to fetch neighborhoods' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const body = await request.json()
    const client = getSanityWriteClient()
    

    const doc: any = {
      _type: 'neighborhood',
      name: body.name,
      slug: { _type: 'slug', current: body.slug },
      tagline: body.tagline,
      vibe: body.vibe,
      description: body.description,
      population: body.population,
      commute: body.commute || {},
      schoolDistrict: body.schoolDistrict,
      schools: body.schools?.map((s: { _key?: string; name: string; type: string; rating: number; note?: string }, i: number) => ({
        _key: s._key || `school-${i}-${Date.now()}`,
        name: s.name,
        type: s.type,
        rating: s.rating,
        note: s.note,
      })) || [],
      whyPeopleLove: body.whyPeopleLove || [],
      highlights: body.highlights?.map((h: { _key?: string; name: string; description: string }, i: number) => ({
        _key: h._key || `highlight-${i}-${Date.now()}`,
        name: h.name,
        description: h.description,
      })) || [],
      avgPrice: body.avgPrice,
      order: body.order || 10,
      isActive: body.isActive ?? true,
    }

    // City Reference (required)
    if (body.cityId) {
      doc.city = { _type: 'reference', _ref: body.cityId }
    }
    
    // Cover Image
    if (body.imageAssetId) {
      doc.image = { _type: 'image', asset: { _type: 'reference', _ref: body.imageAssetId } }
    }
    
    // Gallery
    if (body.gallery && Array.isArray(body.gallery)) {
      doc.gallery = body.gallery.map((img: { _key?: string; assetId?: string; alt?: string }, i: number) => {
        const item: Record<string, unknown> = {
          _key: img._key || `gallery-${i}-${Date.now()}`,
          _type: 'image',
        }
        if (img.assetId) {
          item.asset = { _type: 'reference', _ref: img.assetId }
        }
        if (img.alt) item.alt = img.alt
        return item
      }).filter((img: Record<string, unknown>) => img.asset)
    }
    
    const result = await client.create(doc)
    return NextResponse.json(result, { status: 201 })
  } catch (e) {
    console.error('POST neighborhood error:', e)
    return NextResponse.json({ error: 'Failed to create neighborhood' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const body = await request.json()
    if (!body._id) {
      return NextResponse.json({ error: 'Missing _id' }, { status: 400 })
    }
    
    const client = getSanityWriteClient()
    
    const updates: any = {
      name: body.name,
      slug: { _type: 'slug', current: body.slug },
      tagline: body.tagline,
      vibe: body.vibe,
      description: body.description,
      population: body.population,
      commute: body.commute,
      schoolDistrict: body.schoolDistrict,
      schools: body.schools?.map((s: { _key?: string; name: string; type: string; rating: number; note?: string }, i: number) => ({
        _key: s._key || `school-${i}-${Date.now()}`,
        name: s.name,
        type: s.type,
        rating: s.rating,
        note: s.note,
      })),
      whyPeopleLove: body.whyPeopleLove,
      highlights: body.highlights?.map((h: { _key?: string; name: string; description: string }, i: number) => ({
        _key: h._key || `highlight-${i}-${Date.now()}`,
        name: h.name,
        description: h.description,
      })),
      avgPrice: body.avgPrice,
      order: body.order,
      isActive: body.isActive,
    }

    // City Reference
    if (body.cityId) {
      updates.city = { _type: 'reference', _ref: body.cityId }
    }
    
    // Cover Image
    if (body.imageAssetId) {
      updates.image = { _type: 'image', asset: { _type: 'reference', _ref: body.imageAssetId } }
    }
    
    // Gallery
    if (body.gallery && Array.isArray(body.gallery)) {
      updates.gallery = body.gallery.map((img: { _key?: string; assetId?: string; alt?: string }, i: number) => {
        const item: Record<string, unknown> = {
          _key: img._key || `gallery-${i}-${Date.now()}`,
          _type: 'image',
        }
        if (img.assetId) {
          item.asset = { _type: 'reference', _ref: img.assetId }
        }
        if (img.alt) item.alt = img.alt
        return item
      }).filter((img: Record<string, unknown>) => img.asset)
    }
    
    const result = await client.patch(body._id).set(updates).commit()
    return NextResponse.json(result)
  } catch (e) {
    console.error('PUT neighborhood error:', e)
    return NextResponse.json({ error: 'Failed to update neighborhood' }, { status: 500 })
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
    console.error('DELETE neighborhood error:', e)
    return NextResponse.json({ error: 'Failed to delete neighborhood' }, { status: 500 })
  }
}
