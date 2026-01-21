import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, checkRateLimit } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  // Require authentication
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  // Rate limiting: 10 uploads per minute per user
  if (!checkRateLimit(auth.user.id, 10, 60000)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before uploading more images.' },
      { status: 429 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Sanitize filename
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')

    // Upload to Sanity
    const client = getSanityWriteClient()
    const asset = await client.assets.upload('image', buffer, {
      filename: sanitizedFilename,
      contentType: file.type,
    })

    return NextResponse.json({
      assetId: asset._id,
      url: asset.url,
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}

// Block other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
