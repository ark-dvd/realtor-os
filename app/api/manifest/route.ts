import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/data-fetchers'

export const revalidate = 60

export async function GET() {
  try {
    const settings = await getSettings()

    // Icon priority: pwaIcon > logo > default
    const iconUrl = settings.pwaIcon || settings.logo || '/default-pwa-icon.png'

    const manifest = {
      name: settings.siteTitle || settings.agentName || 'Realtor OS',
      short_name: settings.agentName || 'Admin',
      description: 'Real estate management dashboard',
      start_url: '/admin',
      display: 'standalone',
      background_color: '#1a2332',
      theme_color: '#1a2332',
      orientation: 'portrait-primary',
      icons: [
        {
          src: iconUrl,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: iconUrl,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    }

    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Manifest generation error:', error)

    // Return a minimal fallback manifest
    return NextResponse.json(
      {
        name: 'Realtor OS',
        short_name: 'Admin',
        start_url: '/admin',
        display: 'standalone',
        background_color: '#1a2332',
        theme_color: '#1a2332',
        icons: [
          {
            src: '/default-pwa-icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/manifest+json',
        },
      }
    )
  }
}
