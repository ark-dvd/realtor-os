'use client'

// ═══════════════════════════════════════════════════════════════════════════
// CINEMATIC HERO COMPONENT
// Full-screen hero with video or image background
// ═══════════════════════════════════════════════════════════════════════════

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown, Play, Pause } from 'lucide-react'
import type { CinematicHeroProps } from '@/lib/types'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.65, 0, 0.35, 1],
    },
  },
}

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 1,
      ease: [0.65, 0, 0.35, 1],
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function CinematicHero({
  videoUrl,
  imageUrl,
  posterUrl,
  tagline = 'Discover Your Dream Home',
  subtagline = 'Luxury real estate, exceptional service',
  ctaText = 'View Properties',
  ctaHref = '/properties',
  showScrollIndicator = true,
}: CinematicHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Handle video playback
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => setIsVideoLoaded(true)
    const handlePlay = () => setIsVideoPlaying(true)
    const handlePause = () => setIsVideoPlaying(false)

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  // Toggle video playback
  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  // Scroll to content
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  const hasVideo = !!videoUrl
  const backgroundImage = posterUrl || imageUrl || '/images/placeholder-hero.jpg'

  return (
    <section className="hero-cinematic grain-overlay">
      {/* Background Media */}
      <div className="hero-media">
        {hasVideo ? (
          <>
            {/* Video Background */}
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={backgroundImage}
              className={cn(
                'w-full h-full object-cover transition-opacity duration-1000',
                isVideoLoaded ? 'opacity-100' : 'opacity-0'
              )}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>

            {/* Poster Image (shown while video loads) */}
            <Image
              src={backgroundImage}
              alt=""
              fill
              priority
              className={cn(
                'object-cover transition-opacity duration-1000',
                isVideoLoaded ? 'opacity-0' : 'opacity-100'
              )}
            />

            {/* Video Controls */}
            <button
              onClick={toggleVideo}
              className="absolute bottom-8 right-8 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all group"
              aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
            >
              {isVideoPlaying ? (
                <Pause size={18} className="group-hover:scale-110 transition-transform" />
              ) : (
                <Play size={18} className="ml-0.5 group-hover:scale-110 transition-transform" />
              )}
            </button>
          </>
        ) : (
          /* Image Background */
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
      </div>

      {/* Overlays */}
      <div className="hero-overlay" />
      <div className="hero-overlay-brand" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="hero-content"
      >
        {/* Decorative Line */}
        <motion.div
          variants={lineVariants}
          className="w-16 h-px bg-accent-gold mx-auto mb-8 origin-left"
        />

        {/* Tagline */}
        <motion.h1
          variants={itemVariants}
          className="font-heading text-display-xl text-white text-balance mb-6"
        >
          {tagline}
        </motion.h1>

        {/* Subtagline */}
        <motion.p
          variants={itemVariants}
          className="font-body text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-10"
        >
          {subtagline}
        </motion.p>

        {/* CTA */}
        <motion.div variants={itemVariants}>
          <Link href={ctaHref} className="btn-accent inline-flex">
            {ctaText}
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          onClick={scrollToContent}
          className="scroll-indicator"
          aria-label="Scroll to content"
        >
          <span className="text-xs tracking-widest uppercase">Explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.button>
      )}

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-cream to-transparent pointer-events-none" />
    </section>
  )
}

export default CinematicHero
