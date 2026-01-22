import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'
import { PropertyInputSchema, validate } from '@/lib/validations'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error
  try {
    const data = await getSanityWriteClient().fetch(`*[_type == "property"] | order(_createdAt desc) { _id, title, "slug": slug.current, status, price, address, beds, baths, sqft, lotSize, yearBuilt, garage, mlsNumber, shortDescription, features, "heroImage": heroImage.asset->url, "neighborhoodName": neighborhood->name }`)
    return NextResponse.json(data || [])
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error
  try {
    const body = await request.json()
    const v = validate(PropertyInputSchema, body); if (!v.success) return NextResponse.json({ error: 'Validation failed', details: v.errors }, { status: 400 })
    const d = v.data, client = getSanityWriteClient()
    const doc: any = { _type: 'property', title: d.title, slug: { _type: 'slug', current: d.slug }, status: d.status, price: d.price, address: d.address || {}, beds: d.beds, baths: d.baths, sqft: d.sqft, lotSize: d.lotSize, yearBuilt: d.yearBuilt, garage: d.garage, mlsNumber: d.mlsNumber, shortDescription: d.shortDescription, features: d.features || [] }
    if (d.heroImageAssetId) doc.heroImage = { _type: 'image', asset: { _type: 'reference', _ref: d.heroImageAssetId } }
    if (d.neighborhoodId) doc.neighborhood = { _type: 'reference', _ref: d.neighborhoodId }
    return NextResponse.json(await client.create(doc), { status: 201 })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error
  try {
    const body = await request.json()
    const v = validate(PropertyInputSchema, body); if (!v.success) return NextResponse.json({ error: 'Validation failed', details: v.errors }, { status: 400 })
    const d = v.data; if (!d._id) return NextResponse.json({ error: 'Missing _id' }, { status: 400 })
    const updates: any = { title: d.title, slug: { _type: 'slug', current: d.slug }, status: d.status, price: d.price, address: d.address, beds: d.beds, baths: d.baths, sqft: d.sqft, lotSize: d.lotSize, yearBuilt: d.yearBuilt, garage: d.garage, mlsNumber: d.mlsNumber, shortDescription: d.shortDescription, features: d.features }
    if (d.heroImageAssetId) updates.heroImage = { _type: 'image', asset: { _type: 'reference', _ref: d.heroImageAssetId } }
    if (d.neighborhoodId) updates.neighborhood = { _type: 'reference', _ref: d.neighborhoodId }
    return NextResponse.json(await getSanityWriteClient().patch(d._id).set(updates).commit())
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    await getSanityWriteClient().delete(id)
    return NextResponse.json({ success: true })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
