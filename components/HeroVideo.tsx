'use client'

import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { SiteSettings } from '@/lib/data-fetchers'

interface HeroVideoProps {
  settings: SiteSettings
}

/**
 * Detect video MIME type from URL.
 * Supports mp4, webm, mov (quicktime).
 */
function getVideoMimeType(url: string): string {
  if (!url) return 'video/mp4'
  
  const lowerUrl = url.toLowerCase()
  
  if (lowerUrl.includes('.webm')) return 'video/webm'
  if (lowerUrl.includes('.mov')) return 'video/quicktime'
  if (lowerUrl.includes('.mp4')) return 'video/mp4'
  if (lowerUrl.includes('.m4v')) return 'video/mp4'
  if (lowerUrl.includes('.ogg') || lowerUrl.includes('.ogv')) return 'video/ogg'
  
  // Default to mp4 as it's most common
  return 'video/mp4'
}

export function HeroVideo({ settings }: HeroVideoProps) {
  const videoUrl = settings.heroVideoUrl
  const mimeType = getVideoMimeType(videoUrl || '')
  
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  if (!videoUrl) {
    // No video URL - show a fallback background
    return (
      <section className="relative h-screen bg-brand-navy flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-5xl">
          <div className="gold-line mx-auto mb-8" />
          <h1 className="font-display text-hero font-medium mb-6">
            {settings.heroHeadline || 'Find Your Home in Austin'}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10">
            {settings.heroSubheadline || 'Luxury real estate with personalized service.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties" className="btn-gold">
              Browse Properties
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        // Poster image while video loads
        poster={settings.heroImages?.[0]?.url}
      >
        {/* Primary source with detected type */}
        <source src={videoUrl} type={mimeType} />
        
        {/* Fallback message */}
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-5xl">
          <div className="gold-line mx-auto mb-8 animate-scale-in" />
          
          <h1 className="font-display text-hero font-medium mb-6 animate-slide-up">
            {settings.heroHeadline || 'Find Your Home in Austin'}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-200">
            {settings.heroSubheadline || 'Luxury real estate with personalized service.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animate-delay-300">
            <Link href="/properties" className="btn-gold">
              Browse Properties
              <ArrowRight size={18} />
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-navy font-medium tracking-wide transition-all duration-300 ease-out hover:bg-brand-cream"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  )
}
