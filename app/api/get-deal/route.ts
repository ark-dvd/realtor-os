// ═══════════════════════════════════════════════════════════════════════════
// GET DEAL API ROUTE
// Returns active deal for authenticated client
// CRITICAL: Ensures tenant AND client isolation
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { sanityClientPrivate } from '@/lib/sanity/client'
import { DEAL_BY_CLIENT } from '@/lib/sanity/queries'
import type { ActiveDeal, ApiResponse } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    // Get client email from query params
    const { searchParams } = new URL(request.url)
    const clientEmail = searchParams.get('email')

    if (!clientEmail) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Email parameter required' },
        { status: 400 }
      )
    }

    // Get domain from headers (set by middleware)
    const domain = request.headers.get('x-tenant-domain') ||
                   request.headers.get('x-forwarded-host')?.replace(/:\d+$/, '').replace(/^www\./, '') ||
                   process.env.DEFAULT_TENANT_DOMAIN ||
                   'demo.realtoros.com'

    // CRITICAL: Fetch deal with both tenant AND client isolation
    // This prevents cross-tenant and cross-client data leakage
    const deal = await sanityClientPrivate.fetch<ActiveDeal>(
      DEAL_BY_CLIENT,
      { 
        currentDomain: domain,
        clientEmail: clientEmail.toLowerCase(),
      }
    )

    if (!deal) {
      return NextResponse.json<ApiResponse<null>>({
        success: true,
        data: null,
        message: 'No active deal found',
      })
    }

    return NextResponse.json<ApiResponse<ActiveDeal>>({
      success: true,
      data: deal,
    })
  } catch (error) {
    console.error('Error fetching deal:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
