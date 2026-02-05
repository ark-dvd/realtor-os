'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Testimonial } from '@/lib/data-fetchers'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

// Source icons with brand colors
const sourceIcons: Record<string, { icon: React.ReactNode; label: string }> = {
  google: {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    label: 'Google Review',
  },
  zillow: {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#006AFF">
        <path d="M12 2L2 8.5v7L12 22l10-6.5v-7L12 2zm0 2.3l7.5 4.9-7.5 4.9-7.5-4.9L12 4.3zm-8 6.7l8 5.2 8-5.2v4.5l-8 5.2-8-5.2v-4.5z"/>
      </svg>
    ),
    label: 'Zillow Review',
  },
  realtor: {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#D92228">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    label: 'Realtor.com Review',
  },
  direct: {
    icon: (
      <svg className="w-5 h-5 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Verified Client',
  },
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Star rating component - larger for hero display
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-brand-gold' : 'text-neutral-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const hasTestimonials = testimonials && testimonials.length > 0
  const totalSlides = testimonials?.length || 0
  const hasMultiple = totalSlides > 1

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const nextSlide = useCallback(() => {
    if (!hasMultiple) return
    setCurrentIndex(prev => (prev >= totalSlides - 1 ? 0 : prev + 1))
  }, [hasMultiple, totalSlides])

  const prevSlide = useCallback(() => {
    if (!hasMultiple) return
    setCurrentIndex(prev => (prev <= 0 ? totalSlides - 1 : prev - 1))
  }, [hasMultiple, totalSlides])

  // Auto-play
  useEffect(() => {
    if (!hasTestimonials || !hasMultiple || isPaused) return

    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [hasTestimonials, hasMultiple, isPaused, nextSlide])

  // Touch handlers for mobile swipe
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsPaused(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsPaused(false)
      return
    }

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && hasMultiple) {
      nextSlide()
    } else if (isRightSwipe && hasMultiple) {
      prevSlide()
    }

    setTimeout(() => setIsPaused(false), 3000)
  }

  // Don't render if no testimonials
  if (!hasTestimonials) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]
  const sourceInfo = currentTestimonial.source ? sourceIcons[currentTestimonial.source] : null

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-display text-display text-brand-navy mb-4">
            What Our Clients Say
          </h2>
        </div>

        {/* Testimonial Carousel */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={!hasMultiple}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-16 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
              hasMultiple
                ? 'text-brand-navy hover:text-brand-gold hover:shadow-xl cursor-pointer'
                : 'text-neutral-300 cursor-default'
            }`}
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            disabled={!hasMultiple}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-16 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
              hasMultiple
                ? 'text-brand-navy hover:text-brand-gold hover:shadow-xl cursor-pointer'
                : 'text-neutral-300 cursor-default'
            }`}
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Testimonial Card */}
          <div
            className="overflow-hidden touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => {
                const source = testimonial.source ? sourceIcons[testimonial.source] : null

                return (
                  <div
                    key={testimonial._id}
                    className="w-full flex-shrink-0 px-4 md:px-12"
                  >
                    <div className="bg-brand-cream rounded-lg p-8 md:p-12 text-center">
                      {/* Large Quote Icon */}
                      <svg className="w-12 h-12 text-brand-gold/40 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>

                      {/* Quote Text */}
                      <blockquote className="text-xl md:text-2xl text-neutral-700 leading-relaxed mb-8 font-light italic max-w-3xl mx-auto">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>

                      {/* Client Info */}
                      <div className="flex flex-col items-center gap-4">
                        {/* Photo or Initials */}
                        {testimonial.clientPhoto ? (
                          <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-brand-gold/20">
                            <Image
                              src={testimonial.clientPhoto}
                              alt={testimonial.clientName}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-brand-navy flex items-center justify-center ring-2 ring-brand-gold/20">
                            <span className="text-white font-display text-xl">
                              {getInitials(testimonial.clientName)}
                            </span>
                          </div>
                        )}

                        {/* Name */}
                        <div>
                          <p className="font-display text-xl text-brand-navy mb-1">
                            {testimonial.clientName}
                          </p>
                          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                            {testimonial.transactionType && (
                              <span className="text-brand-gold font-medium">
                                {testimonial.transactionType === 'buyer' && 'Bought a Home'}
                                {testimonial.transactionType === 'seller' && 'Sold a Home'}
                                {testimonial.transactionType === 'both' && 'Bought & Sold'}
                              </span>
                            )}
                            {testimonial.transactionType && testimonial.neighborhood && (
                              <span className="text-neutral-300">•</span>
                            )}
                            {testimonial.neighborhood && (
                              <span>{testimonial.neighborhood}</span>
                            )}
                          </div>
                        </div>

                        {/* Rating */}
                        <StarRating rating={testimonial.rating || 5} />

                        {/* Source */}
                        {source && (
                          <div className="flex items-center gap-2 text-neutral-500">
                            {source.icon}
                            {testimonial.sourceUrl ? (
                              <a
                                href={testimonial.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:text-brand-gold transition-colors"
                              >
                                {source.label}
                              </a>
                            ) : (
                              <span className="text-sm">{source.label}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Dot Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  goToSlide(index)
                  setIsPaused(true)
                  setTimeout(() => setIsPaused(false), 3000)
                }}
                disabled={!hasMultiple}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-brand-gold w-8'
                    : hasMultiple
                      ? 'bg-neutral-300 hover:bg-neutral-400 w-2'
                      : 'bg-neutral-300 w-2'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
