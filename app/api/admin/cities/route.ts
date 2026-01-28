import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const client = getSanityWriteClient()
    const data = await client.fetch(`
      *[_type == "city"] | order(order asc) {
        _id,
        name,
        "slug": slug.current,
        description,
        "image": image.asset->url,
        "imageAssetId": image.asset._ref,
        order
      }
    `)
    return NextResponse.json(data || [])
  } catch (e) {
    console.error('GET cities error:', e)
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const client = getSanityWriteClient()

    const doc: Record<string, unknown> = {
      _type: 'city',
      name: body.name,
      slug: { _type: 'slug', current: body.slug },
      description: body.description,
      order: body.order || 10,
    }

    if (body.imageAssetId) {
      doc.image = { _type: 'image', asset: { _type: 'reference', _ref: body.imageAssetId } }
    }

    const result = await client.create(doc)
    return NextResponse.json(result, { status: 201 })
  } catch (e) {
    console.error('POST city error:', e)
    return NextResponse.json({ error: 'Failed to create city' }, { status: 500 })
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

    const updates: Record<string, unknown> = {
      name: body.name,
      slug: { _type: 'slug', current: body.slug },
      description: body.description,
      order: body.order,
    }

    if (body.imageAssetId) {
      updates.image = { _type: 'image', asset: { _type: 'reference', _ref: body.imageAssetId } }
    }

    const result = await client.patch(body._id).set(updates).commit()
    return NextResponse.json(result)
  } catch (e) {
    console.error('PUT city error:', e)
    return NextResponse.json({ error: 'Failed to update city' }, { status: 500 })
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
    console.error('DELETE city error:', e)
    return NextResponse.json({ error: 'Failed to delete city' }, { status: 500 })
  }
}
