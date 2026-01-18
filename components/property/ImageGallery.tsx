'use client'

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE GALLERY COMPONENT
// Responsive image gallery with lightbox
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Maximize2, Grid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getImageUrl } from '@/lib/sanity/client'
import type { SanityImage } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface ImageGalleryProps {
  images: SanityImage[]
  title?: string
  className?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTBOX COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface LightboxProps {
  images: SanityImage[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

function Lightbox({ images, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  const currentImage = images[currentIndex]

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, onNext, onPrev])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        aria-label="Close gallery"
      >
        <X size={24} />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 text-white/70 text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Image */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-[90vw] max-h-[85vh] aspect-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={getImageUrl(currentImage, { width: 1920, quality: 90 })}
          alt={currentImage.alt || `Image ${currentIndex + 1}`}
          width={1920}
          height={1080}
          className="object-contain max-h-[85vh] w-auto"
          priority
        />
        {currentImage.caption && (
          <p className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white text-center text-sm">
            {currentImage.caption}
          </p>
        )}
      </motion.div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); /* Set index */ }}
              className={cn(
                'w-16 h-16 flex-shrink-0 rounded overflow-hidden transition-all',
                index === currentIndex
                  ? 'ring-2 ring-white'
                  : 'opacity-50 hover:opacity-100'
              )}
            >
              <Image
                src={getImageUrl(img, { width: 100, height: 100, fit: 'crop' })}
                alt=""
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function ImageGallery({ images, title, className }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  if (!images || images.length === 0) return null

  // Display images (show 5 in grid, rest in lightbox)
  const displayImages = showAll ? images : images.slice(0, 5)
  const remainingCount = images.length - 5

  return (
    <>
      <section className={cn('section-dramatic bg-white', className)}>
        <div className="container-cinematic">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-display-sm text-neutral-charcoal">
              {title || 'Gallery'}
            </h2>
            {images.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-2 text-sm text-neutral-slate hover:text-accent-gold transition-colors"
              >
                <Grid size={16} />
                {showAll ? 'Show Less' : `View All ${images.length} Photos`}
              </button>
            )}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {displayImages.map((image, index) => {
              // First image is larger
              const isHero = index === 0
              
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openLightbox(index)}
                  className={cn(
                    'relative aspect-[4/3] overflow-hidden group',
                    isHero && 'col-span-2 row-span-2 aspect-square md:aspect-[4/3]'
                  )}
                >
                  <Image
                    src={getImageUrl(image, { 
                      width: isHero ? 1200 : 600, 
                      height: isHero ? 900 : 450,
                      fit: 'crop' 
                    })}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes={isHero ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Maximize2 
                      size={24} 
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  {/* Remaining Count Overlay */}
                  {!showAll && index === 4 && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-heading text-2xl">
                        +{remainingCount}
                      </span>
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={images}
            currentIndex={currentIndex}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery
