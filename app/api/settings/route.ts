import { NextResponse } from 'next/server'
import { getSanityClient } from '@/lib/sanity'

export async function GET() {
  try {
    const client = getSanityClient()
    const settings = await client.fetch(`
      *[_type == "siteSettings"][0] {
        _id, siteTitle, heroHeadline, heroSubheadline, heroMediaType,
        heroImages[] { _key, "url": asset->url, alt },
        agentName, agentTitle, "agentPhoto": agentPhoto.asset->url,
        aboutHeadline, aboutText, aboutStats, phone, email, address,
        instagram, facebook, linkedin
      }
    `)
    return NextResponse.json(settings || {})
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({})
  }
}
