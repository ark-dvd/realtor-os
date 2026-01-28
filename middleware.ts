import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Allowed admin emails - must match lib/auth/config.ts
// Stored in lowercase for normalized comparison
const ALLOWED_ADMIN_EMAILS = [
  'merrav@merrav.com',
  'arik@daflash.com',
]

function normalizeEmail(email: string | null | undefined): string {
  return (email ?? '').trim().toLowerCase()
}

function isAllowedAdmin(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email)
  if (!normalized) return false
  return ALLOWED_ADMIN_EMAILS.includes(normalized)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (not /api/auth which NextAuth needs)
  if (pathname.startsWith('/admin')) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      // FAIL CLOSED: No valid session = redirect to sign in
      if (!token || !token.email || !isAllowedAdmin(token.email)) {
        // If not authenticated, let the admin page handle showing the login
        // We set a header to indicate auth status
        const response = NextResponse.next()
        response.headers.set('x-admin-authenticated', 'false')
        return response
      }

      // Authenticated admin - proceed
      const response = NextResponse.next()
      response.headers.set('x-admin-authenticated', 'true')
      response.headers.set('x-admin-email', token.email)
      return response
    } catch (error) {
      // FAIL CLOSED: Any error = treat as unauthenticated
      console.error('Middleware auth error:', error)
      const response = NextResponse.next()
      response.headers.set('x-admin-authenticated', 'false')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
