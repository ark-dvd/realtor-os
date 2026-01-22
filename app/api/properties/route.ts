import { NextResponse } from 'next/server'
import { getSanityClient } from '@/lib/sanity'

export async function GET() {
  try {
    const client = getSanityClient()
    const properties = await client.fetch(`
      *[_type == "property"] | order(_createdAt desc) {
        _id, title, "slug": slug.current, status, price, address,
        beds, baths, sqft, lotSize, yearBuilt, garage, mlsNumber,
        shortDescription, features, "heroImage": heroImage.asset->url,
        "neighborhoodName": neighborhood->name
      }
    `)
    return NextResponse.json(properties || [])
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json([])
  }
}
