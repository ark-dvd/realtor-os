'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface DemoModeBannerProps {
  isDemoMode: boolean
  reason?: string
}

/**
 * Banner shown when the site is displaying demo data instead of real Sanity content.
 * This helps the agent know something is wrong with their Sanity configuration.
 */
export function DemoModeBanner({ isDemoMode, reason }: DemoModeBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  
  // Don't show if not in demo mode or dismissed
  if (!isDemoMode || dismissed) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-500 text-amber-950 py-2 px-4">
      <div className="container-wide flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span>
            <strong>Demo Mode:</strong> Showing sample data. 
            {reason && <span className="hidden md:inline"> ({reason})</span>}
            {' '}
            <a href="/admin" className="underline hover:no-underline">
              Configure Sanity →
            </a>
          </span>
        </div>
        <button 
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-amber-600/20 rounded"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
