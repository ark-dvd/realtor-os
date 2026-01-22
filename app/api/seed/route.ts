import { NextResponse } from 'next/server'

// Public seed endpoint - redirects to admin version
export async function POST() {
  return NextResponse.json({ error: 'Use /api/admin/seed instead' }, { status: 403 })
}

export async function GET() {
  return NextResponse.json({ message: 'Seed endpoint. Use POST to /api/admin/seed with auth.' })
}
