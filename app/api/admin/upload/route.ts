import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, checkRateLimit } from '@/lib/auth/middleware'
import { getSanityWriteClient } from '@/lib/sanity'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error
  if (!checkRateLimit(auth.user.id, 10, 60000)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await getSanityWriteClient().assets.upload('image', buffer, { filename: file.name.replace(/[^a-zA-Z0-9.-]/g, '_'), contentType: file.type })
    return NextResponse.json({ assetId: asset._id, url: asset.url })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Upload failed' }, { status: 500 }) }
}
