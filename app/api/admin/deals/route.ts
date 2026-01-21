import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'
import { DealInputSchema, validate } from '@/lib/validations'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const client = getSanityWriteClient()
    const deals = await client.fetch(`
      *[_type == "activeDeal"] | order(_createdAt desc) {
        _id, clientName, clientEmail, clientPhone, dealType,
        propertyAddress, price, transactionStage, keyDates, notes, isActive,
        "property": property->{title, "slug": slug.current, "image": heroImage.asset->url}
      }
    `)
    return NextResponse.json(deals || [])
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const validation = validate(DealInputSchema, body)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const data = validation.data
    const client = getSanityWriteClient()
    
    const doc: Record<string, unknown> = {
      _type: 'activeDeal',
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      dealType: data.dealType,
      propertyAddress: data.propertyAddress,
      price: data.price,
      transactionStage: data.transactionStage,
      keyDates: data.keyDates || {},
      notes: data.notes,
      isActive: data.isActive,
    }

    if (data.propertyId) {
      doc.property = { _type: 'reference', _ref: data.propertyId }
    }

    const result = await client.create(doc)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const validation = validate(DealInputSchema, body)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const data = validation.data
    if (!data._id) {
      return NextResponse.json({ error: 'Missing _id for update' }, { status: 400 })
    }

    const client = getSanityWriteClient()
    const updates: Record<string, unknown> = {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      dealType: data.dealType,
      propertyAddress: data.propertyAddress,
      price: data.price,
      transactionStage: data.transactionStage,
      keyDates: data.keyDates,
      notes: data.notes,
      isActive: data.isActive,
    }

    if (data.propertyId) {
      updates.property = { _type: 'reference', _ref: data.propertyId }
    }

    const result = await client.patch(data._id).set(updates).commit()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating deal:', error)
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 })
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
    console.error('Error deleting deal:', error)
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 })
  }
}
