import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, checkRateLimit } from '@/lib/auth/middleware'
import { getSanityWriteClient, isSanityWriteConfigured } from '@/lib/sanity'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  // Check auth
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error
  
  // Check rate limit
  if (!checkRateLimit(auth.user.id, 20, 60000)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute.' }, { status: 429 })
  }
  
  // Check Sanity config
  if (!isSanityWriteConfigured()) {
    return NextResponse.json({ error: 'Sanity is not configured for writes. Check SANITY_API_TOKEN.' }, { status: 500 })
  }
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF` }, { status: 400 })
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 10MB` }, { status: 400 })
    }
    
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    
    const client = getSanityWriteClient()
    const asset = await client.assets.upload('image', buffer, {
      filename,
      contentType: file.type,
    })
    
    if (!asset || !asset._id || !asset.url) {
      return NextResponse.json({ error: 'Upload succeeded but asset data is incomplete' }, { status: 500 })
    }
    
    return NextResponse.json({
      assetId: asset._id,
      url: asset.url,
    })
  } catch (e) {
    console.error('Upload error:', e)
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 })
  }
}
