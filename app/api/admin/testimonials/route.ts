import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const data = await getSanityWriteClient().fetch(`
      *[_type == "testimonial"] | order(isFeatured desc, order asc) {
        _id,
        clientName,
        "clientPhoto": clientPhoto.asset->url,
        "clientPhotoAssetId": clientPhoto.asset._ref,
        quote,
        transactionType,
        neighborhood,
        rating,
        source,
        sourceUrl,
        isFeatured,
        order,
        isActive
      }
    `)
    return NextResponse.json(data || [])
  } catch (e) {
    console.error('GET testimonials error:', e)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const client = getSanityWriteClient()

    const doc: { _type: string; [key: string]: unknown } = {
      _type: 'testimonial',
      clientName: body.clientName,
      quote: body.quote,
      transactionType: body.transactionType || undefined,
      neighborhood: body.neighborhood || undefined,
      rating: body.rating ?? 5,
      source: body.source || undefined,
      sourceUrl: body.sourceUrl || undefined,
      isFeatured: body.isFeatured ?? false,
      order: body.order ?? 0,
      isActive: body.isActive ?? true,
    }

    // Client Photo
    if (body.clientPhotoAssetId) {
      doc.clientPhoto = { _type: 'image', asset: { _type: 'reference', _ref: body.clientPhotoAssetId } }
    }

    const result = await client.create(doc)
    return NextResponse.json(result, { status: 201 })
  } catch (e) {
    console.error('POST testimonial error:', e)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
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
      clientName: body.clientName,
      quote: body.quote,
      transactionType: body.transactionType || null,
      neighborhood: body.neighborhood || null,
      rating: body.rating ?? 5,
      source: body.source || null,
      sourceUrl: body.sourceUrl || null,
      isFeatured: body.isFeatured ?? false,
      order: body.order ?? 0,
      isActive: body.isActive ?? true,
    }

    // Client Photo
    if (body.clientPhotoAssetId) {
      updates.clientPhoto = { _type: 'image', asset: { _type: 'reference', _ref: body.clientPhotoAssetId } }
    } else if (body.clientPhoto === '' || body.clientPhotoAssetId === '') {
      updates.clientPhoto = null
    }

    const result = await client.patch(body._id).set(updates).commit()
    return NextResponse.json(result)
  } catch (e) {
    console.error('PUT testimonial error:', e)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
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
    console.error('DELETE testimonial error:', e)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
