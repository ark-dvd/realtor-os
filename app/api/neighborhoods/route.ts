import { NextResponse } from 'next/server'
import { getSanityClient } from '@/lib/sanity'

export async function GET() {
  try {
    const client = getSanityClient()
    const communities = await client.fetch(`
      *[_type == "neighborhood"] | order(city->order asc, order asc) {
        _id,
        name,
        "slug": slug.current,
        city->{ _id, name, "slug": slug.current },
        tagline,
        vibe,
        description,
        population,
        commute,
        schoolDistrict,
        schools,
        whyPeopleLove,
        highlights,
        avgPrice,
        "image": image.asset->url,
        order,
        isActive
      }
    `)
    return NextResponse.json(communities || [])
  } catch (error) {
    console.error('Error fetching communities:', error)
    return NextResponse.json([])
  }
}
