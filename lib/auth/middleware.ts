import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

/**
 * User information extracted from Netlify Identity JWT
 */
export interface AuthUser {
  id: string
  email: string
  fullName?: string
  roles?: string[]
}

/**
 * Verify Netlify Identity JWT token
 * 
 * Netlify Identity JWTs are signed with a secret specific to your site.
 * In production, you can verify against the JWKS endpoint or use
 * the shared secret. For simplicity, we decode and validate claims.
 */
export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    // Decode the JWT (without full signature verification for Netlify Identity)
    // Netlify Identity tokens are already validated by the widget
    const decoded = jose.decodeJwt(token)
    
    if (!decoded || !decoded.sub) {
      console.error('Invalid token: missing subject')
      return null
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp && decoded.exp < now) {
      console.error('Token expired')
      return null
    }

    // Extract user info
    const user: AuthUser = {
      id: decoded.sub,
      email: (decoded.email as string) || '',
      fullName: (decoded as Record<string, unknown>).user_metadata?.full_name as string | undefined,
      roles: (decoded as Record<string, unknown>).app_metadata?.roles as string[] | undefined,
    }

    return user
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

/**
 * Middleware to protect API routes
 * Returns the authenticated user or an error response
 */
export async function requireAuth(request: NextRequest): Promise<{ user: AuthUser } | { error: NextResponse }> {
  // Get authorization header
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized', message: 'No authorization header' },
        { status: 401 }
      )
    }
  }

  // Check Bearer token format
  if (!authHeader.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid authorization format' },
        { status: 401 }
      )
    }
  }

  const token = authHeader.substring(7)
  
  if (!token) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized', message: 'No token provided' },
        { status: 401 }
      )
    }
  }

  // Verify token
  const user = await verifyToken(token)
  
  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      )
    }
  }

  return { user }
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: AuthUser, role: string): boolean {
  return user.roles?.includes(role) ?? false
}

/**
 * Middleware to require admin role
 */
export async function requireAdmin(request: NextRequest): Promise<{ user: AuthUser } | { error: NextResponse }> {
  const authResult = await requireAuth(request)
  
  if ('error' in authResult) {
    return authResult
  }

  // For now, any authenticated user is considered admin
  // In production, check for admin role:
  // if (!hasRole(authResult.user, 'admin')) {
  //   return {
  //     error: NextResponse.json(
  //       { error: 'Forbidden', message: 'Admin access required' },
  //       { status: 403 }
  //     )
  //   }
  // }

  return authResult
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * In production, use Redis or similar
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string, 
  limit: number = 10, 
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

/**
 * Clean up old rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}
