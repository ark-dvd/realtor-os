import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// GET all properties
export async function GET() {
  try {
    const properties = await client.fetch(`
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
        "gallery": gallery[].asset->url,
        "neighborhoodName": neighborhood->name,
        _createdAt,
        _updatedAt
      }
    `)
    return NextResponse.json(properties || [])
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json([])
  }
}

// POST create new property
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const doc: any = {
      _type: 'property',
      title: data.title,
      slug: { _type: 'slug', current: data.slug || data.title.toLowerCase().replace(/\s+/g, '-') },
      status: data.status || 'for-sale',
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
      doc.heroImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.heroImageAssetId }
      }
    }

    if (data.neighborhoodId) {
      doc.neighborhood = { _type: 'reference', _ref: data.neighborhoodId }
    }

    const result = await client.create(doc)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}

// PUT update property
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { _id, ...updateData } = data

    if (!_id) {
      return NextResponse.json({ error: 'Missing _id' }, { status: 400 })
    }

    const updates: any = {
      title: updateData.title,
      status: updateData.status,
      price: updateData.price,
      address: updateData.address,
      beds: updateData.beds,
      baths: updateData.baths,
      sqft: updateData.sqft,
      lotSize: updateData.lotSize,
      yearBuilt: updateData.yearBuilt,
      garage: updateData.garage,
      mlsNumber: updateData.mlsNumber,
      shortDescription: updateData.shortDescription,
      features: updateData.features,
    }

    if (updateData.slug) {
      updates.slug = { _type: 'slug', current: updateData.slug }
    }

    if (updateData.heroImageAssetId) {
      updates.heroImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: updateData.heroImageAssetId }
      }
    }

    if (updateData.neighborhoodId) {
      updates.neighborhood = { _type: 'reference', _ref: updateData.neighborhoodId }
    }

    const result = await client.patch(_id).set(updates).commit()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
  }
}

// DELETE property
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
    console.error('Error deleting property:', error)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}
