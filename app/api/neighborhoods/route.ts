import { NextResponse } from 'next/server'
import { getSanityClient } from '@/lib/sanity'

export async function GET() {
  try {
    const client = getSanityClient()
    const neighborhoods = await client.fetch(`
      *[_type == "neighborhood"] | order(order asc) {
        _id, name, "slug": slug.current, tagline, vibe, description,
        population, commute, schoolDistrict, schools, whyPeopleLove,
        highlights, avgPrice, "image": image.asset->url, order, isActive
      }
    `)
    return NextResponse.json(neighborhoods || [])
  } catch (error) {
    console.error('Error fetching neighborhoods:', error)
    return NextResponse.json([])
  }
}
