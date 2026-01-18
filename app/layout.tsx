import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RealtorOS - Luxury Real Estate',
  description: 'Discover exceptional properties with personalized service',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A1A1A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-primary: #1A1A1A;
            --color-secondary: #2D2D2D;
            --color-accent: #C9A962;
            --font-heading: 'Cormorant Garamond', serif;
            --font-body: 'Plus Jakarta Sans', sans-serif;
          }
        `}} />
      </head>
      <body className="min-h-screen bg-neutral-cream antialiased">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-pearl">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <a href="/" className="font-heading text-2xl font-semibold text-neutral-charcoal">
              RealtorOS
            </a>
            <nav className="hidden md:flex items-center gap-8">
              <a href="/" className="text-neutral-slate hover:text-accent-gold transition-colors">Home</a>
              <a href="/properties" className="text-neutral-slate hover:text-accent-gold transition-colors">Properties</a>
              <a href="/about" className="text-neutral-slate hover:text-accent-gold transition-colors">About</a>
              <a href="/contact" className="text-neutral-slate hover:text-accent-gold transition-colors">Contact</a>
            </nav>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-neutral-charcoal text-white py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-white/60">© 2024 RealtorOS. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
