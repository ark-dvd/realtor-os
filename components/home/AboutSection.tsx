'use client'

// ═══════════════════════════════════════════════════════════════════════════
// ABOUT SECTION
// Agent introduction section with image and bio
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import { Award, Users, Home, Star } from 'lucide-react'
import { useTenant } from '@/components/layout/TenantProvider'
import { getImageUrl } from '@/lib/sanity/client'

// ─────────────────────────────────────────────────────────────────────────────
// STATS DATA
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_STATS = [
  { icon: Home, value: '150+', label: 'Homes Sold' },
  { icon: Users, value: '200+', label: 'Happy Clients' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: Star, value: '5.0', label: 'Star Rating' },
]

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const imageVariants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.65, 0, 0.35, 1],
    },
  },
}

const contentVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.65, 0, 0.35, 1],
    },
  },
}

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
}

// ─────────────────────────────────────────────────────────────────────────────
// PORTABLE TEXT COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const portableTextComponents = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-neutral-slate leading-relaxed mb-4 last:mb-0">{children}</p>
    ),
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function AboutSection() {
  const { tenant } = useTenant()

  const agentImage = tenant?.agentImage
    ? getImageUrl(tenant.agentImage, { width: 800, height: 1000, fit: 'crop' })
    : '/images/placeholder-agent.jpg'

  return (
    <section className="section-dramatic bg-white overflow-hidden">
      <div className="container-cinematic">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={agentImage}
                alt={tenant?.agentName || 'Real Estate Agent'}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Decorative Frame */}
            <div className="absolute -top-4 -left-4 w-full h-full border border-accent-gold pointer-events-none hidden lg:block" />

            {/* Accent Block */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-neutral-charcoal hidden lg:block" />
          </motion.div>

          {/* Content Column */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Label */}
            <span className="inline-block text-xs tracking-[0.2em] uppercase text-accent-gold font-semibold mb-4">
              About Your Agent
            </span>

            {/* Name */}
            <h2 className="font-heading text-display-sm text-neutral-charcoal mb-2">
              {tenant?.agentName || 'Your Trusted Realtor'}
            </h2>

            {/* Title */}
            {tenant?.agentTitle && (
              <p className="text-neutral-silver mb-6">{tenant.agentTitle}</p>
            )}

            {/* Bio */}
            <div className="mb-8">
              {tenant?.agentBio ? (
                <PortableText value={tenant.agentBio} components={portableTextComponents} />
              ) : (
                <p className="text-neutral-slate leading-relaxed">
                  With years of experience in the luxury real estate market, I am dedicated to
                  providing exceptional service and finding the perfect home for each of my
                  clients. My approach combines deep market knowledge with personalized
                  attention to ensure your real estate journey is seamless and successful.
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 py-8 border-y border-neutral-pearl">
              {DEFAULT_STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  custom={index}
                  variants={statVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <stat.icon className="w-6 h-6 text-accent-gold mx-auto mb-2" />
                  <p className="font-heading text-2xl font-semibold text-neutral-charcoal">
                    {stat.value}
                  </p>
                  <p className="text-xs text-neutral-silver uppercase tracking-wider">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="btn-primary">
                <span>Learn More</span>
              </Link>
              <Link href="/contact" className="btn-secondary">
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
