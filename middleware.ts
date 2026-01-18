// ═══════════════════════════════════════════════════════════════════════════
// NEXT.JS MIDDLEWARE
// Handles multi-tenant domain detection and routing
// ═══════════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

// Paths that should bypass tenant resolution
const PUBLIC_PATHS = [
  '/api/health',
  '/api/webhooks',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
]

// Preview/development domains that use default tenant
const PREVIEW_PATTERNS = [
  'localhost',
  '127.0.0.1',
  '.netlify.app',
  '.vercel.app',
]

// Default tenant for development
const DEFAULT_TENANT_DOMAIN = process.env.DEFAULT_TENANT_DOMAIN || 'demo.realtoros.com'

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize hostname (remove port, www, etc.)
 */
function normalizeHostname(hostname: string): string {
  return hostname
    .toLowerCase()
    .replace(/:\d+$/, '') // Remove port
    .replace(/^www\./, '') // Remove www prefix
}

/**
 * Check if request should bypass middleware
 */
function shouldBypass(pathname: string): boolean {
  return PUBLIC_PATHS.some(path => pathname.startsWith(path))
}

/**
 * Check if hostname is a preview/development domain
 */
function isPreviewDomain(hostname: string): boolean {
  return PREVIEW_PATTERNS.some(pattern => hostname.includes(pattern))
}

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Bypass middleware for public paths
  if (shouldBypass(pathname)) {
    return NextResponse.next()
  }

  // Get hostname from request
  const hostname = request.headers.get('host') || request.headers.get('x-forwarded-host') || ''
  const normalizedHostname = normalizeHostname(hostname)

  // Determine tenant domain
  let tenantDomain: string
  
  if (isPreviewDomain(normalizedHostname)) {
    // Use default tenant for preview/development
    tenantDomain = DEFAULT_TENANT_DOMAIN
    console.log(`[Middleware] Preview domain detected, using default tenant: ${tenantDomain}`)
  } else {
    // Use actual domain for production
    tenantDomain = normalizedHostname
  }

  // Create response with tenant info in headers
  const response = NextResponse.next()
  
  // Set tenant domain header for downstream use
  response.headers.set('x-tenant-domain', tenantDomain)
  response.headers.set('x-original-host', normalizedHostname)

  // For API routes, also set in request headers
  if (pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-tenant-domain', tenantDomain)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return response
}

// ─────────────────────────────────────────────────────────────────────────────
// MATCHER CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|images|videos|fonts).*)',
  ],
}
