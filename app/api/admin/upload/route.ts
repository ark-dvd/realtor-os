import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { getSanityWriteClient, isSanityWriteConfigured } from '@/lib/sanity'

// File size limits
const MAX_IMAGE_SIZE = 10 * 1024 * 1024  // 10MB for images
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB for videos
const MAX_FILE_SIZE = 25 * 1024 * 1024   // 25MB for documents

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov']
const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  if (!isSanityWriteConfigured()) {
    return NextResponse.json({ error: 'Sanity not configured for uploads' }, { status: 500 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const uploadType = formData.get('type') as string || 'image' // 'image', 'video', 'file'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const mimeType = file.type
    const fileSize = file.size

    // Determine file category and validate
    let isImage = ALLOWED_IMAGE_TYPES.includes(mimeType)
    let isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType)
    let isDocument = ALLOWED_DOC_TYPES.includes(mimeType)

    // Override based on uploadType hint
    if (uploadType === 'video') {
      if (!isVideo) {
        return NextResponse.json({ 
          error: `Invalid video format. Allowed: MP4, WebM, MOV` 
        }, { status: 400 })
      }
    } else if (uploadType === 'file') {
      if (!isDocument && !isImage) {
        return NextResponse.json({ 
          error: `Invalid file format. Allowed: PDF, DOC, DOCX, or images` 
        }, { status: 400 })
      }
    } else {
      // Default: image
      if (!isImage) {
        return NextResponse.json({ 
          error: `Invalid image format. Allowed: JPEG, PNG, GIF, WebP, AVIF` 
        }, { status: 400 })
      }
    }

    // Size validation
    if (isImage && fileSize > MAX_IMAGE_SIZE) {
      return NextResponse.json({ 
        error: `Image too large. Max size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB` 
      }, { status: 400 })
    }
    if (isVideo && fileSize > MAX_VIDEO_SIZE) {
      return NextResponse.json({ 
        error: `Video too large. Max size: ${MAX_VIDEO_SIZE / 1024 / 1024}MB` 
      }, { status: 400 })
    }
    if (isDocument && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 400 })
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Sanity
    const client = getSanityWriteClient()
    
    let asset
    if (isImage) {
      asset = await client.assets.upload('image', buffer, {
        filename: file.name,
        contentType: mimeType,
      })
    } else {
      // Videos and documents use 'file' type
      asset = await client.assets.upload('file', buffer, {
        filename: file.name,
        contentType: mimeType,
      })
    }

    return NextResponse.json({
      success: true,
      assetId: asset._id,
      url: asset.url,
      originalFilename: asset.originalFilename,
      mimeType: asset.mimeType,
      size: asset.size,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 })
  }
}
