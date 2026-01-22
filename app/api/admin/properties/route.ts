import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const data = await getSanityWriteClient().fetch(`
      *[_type == "property"] | order(_createdAt desc) {
        _id, 
        title, 
        "slug": slug.current, 
        status, 
        price, 
        address,
        beds, 
        baths, 
        sqft, 
        lotSize, 
        yearBuilt, 
        garage, 
        mlsNumber,
        shortDescription, 
        description,
        features,
        "heroImage": heroImage.asset->url,
        "heroImageAssetId": heroImage.asset._ref,
        heroVideo,
        gallery[]{ _key, "url": asset->url, "assetId": asset._ref, alt },
        "floorPlan": floorPlan.asset->url,
        "floorPlanAssetId": floorPlan.asset._ref,
        documents[]{ _key, title, "url": file.asset->url, "assetId": file.asset._ref },
        "neighborhoodId": neighborhood._ref,
        "neighborhoodName": neighborhood->name,
        seoTitle,
        seoDescription
      }
    `)
    return NextResponse.json(data || [])
  } catch (e) {
    console.error('GET properties error:', e)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const body = await request.json()
    const client = getSanityWriteClient()
    
    // Build document

    const doc: any = {
      _type: 'property',
      title: body.title,
      slug: { _type: 'slug', current: body.slug },
      status: body.status || 'for-sale',
      price: body.price || 0,
      address: body.address || {},
      beds: body.beds,
      baths: body.baths,
      sqft: body.sqft,
      lotSize: body.lotSize,
      yearBuilt: body.yearBuilt,
      garage: body.garage,
      mlsNumber: body.mlsNumber,
      shortDescription: body.shortDescription,
      description: body.description,
      features: body.features || [],
      heroVideo: body.heroVideo,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
    }
    
    // Hero Image
    if (body.heroImageAssetId) {
      doc.heroImage = { _type: 'image', asset: { _type: 'reference', _ref: body.heroImageAssetId } }
    }
    
    // Floor Plan
    if (body.floorPlanAssetId) {
      doc.floorPlan = { _type: 'image', asset: { _type: 'reference', _ref: body.floorPlanAssetId } }
    }
    
    // Neighborhood reference
    if (body.neighborhoodId) {
      doc.neighborhood = { _type: 'reference', _ref: body.neighborhoodId }
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
    
    // Documents
    if (body.documents && Array.isArray(body.documents)) {
      doc.documents = body.documents.map((d: { _key?: string; title?: string; assetId?: string }, i: number) => ({
        _key: d._key || `doc-${i}-${Date.now()}`,
        _type: 'propertyDocument',
        title: d.title || 'Document',
        ...(d.assetId ? { file: { _type: 'file', asset: { _type: 'reference', _ref: d.assetId } } } : {})
      })).filter((d: Record<string, unknown>) => d.title)
    }
    
    const result = await client.create(doc)
    return NextResponse.json(result, { status: 201 })
  } catch (e) {
    console.error('POST property error:', e)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
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
    
    // Build updates
    const updates: any = {
      title: body.title,
      slug: { _type: 'slug', current: body.slug },
      status: body.status || 'for-sale',
      price: body.price || 0,
      address: body.address || {},
      beds: body.beds,
      baths: body.baths,
      sqft: body.sqft,
      lotSize: body.lotSize,
      yearBuilt: body.yearBuilt,
      garage: body.garage,
      mlsNumber: body.mlsNumber,
      shortDescription: body.shortDescription,
      description: body.description,
      features: body.features || [],
      heroVideo: body.heroVideo,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
    }
    
    // Hero Image
    if (body.heroImageAssetId) {
      updates.heroImage = { _type: 'image', asset: { _type: 'reference', _ref: body.heroImageAssetId } }
    }
    
    // Floor Plan
    if (body.floorPlanAssetId) {
      updates.floorPlan = { _type: 'image', asset: { _type: 'reference', _ref: body.floorPlanAssetId } }
    }
    
    // Neighborhood reference
    if (body.neighborhoodId) {
      updates.neighborhood = { _type: 'reference', _ref: body.neighborhoodId }
    } else {
      updates.neighborhood = null
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
    
    // Documents
    if (body.documents && Array.isArray(body.documents)) {
      updates.documents = body.documents.map((d: { _key?: string; title?: string; assetId?: string }, i: number) => ({
        _key: d._key || `doc-${i}-${Date.now()}`,
        _type: 'propertyDocument',
        title: d.title || 'Document',
        ...(d.assetId ? { file: { _type: 'file', asset: { _type: 'reference', _ref: d.assetId } } } : {})
      }))
    }
    
    const result = await client.patch(body._id).set(updates).commit()
    return NextResponse.json(result)
  } catch (e) {
    console.error('PUT property error:', e)
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }
    
    await getSanityWriteClient().delete(id)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('DELETE property error:', e)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}
