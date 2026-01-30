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
        heroImages[]{ _key, "url": coalesce(asset->url, externalUrl), "assetId": asset._ref, alt },
        "heroVideoUrl": heroVideo.asset->url,
        "heroVideoAssetId": heroVideo.asset._ref,
        agentName,
        agentTitle,
        "agentPhoto": agentPhoto.asset->url,
        "agentPhotoAssetId": agentPhoto.asset._ref,
        aboutHeadline,
        aboutText,
        aboutStats[]{ _key, value, label },
        phone,
        email,
        address,
        officeHours,
        instagram,
        facebook,
        linkedin,
        youtube,
        legalLinks[]{ _key, title, url },
        "iabsDocumentUrl": iabsDocument.asset->url,
        "iabsDocumentAssetId": iabsDocument.asset._ref,
        privacyPolicy,
        termsOfService,
        agentLicenseNumber,
        brokerName,
        brokerLicenseNumber,
        showFairHousing,
        "equalHousingLogo": equalHousingLogo.asset->url,
        "equalHousingLogoAssetId": equalHousingLogo.asset._ref,
        "logo": logo.asset->url,
        "logoAssetId": logo.asset._ref
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
    
    // Build updates
    const updates: any = {}
    
    // Basic text fields
    if (body.siteTitle !== undefined) updates.siteTitle = body.siteTitle
    if (body.heroHeadline !== undefined) updates.heroHeadline = body.heroHeadline
    if (body.heroSubheadline !== undefined) updates.heroSubheadline = body.heroSubheadline
    if (body.heroMediaType !== undefined) updates.heroMediaType = body.heroMediaType
    
    // Hero Images
    if (body.heroImages && Array.isArray(body.heroImages)) {
      updates.heroImages = body.heroImages.map((img: { _key?: string; url?: string; alt?: string; assetId?: string }, i: number) => {
        const imageObj: Record<string, unknown> = {
          _key: img._key || `hero-${i}-${Date.now()}`,
          _type: 'image',
        }
        if (img.assetId) {
          imageObj.asset = { _type: 'reference', _ref: img.assetId }
        } else if (img.url && !img.assetId) {
          imageObj.externalUrl = img.url
        }
        if (img.alt) imageObj.alt = img.alt
        return imageObj
      })
    }
    
    // Hero Video (file upload)
    if (body.heroVideoAssetId) {
      updates.heroVideo = { _type: 'file', asset: { _type: 'reference', _ref: body.heroVideoAssetId } }
    } else if (body.heroVideoAssetId === '') {
      updates.heroVideo = null
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
    
    // Contact info
    if (body.phone !== undefined) updates.phone = body.phone
    if (body.email !== undefined) updates.email = body.email
    if (body.address !== undefined) updates.address = body.address
    if (body.officeHours !== undefined) updates.officeHours = body.officeHours
    
    // Social media
    if (body.instagram !== undefined) updates.instagram = body.instagram
    if (body.facebook !== undefined) updates.facebook = body.facebook
    if (body.linkedin !== undefined) updates.linkedin = body.linkedin
    if (body.youtube !== undefined) updates.youtube = body.youtube
    
    // Legal
    if (body.legalLinks && Array.isArray(body.legalLinks)) {
      updates.legalLinks = body.legalLinks.map((link: { _key?: string; title: string; url?: string }, i: number) => ({
        _key: link._key || `legal-${i}-${Date.now()}`,
        title: link.title,
        url: link.url || '',
      }))
    }
    if (body.iabsDocumentAssetId) {
      updates.iabsDocument = { _type: 'file', asset: { _type: 'reference', _ref: body.iabsDocumentAssetId } }
    } else if (body.iabsDocumentAssetId === '') {
      updates.iabsDocument = null
    }

    // Legal Documents
    if (body.privacyPolicy !== undefined) updates.privacyPolicy = body.privacyPolicy
    if (body.termsOfService !== undefined) updates.termsOfService = body.termsOfService

    // License & Compliance
    if (body.agentLicenseNumber !== undefined) updates.agentLicenseNumber = body.agentLicenseNumber
    if (body.brokerName !== undefined) updates.brokerName = body.brokerName
    if (body.brokerLicenseNumber !== undefined) updates.brokerLicenseNumber = body.brokerLicenseNumber
    if (body.showFairHousing !== undefined) updates.showFairHousing = body.showFairHousing
    if (body.equalHousingLogoAssetId) {
      updates.equalHousingLogo = { _type: 'image', asset: { _type: 'reference', _ref: body.equalHousingLogoAssetId } }
    } else if (body.equalHousingLogoAssetId === '') {
      updates.equalHousingLogo = null
    }

    // Branding
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
