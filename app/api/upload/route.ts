import { NextResponse } from 'next/server'

// Public upload endpoint - redirects to admin version
export async function POST() {
  return NextResponse.json({ error: 'Use /api/admin/upload instead' }, { status: 403 })
}

export async function GET() {
  return NextResponse.json({ message: 'Upload endpoint. Use POST to /api/admin/upload with auth.' })
}
