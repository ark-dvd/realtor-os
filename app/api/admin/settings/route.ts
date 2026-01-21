import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'
import { SiteSettingsInputSchema, validate } from '@/lib/validations'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error
  try {
    const data = await getSanityWriteClient().fetch(`*[_type == "siteSettings"][0] { _id, siteTitle, heroHeadline, heroSubheadline, heroMediaType, heroImages[] { _key, "url": asset->url, alt }, agentName, agentTitle, "agentPhoto": agentPhoto.asset->url, aboutHeadline, aboutText, aboutStats, phone, email, address, "logo": logo.asset->url, primaryColor, accentColor, instagram, facebook, linkedin }`)
    return NextResponse.json(data || {})
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error
  try {
    const body = await request.json()
    const v = validate(SiteSettingsInputSchema, body); if (!v.success) return NextResponse.json({ error: 'Validation failed', details: v.errors }, { status: 400 })
    const d = v.data, client = getSanityWriteClient()
    const existing = await client.fetch(`*[_type == "siteSettings"][0]._id`)
    const updates: Record<string, unknown> = { siteTitle: d.siteTitle, heroHeadline: d.heroHeadline, heroSubheadline: d.heroSubheadline, heroMediaType: d.heroMediaType, agentName: d.agentName, agentTitle: d.agentTitle, aboutHeadline: d.aboutHeadline, aboutText: d.aboutText, aboutStats: d.aboutStats?.map((s, i) => ({ _key: s._key || `stat-${i}-${Date.now()}`, ...s })), phone: d.phone, email: d.email, address: d.address, primaryColor: d.primaryColor, accentColor: d.accentColor, instagram: d.instagram, facebook: d.facebook, linkedin: d.linkedin }
    if (d.agentPhotoAssetId) updates.agentPhoto = { _type: 'image', asset: { _type: 'reference', _ref: d.agentPhotoAssetId } }
    if (d.logoAssetId) updates.logo = { _type: 'image', asset: { _type: 'reference', _ref: d.logoAssetId } }
    const result = existing ? await client.patch(existing).set(updates).commit() : await client.create({ _type: 'siteSettings', ...updates })
    return NextResponse.json(result)
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
