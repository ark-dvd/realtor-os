'use client'

// ═══════════════════════════════════════════════════════════════════════════
// STICKY ACTION BAR
// Fixed bottom bar that appears on scroll with price and CTA
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Phone, Share2, Heart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface StickyActionBarProps {
  price: number
  title: string
  agentPhone?: string
  onScheduleTour?: () => void
  onShare?: () => void
  onSave?: () => void
  showAfterScroll?: number // px to scroll before showing
  className?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function StickyActionBar({
  price,
  title,
  agentPhone,
  onScheduleTour,
  onShare,
  onSave,
  showAfterScroll = 400,
  className,
}: StickyActionBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll])

  // Handle share
  const handleShare = async () => {
    if (onShare) {
      onShare()
      return
    }

    // Native share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this property: ${title}`,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled or error
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  // Handle save
  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave?.()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-pearl shadow-dramatic',
            className
          )}
        >
          <div className="container-cinematic py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Price & Title */}
              <div className="hidden sm:block min-w-0 flex-1">
                <p className="font-heading text-2xl font-semibold text-neutral-charcoal">
                  {formatPrice(price)}
                </p>
                <p className="text-sm text-neutral-silver truncate">{title}</p>
              </div>

              {/* Mobile Price */}
              <div className="sm:hidden">
                <p className="font-heading text-xl font-semibold text-neutral-charcoal">
                  {formatPrice(price)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                    isSaved
                      ? 'bg-red-50 text-red-500'
                      : 'bg-neutral-pearl text-neutral-slate hover:bg-neutral-200'
                  )}
                  aria-label={isSaved ? 'Remove from saved' : 'Save property'}
                >
                  <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-neutral-pearl text-neutral-slate flex items-center justify-center hover:bg-neutral-200 transition-all"
                  aria-label="Share property"
                >
                  <Share2 size={18} />
                </button>

                {/* Call Button */}
                {agentPhone && (
                  <a
                    href={`tel:${agentPhone}`}
                    className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-neutral-charcoal text-white rounded-sm hover:bg-neutral-graphite transition-colors"
                  >
                    <Phone size={16} />
                    <span className="text-sm font-medium">Call Agent</span>
                  </a>
                )}

                {/* Schedule Tour Button */}
                <button
                  onClick={onScheduleTour}
                  className="btn-accent flex items-center gap-2"
                >
                  <Calendar size={16} />
                  <span className="hidden sm:inline">Schedule Tour</span>
                  <span className="sm:hidden">Book Tour</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default StickyActionBar
