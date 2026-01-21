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
    const settings = await client.fetch(`
      *[_type == "siteSettings"][0] {
        _id,
        siteTitle,
        heroHeadline,
        heroSubheadline,
        heroMediaType,
        heroImages[] {
          _key,
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

    return NextResponse.json(settings || {})
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json({})
  }
}

// PUT update site settings
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
      aboutStats: data.aboutStats?.map((stat: any, idx: number) => ({
        _key: stat._key || `stat-${idx}-${Date.now()}`,
        value: stat.value,
        label: stat.label,
      })),
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
    if (data.heroImages && data.heroImages.length > 0) {
      updates.heroImages = data.heroImages.map((img: any, index: number) => ({
        _type: 'image',
        _key: img._key || `hero-${index}-${Date.now()}`,
        asset: img.assetId ? { _type: 'reference', _ref: img.assetId } : undefined,
        alt: img.alt || ''
      })).filter((img: any) => img.asset)
    }

    let result
    if (existing) {
      result = await client.patch(existing).set(updates).commit()
    } else {
      result = await client.create({
        _type: 'siteSettings',
        ...updates
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json({ error: 'Failed to update site settings' }, { status: 500 })
  }
}
