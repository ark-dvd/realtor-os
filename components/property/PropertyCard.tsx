'use client'

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTY CARD COMPONENT
// Elegant card for displaying property listings
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bed, Bath, Square, MapPin } from 'lucide-react'
import type { PropertyCardProps } from '@/lib/types'
import { cn, formatPrice, formatSqFt, getStatusLabel, getStatusColor, getPropertyUrl } from '@/lib/utils'
import { getImageUrl } from '@/lib/sanity/client'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const {
    title,
    slug,
    status,
    price,
    address,
    specs,
    heroImage,
  } = property

  const statusStyle = getStatusColor(status)
  const imageUrl = getImageUrl(heroImage, { width: 800, height: 600, fit: 'crop' })
  const propertyUrl = getPropertyUrl(slug.current)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="card-property group"
    >
      <Link href={propertyUrl} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-pearl">
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={cn(
                'px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-sm',
                statusStyle.bg,
                statusStyle.text
              )}
            >
              {getStatusLabel(status)}
            </span>
          </div>

          {/* Price Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <p className="font-heading text-2xl md:text-3xl text-white font-semibold">
              {formatPrice(price)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-heading text-xl font-semibold text-neutral-charcoal mb-2 line-clamp-1 group-hover:text-accent-gold transition-colors">
            {title}
          </h3>

          {/* Address */}
          <div className="flex items-center gap-1.5 text-neutral-silver mb-4">
            <MapPin size={14} className="flex-shrink-0" />
            <p className="text-sm line-clamp-1">
              {address.city}, {address.state}
              {address.neighborhood && ` • ${address.neighborhood}`}
            </p>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-5 text-neutral-slate">
            <div className="flex items-center gap-1.5">
              <Bed size={16} className="text-accent-gold" />
              <span className="text-sm font-medium">{specs.bedrooms}</span>
              <span className="text-xs text-neutral-silver">Beds</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Bath size={16} className="text-accent-gold" />
              <span className="text-sm font-medium">{specs.bathrooms}</span>
              <span className="text-xs text-neutral-silver">Baths</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Square size={16} className="text-accent-gold" />
              <span className="text-sm font-medium">{formatSqFt(specs.squareFeet)}</span>
              <span className="text-xs text-neutral-silver">Sq Ft</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────────────────────────────────────

export function PropertyCardSkeleton() {
  return (
    <div className="card-property">
      <div className="relative aspect-[4/3] bg-neutral-pearl skeleton" />
      <div className="p-5 space-y-4">
        <div className="h-6 bg-neutral-pearl skeleton rounded w-3/4" />
        <div className="h-4 bg-neutral-pearl skeleton rounded w-1/2" />
        <div className="flex gap-5">
          <div className="h-4 bg-neutral-pearl skeleton rounded w-16" />
          <div className="h-4 bg-neutral-pearl skeleton rounded w-16" />
          <div className="h-4 bg-neutral-pearl skeleton rounded w-20" />
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
