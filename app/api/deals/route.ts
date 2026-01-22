import { NextRequest, NextResponse } from 'next/server'
import { getSanityClient } from '@/lib/sanity'

export async function GET() {
  try {
    const client = getSanityClient()
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
    return NextResponse.json([])
  }
}
