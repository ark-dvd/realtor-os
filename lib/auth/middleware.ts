import { NextRequest, NextResponse } from 'next/server'

// Simple password - must match the one in admin/page.tsx
const ADMIN_PASSWORD = 'Peace&Love202^'
const ADMIN_TOKEN = Buffer.from(ADMIN_PASSWORD).toString('base64')

export interface AuthUser {
  id: string
  email: string
  fullName?: string
  roles: string[]
}

function verifySimpleToken(token: string): AuthUser | null {
  // Check if it's our simple auth token
  if (token === ADMIN_TOKEN) {
    return {
      id: 'admin',
      email: 'admin@merrav.com',
      fullName: 'Admin',
      roles: ['admin']
    }
  }
  return null
}

export async function requireAuth(request: NextRequest): Promise<{ user: AuthUser } | { error: NextResponse }> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: NextResponse.json({ error: 'Unauthorized', message: 'Bearer token required' }, { status: 401 }) }
  }
  
  const token = authHeader.slice(7)
  if (!token) {
    return { error: NextResponse.json({ error: 'Unauthorized', message: 'Token is empty' }, { status: 401 }) }
  }
  
  // Try simple auth first
  const user = verifySimpleToken(token)
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized', message: 'Invalid token' }, { status: 401 }) }
  }
  
  return { user }
}

export async function requireAdmin(request: NextRequest): Promise<{ user: AuthUser } | { error: NextResponse }> {
  const authResult = await requireAuth(request)
  if ('error' in authResult) return authResult
  
  // For simple auth, anyone authenticated is admin
  if (!authResult.user.roles.includes('admin')) {
    return { error: NextResponse.json({ error: 'Forbidden', message: 'Admin privileges required' }, { status: 403 }) }
  }
  
  return authResult
}

// Rate limiting helper
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) return false
  record.count++
  return true
}
