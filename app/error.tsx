'use client'

// ═══════════════════════════════════════════════════════════════════════════
// ERROR PAGE
// Global error boundary
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <section className="min-h-screen flex items-center justify-center bg-neutral-cream">
      <div className="text-center px-6 max-w-lg">
        <span className="inline-block w-12 h-px bg-red-500 mb-8" />
        
        <h1 className="font-heading text-display-sm text-neutral-charcoal mb-4">
          Something went wrong
        </h1>
        
        <p className="text-neutral-silver mb-8">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={reset}
            className="btn-accent"
          >
            Try Again
          </button>
          <a href="/" className="btn-secondary">
            Go Home
          </a>
        </div>

        {/* Error details for development */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left bg-neutral-charcoal text-white p-4 rounded text-sm">
            <summary className="cursor-pointer mb-2">Error Details</summary>
            <pre className="overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </section>
  )
}
