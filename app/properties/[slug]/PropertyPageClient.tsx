'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Play, Maximize2, GalleryHorizontal } from 'lucide-react'

interface PropertyGalleryClientProps {
  images: string[]
  title: string
  videoUrl?: string | null
}

export function PropertyGalleryClient({ images, title, videoUrl }: PropertyGalleryClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Handle keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false)
        setIsVideoPlaying(false)
      } else if (e.key === 'ArrowLeft' && !isVideoPlaying) {
        goToPrevious()
      } else if (e.key === 'ArrowRight' && !isVideoPlaying) {
        goToNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, isVideoPlaying, currentIndex])

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
    setIsVideoPlaying(false)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    setIsVideoPlaying(false)
  }, [])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const setIndex = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Extract video embed URL
  const getVideoEmbedUrl = (url: string): string | null => {
    if (!url) return null
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/)
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
    return null
  }

  const embedUrl = videoUrl ? getVideoEmbedUrl(videoUrl) : null

  if (images.length === 0) return null

  // Calculate visible thumbnails based on screen size and video presence
  const maxThumbnails = embedUrl ? 5 : 6
  const remainingCount = images.length - 1 - maxThumbnails

  return (
    <div className="mb-12">
      <h2 className="font-display text-2xl text-brand-navy mb-4 flex items-center gap-2">
        <GalleryHorizontal size={24} className="text-brand-gold" />
        Gallery
        <span className="text-neutral-400 font-sans text-base ml-2">
          {images.length} photos{embedUrl ? ' + video' : ''}
        </span>
      </h2>

      {/* Main Gallery Layout */}
      <div className="space-y-3">
        {/* Featured Image */}
        <button
          onClick={() => openLightbox(0)}
          className="relative w-full aspect-[16/10] overflow-hidden rounded-xl group cursor-pointer"
        >
          <Image
            src={images[0]}
            alt={`${title} - Featured`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              <Maximize2 className="text-brand-navy" size={28} />
            </div>
          </div>
          {/* Image count badge */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <GalleryHorizontal size={16} />
            <span>1 / {images.length}</span>
          </div>
        </button>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
          {/* Video thumbnail if available */}
          {embedUrl && (
            <button
              onClick={() => {
                setCurrentIndex(0)
                setIsVideoPlaying(true)
                setLightboxOpen(true)
              }}
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer bg-brand-navy"
            >
              {images[0] && (
                <Image
                  src={images[0]}
                  alt="Video thumbnail"
                  fill
                  className="object-cover opacity-50"
                  sizes="16vw"
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-gold flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play size={20} className="text-brand-navy ml-0.5" />
                </div>
                <span className="text-white text-xs font-medium mt-2 hidden sm:block">Video Tour</span>
              </div>
            </button>
          )}

          {/* Image thumbnails (skip first since it's featured) */}
          {images.slice(1, maxThumbnails + 1).map((image, index) => (
            <button
              key={index + 1}
              onClick={() => openLightbox(index + 1)}
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
            >
              <Image
                src={image}
                alt={`${title} - Thumbnail ${index + 2}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 16vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            </button>
          ))}

          {/* "View All" button if more images */}
          {remainingCount > 0 && (
            <button
              onClick={() => openLightbox(maxThumbnails + 1)}
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
            >
              <Image
                src={images[maxThumbnails + 1]}
                alt={`${title} - More`}
                fill
                className="object-cover"
                sizes="16vw"
              />
              <div className="absolute inset-0 bg-brand-navy/80 flex items-center justify-center group-hover:bg-brand-navy/70 transition-colors">
                <span className="text-white font-medium text-lg sm:text-xl">
                  +{remainingCount}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            aria-label="Close gallery"
          >
            <X size={28} />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-50 text-white/80 bg-black/50 px-4 py-2 rounded-full text-sm font-medium">
            {isVideoPlaying ? 'Video Tour' : `${currentIndex + 1} / ${images.length}`}
          </div>

          {/* Video toggle button */}
          {embedUrl && (
            <button
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full transition-colors"
            >
              {isVideoPlaying ? (
                <>
                  <GalleryHorizontal size={18} /> Photos
                </>
              ) : (
                <>
                  <Play size={18} /> Video
                </>
              )}
            </button>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && !isVideoPlaying && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Main content */}
          <div className="w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-16 pb-28 sm:pb-32">
            {isVideoPlaying && embedUrl ? (
              <div className="relative w-full max-w-5xl aspect-video">
                <iframe
                  src={embedUrl}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Property Video Tour"
                />
              </div>
            ) : (
              <div className="relative w-full h-full max-w-6xl max-h-full">
                <Image
                  src={images[currentIndex]}
                  alt={`${title} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && !isVideoPlaying && (
            <div className="absolute bottom-4 left-0 right-0 z-50 px-4">
              <div className="flex justify-center gap-1.5 sm:gap-2 overflow-x-auto py-2 max-w-full scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setIndex(index); }}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                      index === currentIndex
                        ? 'ring-2 ring-brand-gold ring-offset-2 ring-offset-black scale-105'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Hero section "View All Photos" button
export function HeroViewAllButton({
  imageCount,
  onClick
}: {
  imageCount: number
  onClick: () => void
}) {
  if (imageCount <= 1) return null

  return (
    <button
      onClick={onClick}
      className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-white/95 hover:bg-white text-brand-navy px-5 py-3 rounded-full font-medium text-sm transition-all shadow-lg hover:shadow-xl active:scale-95"
    >
      <GalleryHorizontal size={18} />
      View all {imageCount} photos
    </button>
  )
}
