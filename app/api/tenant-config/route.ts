// ═══════════════════════════════════════════════════════════════════════════
// TENANT CONFIG API ROUTE
// Returns tenant configuration based on domain
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { isSanityConfigured, sanityClient, DEMO_TENANT } from '@/lib/sanity/client'
import { AGENT_SETTINGS_BY_DOMAIN } from '@/lib/sanity/queries'
import type { AgentSettings, ApiResponse } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Return demo tenant if Sanity not configured
    if (!isSanityConfigured) {
      return NextResponse.json<ApiResponse<AgentSettings>>({
        success: true,
        data: DEMO_TENANT,
      })
    }

    // Get domain from headers (set by middleware)
    const domain = request.headers.get('x-tenant-domain') ||
                   request.headers.get('x-forwarded-host')?.replace(/:\d+$/, '').replace(/^www\./, '') ||
                   process.env.DEFAULT_TENANT_DOMAIN ||
                   'demo.realtoros.com'

    // Fetch tenant config from Sanity
    const tenant = await sanityClient.fetch<AgentSettings>(
      AGENT_SETTINGS_BY_DOMAIN,
      { currentDomain: domain }
    )

    if (!tenant) {
      return NextResponse.json<ApiResponse<AgentSettings>>({
        success: true,
        data: DEMO_TENANT,
      })
    }

    return NextResponse.json<ApiResponse<AgentSettings>>({
      success: true,
      data: tenant,
    })
  } catch (error) {
    console.error('Error fetching tenant config:', error)
    return NextResponse.json<ApiResponse<AgentSettings>>({
      success: true,
      data: DEMO_TENANT,
    })
  }
}
