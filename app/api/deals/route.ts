import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// GET all deals
export async function GET() {
  try {
    const deals = await client.fetch(`
      *[_type == "activeDeal"] | order(_createdAt desc) {
        _id,
        clientName,
        clientEmail,
        clientPhone,
        dealType,
        propertyAddress,
        price,
        transactionStage,
        keyDates,
        notes,
        isActive,
        "property": property->{title, "slug": slug.current}
      }
    `)
    return NextResponse.json(deals)
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}

// POST create new deal
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const doc: any = {
      _type: 'activeDeal',
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      dealType: data.dealType || 'buying',
      propertyAddress: data.propertyAddress,
      price: data.price,
      transactionStage: data.transactionStage || 1,
      keyDates: data.keyDates || {},
      notes: data.notes,
      isActive: data.isActive ?? true,
    }

    const result = await client.create(doc)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
  }
}

// PUT update deal
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { _id, ...updateData } = data

    if (!_id) {
      return NextResponse.json({ error: 'Missing _id' }, { status: 400 })
    }

    const result = await client.patch(_id).set(updateData).commit()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating deal:', error)
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 })
  }
}

// DELETE deal
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
    console.error('Error deleting deal:', error)
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 })
  }
}
