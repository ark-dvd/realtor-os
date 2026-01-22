import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'
import { SiteSettingsInputSchema, validate } from '@/lib/validations'

// Interface for Sanity siteSettings document
interface SiteSettingsDocument {
  _type: 'siteSettings'
  siteTitle?: string
  heroHeadline?: string
  heroSubheadline?: string
  heroMediaType?: 'images' | 'video'
  agentName?: string
  agentTitle?: string
  aboutHeadline?: string
  aboutText?: string
  aboutStats?: Array<{ _key: string; value: string; label: string }>
  phone?: string
  email?: string
  address?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  agentPhoto?: { _type: 'image'; asset: { _type: 'reference'; _ref: string } }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const data = await getSanityWriteClient().fetch(`
      *[_type == "siteSettings"][0] {
        _id, siteTitle, heroHeadline, heroSubheadline, heroMediaType,
        heroImages[] { _key, "url": asset->url, alt },
        agentName, agentTitle, "agentPhoto": agentPhoto.asset->url,
        aboutHeadline, aboutText, aboutStats, phone, email, address,
        "logo": logo.asset->url, instagram, facebook, linkedin
      }
    `)
    return NextResponse.json(data || {})
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const body = await request.json()
    const v = validate(SiteSettingsInputSchema, body)
    if (!v.success) {
      return NextResponse.json({ error: 'Validation failed', details: v.errors }, { status: 400 })
    }
    
    const d = v.data
    const client = getSanityWriteClient()
    const existing = await client.fetch(`*[_type == "siteSettings"][0]._id`)
    
    const updates: Partial<Omit<SiteSettingsDocument, '_type'>> = {
      siteTitle: d.siteTitle,
      heroHeadline: d.heroHeadline,
      heroSubheadline: d.heroSubheadline,
      heroMediaType: d.heroMediaType,
      agentName: d.agentName,
      agentTitle: d.agentTitle,
      aboutHeadline: d.aboutHeadline,
      aboutText: d.aboutText,
      aboutStats: d.aboutStats?.map((s, i) => ({
        _key: s._key || `stat-${i}-${Date.now()}`,
        value: s.value,
        label: s.label,
      })),
      phone: d.phone,
      email: d.email,
      address: d.address,
      instagram: d.instagram,
      facebook: d.facebook,
      linkedin: d.linkedin,
    }
    
    if (d.agentPhotoAssetId) {
      updates.agentPhoto = { _type: 'image', asset: { _type: 'reference', _ref: d.agentPhotoAssetId } }
    }
    
    let result
    if (existing) {
      result = await client.patch(existing).set(updates).commit()
    } else {
      const newDoc: SiteSettingsDocument = {
        _type: 'siteSettings',
        ...updates,
      }
      result = await client.create(newDoc)
    }
    
    return NextResponse.json(result)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
