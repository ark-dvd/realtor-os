import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const data = await getSanityWriteClient().fetch(`
      *[_type == "siteSettings"][0] {
        _id,
        siteTitle,
        heroHeadline,
        heroSubheadline,
        heroMediaType,
        heroImages[] { _key, "url": asset->url, alt },
        "heroVideoUrl": heroVideo.asset->url,
        agentName,
        agentTitle,
        "agentPhoto": agentPhoto.asset->url,
        aboutHeadline,
        aboutText,
        aboutStats[] { _key, value, label },
        phone,
        email,
        address,
        officeHours,
        instagram,
        facebook,
        linkedin,
        youtube,
        trecLink,
        "logo": logo.asset->url,
        primaryColor,
        accentColor
      }
    `)
    return NextResponse.json(data || {})
  } catch (e) {
    console.error('GET settings error:', e)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  try {
    const body = await request.json()
    const client = getSanityWriteClient()
    const existing = await client.fetch(`*[_type == "siteSettings"][0]._id`)
    
    // Build the complete updates object with ALL fields
    const updates: Record<string, unknown> = {}
    
    // Basic fields
    if (body.siteTitle !== undefined) updates.siteTitle = body.siteTitle
    if (body.heroHeadline !== undefined) updates.heroHeadline = body.heroHeadline
    if (body.heroSubheadline !== undefined) updates.heroSubheadline = body.heroSubheadline
    if (body.heroMediaType !== undefined) updates.heroMediaType = body.heroMediaType
    if (body.heroVideoUrl !== undefined) updates.heroVideoUrl = body.heroVideoUrl
    
    // Hero Images - supports both Sanity uploads and external URLs
    if (body.heroImages && Array.isArray(body.heroImages)) {
      updates.heroImages = body.heroImages.map((img: { _key?: string; url?: string; alt?: string; assetId?: string }, i: number) => {
        const imageObj: Record<string, unknown> = {
          _key: img._key || `hero-${i}-${Date.now()}`,
          _type: 'image',
        }
        // If we have an assetId (uploaded to Sanity), use reference
        if (img.assetId) {
          imageObj.asset = { _type: 'reference', _ref: img.assetId }
        }
        // If it's an external URL (like Unsplash), store in externalUrl field
        if (img.url && !img.assetId) {
          imageObj.externalUrl = img.url
        }
        if (img.alt) imageObj.alt = img.alt
        return imageObj
      })
    }
    
    // Agent info
    if (body.agentName !== undefined) updates.agentName = body.agentName
    if (body.agentTitle !== undefined) updates.agentTitle = body.agentTitle
    if (body.agentPhotoAssetId) {
      updates.agentPhoto = { _type: 'image', asset: { _type: 'reference', _ref: body.agentPhotoAssetId } }
    }
    
    // About section
    if (body.aboutHeadline !== undefined) updates.aboutHeadline = body.aboutHeadline
    if (body.aboutText !== undefined) updates.aboutText = body.aboutText
    if (body.aboutStats && Array.isArray(body.aboutStats)) {
      updates.aboutStats = body.aboutStats.map((s: { _key?: string; value: string; label: string }, i: number) => ({
        _key: s._key || `stat-${i}-${Date.now()}`,
        value: s.value,
        label: s.label,
      }))
    }
    
    // Contact info - ALL fields
    if (body.phone !== undefined) updates.phone = body.phone
    if (body.email !== undefined) updates.email = body.email
    if (body.address !== undefined) updates.address = body.address
    if (body.officeHours !== undefined) updates.officeHours = body.officeHours
    
    // Social media - ALL fields
    if (body.instagram !== undefined) updates.instagram = body.instagram
    if (body.facebook !== undefined) updates.facebook = body.facebook
    if (body.linkedin !== undefined) updates.linkedin = body.linkedin
    if (body.youtube !== undefined) updates.youtube = body.youtube
    
    // Branding
    if (body.trecLink !== undefined) updates.trecLink = body.trecLink
    if (body.primaryColor !== undefined) updates.primaryColor = body.primaryColor
    if (body.accentColor !== undefined) updates.accentColor = body.accentColor
    if (body.logoAssetId) {
      updates.logo = { _type: 'image', asset: { _type: 'reference', _ref: body.logoAssetId } }
    }
    
    let result
    if (existing) {
      result = await client.patch(existing).set(updates).commit()
    } else {
      result = await client.create({
        _type: 'siteSettings',
        ...updates,
      })
    }
    
    return NextResponse.json(result)
  } catch (e) {
    console.error('PUT settings error:', e)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
