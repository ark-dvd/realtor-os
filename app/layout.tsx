import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { DemoModeBanner } from '@/components/DemoModeBanner'
import { Providers } from './providers'
import { getSettings, isDemoMode, getDemoReason } from '@/lib/data-fetchers'

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-GLW98636RL'

export const revalidate = 60

export const metadata: Metadata = {
  metadataBase: new URL('https://www.merravberko.com'),
  title: {
    template: '%s | Merrav Berko Real Estate',
    default: 'Merrav Berko - Austin Luxury Real Estate',
  },
  description: 'Your trusted partner for luxury real estate in Austin, Texas. Personalized service, local expertise, exceptional results.',
  keywords: ['Austin real estate', 'luxury homes', 'Merrav Berko', 'Texas realtor', 'home buying', 'home selling', 'Austin homes for sale'],
  authors: [{ name: 'Merrav Berko' }],
  creator: 'Merrav Berko Real Estate',
  publisher: 'Merrav Berko Real Estate',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.merravberko.com',
    siteName: 'Merrav Berko Real Estate',
    title: 'Merrav Berko - Austin Luxury Real Estate',
    description: 'Your trusted partner for luxury real estate in Austin, Texas.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Merrav Berko Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merrav Berko - Austin Luxury Real Estate',
    description: 'Your trusted partner for luxury real estate in Austin, Texas.',
    images: ['/images/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://www.merravberko.com',
  },
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/api/pwa-icon" />
        <link rel="manifest" href="/api/manifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Admin" />
        <JsonLd type="RealEstateAgent" settings={settings} />
        <JsonLd type="WebSite" settings={settings} />
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-brand-cream">
        <Providers>
          <DemoModeBanner isDemoMode={isDemoMode()} reason={getDemoReason() || undefined} />
          <Header settings={settings} />
          <main>{children}</main>
          <Footer settings={settings} />
        </Providers>
      </body>
    </html>
  )
}
