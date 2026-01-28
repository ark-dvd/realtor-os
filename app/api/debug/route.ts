import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Debug endpoint to diagnose authentication issues.
 * Returns cookie info, token verification result, and env var presence.
 *
 * REMOVE THIS IN PRODUCTION AFTER DEBUGGING
 */
export async function GET(request: NextRequest) {
  const cookies = request.cookies.getAll()
  const cookieNames = cookies.map(c => c.name)

  // Check for session cookies (both possible names)
  const sessionCookie = cookies.find(c => c.name === 'next-auth.session-token')
  const secureSessionCookie = cookies.find(c => c.name === '__Secure-next-auth.session-token')

  // Try to get token with default settings
  let tokenDefault = null
  let tokenDefaultError = null
  try {
    tokenDefault = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
  } catch (e) {
    tokenDefaultError = e instanceof Error ? e.message : String(e)
  }

  // Try to get token with explicit cookie name
  let tokenExplicit = null
  let tokenExplicitError = null
  try {
    tokenExplicit = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: 'next-auth.session-token',
    })
  } catch (e) {
    tokenExplicitError = e instanceof Error ? e.message : String(e)
  }

  // Try with __Secure- prefix
  let tokenSecure = null
  let tokenSecureError = null
  try {
    tokenSecure = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: '__Secure-next-auth.session-token',
    })
  } catch (e) {
    tokenSecureError = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),

    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthSecretLength: process.env.NEXTAUTH_SECRET?.length || 0,
      nextAuthUrl: process.env.NEXTAUTH_URL || '(not set)',
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    },

    cookies: {
      allCookieNames: cookieNames,
      hasSessionCookie: !!sessionCookie,
      hasSecureSessionCookie: !!secureSessionCookie,
      sessionCookieValue: sessionCookie ? `${sessionCookie.value.substring(0, 20)}...` : null,
      secureSessionCookieValue: secureSessionCookie ? `${secureSessionCookie.value.substring(0, 20)}...` : null,
    },

    tokenVerification: {
      default: {
        success: !!tokenDefault,
        email: tokenDefault?.email || null,
        error: tokenDefaultError,
      },
      explicitCookieName: {
        success: !!tokenExplicit,
        email: tokenExplicit?.email || null,
        error: tokenExplicitError,
      },
      secureCookieName: {
        success: !!tokenSecure,
        email: tokenSecure?.email || null,
        error: tokenSecureError,
      },
    },

    diagnosis: getDiagnosis(
      !!sessionCookie,
      !!secureSessionCookie,
      !!tokenDefault,
      !!tokenExplicit,
      !!tokenSecure
    ),
  })
}

function getDiagnosis(
  hasSessionCookie: boolean,
  hasSecureCookie: boolean,
  tokenDefault: boolean,
  tokenExplicit: boolean,
  tokenSecure: boolean
): string {
  if (!hasSessionCookie && !hasSecureCookie) {
    return 'NO_COOKIE: No session cookie found. User may not be logged in, or cookie is not being sent with API requests.'
  }

  if (hasSecureCookie && !hasSessionCookie) {
    if (tokenSecure && !tokenDefault) {
      return 'COOKIE_NAME_MISMATCH: Cookie uses __Secure- prefix but getToken() is not looking for it. Fix: Add cookieName option to getToken().'
    }
  }

  if (hasSessionCookie && !tokenExplicit) {
    return 'TOKEN_VERIFICATION_FAILED: Cookie exists but token verification failed. Likely NEXTAUTH_SECRET mismatch between login and verification.'
  }

  if (tokenExplicit && !tokenDefault) {
    return 'COOKIE_NAME_ISSUE: Token works with explicit cookie name but not with default. Fix: Add cookieName option to getToken() in middleware.'
  }

  if (tokenDefault) {
    return 'OK: Everything appears to be working correctly.'
  }

  return 'UNKNOWN: Unable to determine the issue. Check the detailed output above.'
}
