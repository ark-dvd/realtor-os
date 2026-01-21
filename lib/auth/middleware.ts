import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

export interface AuthUser {
  id: string
  email: string
  fullName?: string
  roles: string[]
}

interface JWKSCache { keySet: jose.JWTVerifyGetKey; fetchedAt: number }
let jwksCache: JWKSCache | null = null
const JWKS_CACHE_TTL_MS = 5 * 60 * 1000

function getConfig() {
  const siteUrl = process.env.URL || process.env.NETLIFY_SITE_URL || ''
  return {
    jwksUrl: siteUrl ? `${siteUrl}/.netlify/identity/.well-known/jwks.json` : '',
    issuer: siteUrl ? `${siteUrl}/.netlify/identity` : '',
    adminEmails: (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean),
    allowAnyAuthenticated: process.env.ADMIN_ALLOW_ANY_AUTHENTICATED === 'true',
  }
}

async function getJWKS(): Promise<jose.JWTVerifyGetKey> {
  const config = getConfig()
  const now = Date.now()
  if (jwksCache && (now - jwksCache.fetchedAt) < JWKS_CACHE_TTL_MS) return jwksCache.keySet
  if (!config.jwksUrl) throw new Error('JWKS URL not configured')
  const keySet = jose.createRemoteJWKSet(new URL(config.jwksUrl))
  jwksCache = { keySet, fetchedAt: now }
  return keySet
}

async function verifyToken(token: string): Promise<AuthUser | null> {
  const config = getConfig()
  try {
    const jwks = await getJWKS()
    const { payload } = await jose.jwtVerify(token, jwks, { issuer: config.issuer || undefined, clockTolerance: 60 })
    if (!payload.sub) return null
    const email = (payload.email as string) || ''
    const appMetadata = (payload.app_metadata as Record<string, unknown>) || {}
    const userMetadata = (payload.user_metadata as Record<string, unknown>) || {}
    const roles: string[] = Array.isArray(appMetadata.roles) ? appMetadata.roles.map(r => String(r)) : []
    return { id: payload.sub, email, fullName: (userMetadata.full_name as string) || undefined, roles }
  } catch (error) {
    if (error instanceof jose.errors.JWSSignatureVerificationFailed) console.error('Auth: SIGNATURE VERIFICATION FAILED')
    else console.error('Auth: Token verification error')
    return null
  }
}

function isAdmin(user: AuthUser): boolean {
  const config = getConfig()
  if (config.allowAnyAuthenticated) { console.warn('⚠️ ADMIN_ALLOW_ANY_AUTHENTICATED=true - DEV ONLY!'); return true }
  if (user.roles.includes('admin')) return true
  if (config.adminEmails.length > 0 && user.email && config.adminEmails.includes(user.email.toLowerCase())) return true
  return false
}

export async function requireAuth(request: NextRequest): Promise<{ user: AuthUser } | { error: NextResponse }> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: NextResponse.json({ error: 'Unauthorized', message: 'Bearer token required' }, { status: 401 }) }
  }
  const token = authHeader.slice(7)
  if (!token) return { error: NextResponse.json({ error: 'Unauthorized', message: 'Token is empty' }, { status: 401 }) }
  const user = await verifyToken(token)
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized', message: 'Invalid or expired token' }, { status: 401 }) }
  return { user }
}

export async function requireAdmin(request: NextRequest): Promise<{ user: AuthUser } | { error: NextResponse }> {
  const authResult = await requireAuth(request)
  if ('error' in authResult) return authResult
  if (!isAdmin(authResult.user)) {
    console.warn(`Admin access DENIED for: ${authResult.user.email}`)
    return { error: NextResponse.json({ error: 'Forbidden', message: 'Admin privileges required' }, { status: 403 }) }
  }
  return authResult
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
export function checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  if (!record || now > record.resetTime) { rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs }); return true }
  if (record.count >= limit) return false
  record.count++
  return true
}
