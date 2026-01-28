import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isAllowedAdmin } from './config'

export interface AuthUser {
  id: string
  email: string
  fullName?: string
}

/**
 * Validates NextAuth session for admin API routes.
 * FAIL CLOSED: Returns 401 if session is missing or invalid.
 */
export async function requireAdmin(request: NextRequest): Promise<{ user: AuthUser } | { error: NextResponse }> {
  try {
    // Get JWT token from NextAuth session cookie
    // Must specify cookieName to match the custom name set in lib/auth/config.ts
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: 'next-auth.session-token',
    })

    // FAIL CLOSED: No token = no access
    if (!token) {
      return {
        error: NextResponse.json(
          { error: 'Unauthorized', message: 'Authentication required' },
          { status: 401 }
        ),
      }
    }

    // FAIL CLOSED: Token must have email
    if (!token.email) {
      return {
        error: NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid session' },
          { status: 401 }
        ),
      }
    }

    // FAIL CLOSED: Email must be in allowlist
    if (!isAllowedAdmin(token.email)) {
      console.warn(`Admin API access denied: ${token.email}`)
      return {
        error: NextResponse.json(
          { error: 'Forbidden', message: 'Admin access denied' },
          { status: 403 }
        ),
      }
    }

    // Success: return user info
    return {
      user: {
        id: token.sub || 'admin',
        email: token.email,
        fullName: token.name || undefined,
      },
    }
  } catch (error) {
    // FAIL CLOSED: Any error = deny access
    console.error('Admin auth error:', error)
    return {
      error: NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication failed' },
        { status: 401 }
      ),
    }
  }
}

// Alias for compatibility with existing code
export const requireAuth = requireAdmin

// Rate limiting helper (unchanged)
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
