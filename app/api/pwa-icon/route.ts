import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/data-fetchers'

export const revalidate = 60

export async function GET() {
  try {
    const settings = await getSettings()

    // Icon priority: pwaIcon > logo > default
    const iconUrl = settings.pwaIcon || settings.logo || '/default-pwa-icon.png'

    // If it's an external URL (Sanity CDN), redirect to it
    if (iconUrl.startsWith('http')) {
      return NextResponse.redirect(iconUrl)
    }

    // If it's a local path, redirect to the full URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.merravberko.com'
    return NextResponse.redirect(`${baseUrl}${iconUrl}`)
  } catch (error) {
    console.error('PWA icon redirect error:', error)
    // Fallback to default icon
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.merravberko.com'
    return NextResponse.redirect(`${baseUrl}/default-pwa-icon.png`)
  }
}
