import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'
import { PropertyInputSchema, validate } from '@/lib/validations'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const client = getSanityWriteClient()
    const properties = await client.fetch(`
      *[_type == "property"] | order(_createdAt desc) {
        _id, title, "slug": slug.current, status, price, address,
        beds, baths, sqft, lotSize, yearBuilt, garage, mlsNumber,
        shortDescription, features, "heroImage": heroImage.asset->url,
        "neighborhoodName": neighborhood->name, _createdAt
      }
    `)
    return NextResponse.json(properties || [])
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const validation = validate(PropertyInputSchema, body)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const data = validation.data
    const client = getSanityWriteClient()
    
    const doc: Record<string, unknown> = {
      _type: 'property',
      title: data.title,
      slug: { _type: 'slug', current: data.slug },
      status: data.status,
      price: data.price,
      address: data.address || {},
      beds: data.beds,
      baths: data.baths,
      sqft: data.sqft,
      lotSize: data.lotSize,
      yearBuilt: data.yearBuilt,
      garage: data.garage,
      mlsNumber: data.mlsNumber,
      shortDescription: data.shortDescription,
      features: data.features || [],
    }

    if (data.heroImageAssetId) {
      doc.heroImage = { _type: 'image', asset: { _type: 'reference', _ref: data.heroImageAssetId } }
    }
    if (data.neighborhoodId) {
      doc.neighborhood = { _type: 'reference', _ref: data.neighborhoodId }
    }

    const result = await client.create(doc)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const validation = validate(PropertyInputSchema, body)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const data = validation.data
    if (!data._id) {
      return NextResponse.json({ error: 'Missing _id for update' }, { status: 400 })
    }

    const client = getSanityWriteClient()
    const updates: Record<string, unknown> = {
      title: data.title,
      slug: { _type: 'slug', current: data.slug },
      status: data.status,
      price: data.price,
      address: data.address,
      beds: data.beds,
      baths: data.baths,
      sqft: data.sqft,
      lotSize: data.lotSize,
      yearBuilt: data.yearBuilt,
      garage: data.garage,
      mlsNumber: data.mlsNumber,
      shortDescription: data.shortDescription,
      features: data.features,
    }

    if (data.heroImageAssetId) {
      updates.heroImage = { _type: 'image', asset: { _type: 'reference', _ref: data.heroImageAssetId } }
    }
    if (data.neighborhoodId) {
      updates.neighborhood = { _type: 'reference', _ref: data.neighborhoodId }
    }

    const result = await client.patch(data._id).set(updates).commit()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
  }
}

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
    console.error('Error deleting property:', error)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}
