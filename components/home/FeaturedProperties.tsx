'use client'

// ═══════════════════════════════════════════════════════════════════════════
// FEATURED PROPERTIES SECTION
// Grid display of featured property listings
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PropertyCard, PropertyCardSkeleton } from '@/components/property/PropertyCard'
import type { PropertyCard as PropertyCardType } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface FeaturedPropertiesProps {
  properties: PropertyCardType[]
  title?: string
  subtitle?: string
  showViewAll?: boolean
  isLoading?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.65, 0, 0.35, 1],
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function FeaturedProperties({
  properties,
  title = 'Featured Properties',
  subtitle = 'Discover exceptional homes curated just for you',
  showViewAll = true,
  isLoading = false,
}: FeaturedPropertiesProps) {
  return (
    <section className="section-dramatic bg-neutral-cream">
      <div className="container-cinematic">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12 lg:mb-16"
        >
          {/* Decorative Element */}
          <motion.div variants={headerVariants} className="mb-6">
            <span className="inline-block w-12 h-px bg-accent-gold" />
          </motion.div>

          <motion.h2
            variants={headerVariants}
            className="font-heading text-display-md text-neutral-charcoal mb-4"
          >
            {title}
          </motion.h2>

          <motion.p
            variants={headerVariants}
            className="font-body text-lg text-neutral-silver max-w-xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Properties Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {isLoading
            ? // Skeleton Loaders
              Array.from({ length: 6 }).map((_, index) => (
                <PropertyCardSkeleton key={index} />
              ))
            : // Property Cards
              properties.map((property, index) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  priority={index < 3}
                />
              ))}
        </motion.div>

        {/* View All Link */}
        {showViewAll && properties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 font-body text-sm tracking-wider uppercase text-neutral-charcoal hover:text-accent-gold transition-colors group"
            >
              <span>View All Properties</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && properties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-neutral-silver text-lg mb-4">
              No featured properties at the moment.
            </p>
            <Link href="/contact" className="btn-secondary">
              Contact for Off-Market Listings
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default FeaturedProperties
