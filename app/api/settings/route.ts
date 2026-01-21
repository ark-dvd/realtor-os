import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// GET site settings
export async function GET() {
  try {
    let settings = await client.fetch(`
      *[_type == "siteSettings"][0] {
        _id,
        siteTitle,
        heroHeadline,
        heroSubheadline,
        heroMediaType,
        heroImages[] {
          "url": asset->url,
          alt
        },
        "heroVideoUrl": heroVideo.asset->url,
        agentName,
        agentTitle,
        "agentPhoto": agentPhoto.asset->url,
        aboutHeadline,
        aboutText,
        aboutStats,
        phone,
        email,
        address,
        officeHours,
        "logo": logo.asset->url,
        primaryColor,
        accentColor,
        instagram,
        facebook,
        linkedin,
        youtube,
        trecLink
      }
    `)

    // If no settings exist, return defaults
    if (!settings) {
      settings = {
        heroHeadline: 'Find Your Home in Austin',
        heroSubheadline: 'Luxury real estate with personalized service.',
        heroMediaType: 'images',
        heroImages: [],
        agentName: 'Merrav Berko',
        agentTitle: 'REALTOR® | Austin Luxury Specialist',
        phone: '(512) 599-9995',
        email: 'merrav@merravberko.com',
        address: 'Austin, Texas',
      }
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 })
  }
}

// PUT update site settings (or create if doesn't exist)
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Check if settings document exists
    const existing = await client.fetch(`*[_type == "siteSettings"][0]._id`)

    const updates: any = {
      siteTitle: data.siteTitle,
      heroHeadline: data.heroHeadline,
      heroSubheadline: data.heroSubheadline,
      heroMediaType: data.heroMediaType,
      agentName: data.agentName,
      agentTitle: data.agentTitle,
      aboutHeadline: data.aboutHeadline,
      aboutText: data.aboutText,
      aboutStats: data.aboutStats,
      phone: data.phone,
      email: data.email,
      address: data.address,
      officeHours: data.officeHours,
      primaryColor: data.primaryColor,
      accentColor: data.accentColor,
      instagram: data.instagram,
      facebook: data.facebook,
      linkedin: data.linkedin,
      youtube: data.youtube,
      trecLink: data.trecLink,
    }

    // Handle agent photo
    if (data.agentPhotoAssetId) {
      updates.agentPhoto = {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.agentPhotoAssetId }
      }
    }

    // Handle logo
    if (data.logoAssetId) {
      updates.logo = {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.logoAssetId }
      }
    }

    // Handle hero images
    if (data.heroImageAssetIds && data.heroImageAssetIds.length > 0) {
      updates.heroImages = data.heroImageAssetIds.map((assetId: string, index: number) => ({
        _type: 'image',
        _key: `hero-${index}`,
        asset: { _type: 'reference', _ref: assetId },
        alt: data.heroImageAlts?.[index] || ''
      }))
    }

    let result
    if (existing) {
      result = await client.patch(existing).set(updates).commit()
    } else {
      result = await client.create({
        _type: 'siteSettings',
        _id: 'siteSettings',
        ...updates
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json({ error: 'Failed to update site settings' }, { status: 500 })
  }
}
