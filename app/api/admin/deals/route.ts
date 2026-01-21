import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'
import { DealInputSchema, validate } from '@/lib/validations'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error
  try {
    const data = await getSanityWriteClient().fetch(`*[_type == "activeDeal"] | order(_createdAt desc) { _id, clientName, clientEmail, clientPhone, dealType, propertyAddress, price, transactionStage, keyDates, notes, isActive, "property": property->{title, "slug": slug.current} }`)
    return NextResponse.json(data || [])
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error
  try {
    const body = await request.json()
    const v = validate(DealInputSchema, body); if (!v.success) return NextResponse.json({ error: 'Validation failed', details: v.errors }, { status: 400 })
    const d = v.data
    const doc: Record<string, unknown> = { _type: 'activeDeal', clientName: d.clientName, clientEmail: d.clientEmail, clientPhone: d.clientPhone, dealType: d.dealType, propertyAddress: d.propertyAddress, price: d.price, transactionStage: d.transactionStage, keyDates: d.keyDates || {}, notes: d.notes, isActive: d.isActive }
    if (d.propertyId) doc.property = { _type: 'reference', _ref: d.propertyId }
    return NextResponse.json(await getSanityWriteClient().create(doc), { status: 201 })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error
  try {
    const body = await request.json()
    const v = validate(DealInputSchema, body); if (!v.success) return NextResponse.json({ error: 'Validation failed', details: v.errors }, { status: 400 })
    const d = v.data; if (!d._id) return NextResponse.json({ error: 'Missing _id' }, { status: 400 })
    const updates: Record<string, unknown> = { clientName: d.clientName, clientEmail: d.clientEmail, clientPhone: d.clientPhone, dealType: d.dealType, propertyAddress: d.propertyAddress, price: d.price, transactionStage: d.transactionStage, keyDates: d.keyDates, notes: d.notes, isActive: d.isActive }
    if (d.propertyId) updates.property = { _type: 'reference', _ref: d.propertyId }
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
