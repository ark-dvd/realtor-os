// ═══════════════════════════════════════════════════════════════════════════
// 404 NOT FOUND PAGE
// ═══════════════════════════════════════════════════════════════════════════

import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-neutral-cream">
      <div className="text-center px-6">
        <span className="inline-block w-12 h-px bg-accent-gold mb-8" />
        
        <h1 className="font-heading text-display-lg text-neutral-charcoal mb-4">
          404
        </h1>
        
        <p className="text-xl text-neutral-silver mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-accent">
            Go Home
          </Link>
          <Link href="/properties" className="btn-secondary">
            View Properties
          </Link>
        </div>
      </div>
    </section>
  )
}
