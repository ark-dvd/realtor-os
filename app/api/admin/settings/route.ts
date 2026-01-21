import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'
import { SiteSettingsInputSchema, validate } from '@/lib/validations'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const client = getSanityWriteClient()
    const settings = await client.fetch(`
      *[_type == "siteSettings"][0] {
        _id, siteTitle, heroHeadline, heroSubheadline, heroMediaType,
        heroImages[] { _key, "url": asset->url, alt },
        agentName, agentTitle, "agentPhoto": agentPhoto.asset->url,
        aboutHeadline, aboutText, aboutStats, phone, email, address,
        "logo": logo.asset->url, primaryColor, accentColor,
        instagram, facebook, linkedin
      }
    `)
    return NextResponse.json(settings || {})
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const validation = validate(SiteSettingsInputSchema, body)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const data = validation.data
    const client = getSanityWriteClient()

    // Check if settings document exists
    const existing = await client.fetch(`*[_type == "siteSettings"][0]._id`)

    const updates: Record<string, unknown> = {
      siteTitle: data.siteTitle,
      heroHeadline: data.heroHeadline,
      heroSubheadline: data.heroSubheadline,
      heroMediaType: data.heroMediaType,
      agentName: data.agentName,
      agentTitle: data.agentTitle,
      aboutHeadline: data.aboutHeadline,
      aboutText: data.aboutText,
      aboutStats: data.aboutStats?.map((s, idx) => ({ _key: s._key || `stat-${idx}-${Date.now()}`, ...s })),
      phone: data.phone,
      email: data.email,
      address: data.address,
      primaryColor: data.primaryColor,
      accentColor: data.accentColor,
      instagram: data.instagram,
      facebook: data.facebook,
      linkedin: data.linkedin,
    }

    if (data.agentPhotoAssetId) {
      updates.agentPhoto = { _type: 'image', asset: { _type: 'reference', _ref: data.agentPhotoAssetId } }
    }
    if (data.logoAssetId) {
      updates.logo = { _type: 'image', asset: { _type: 'reference', _ref: data.logoAssetId } }
    }

    let result
    if (existing) {
      result = await client.patch(existing).set(updates).commit()
    } else {
      result = await client.create({ _type: 'siteSettings', ...updates })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
