import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getSettings } from '@/lib/data-fetchers'

// Revalidate layout data every 60 seconds
export const revalidate = 60

export const metadata: Metadata = {
  title: {
    template: '%s | Merrav Berko Real Estate',
    default: 'Merrav Berko - Austin Luxury Real Estate',
  },
  description: 'Your trusted partner for luxury real estate in Austin, Texas. Personalized service, local expertise, exceptional results.',
  keywords: ['Austin real estate', 'luxury homes', 'Merrav Berko', 'Texas realtor', 'home buying', 'home selling'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B2B4B',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen bg-brand-cream">
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
