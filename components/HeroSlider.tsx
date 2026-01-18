'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    image: '/images/hero-1.jpg',
    alt: 'Luxury homes in Austin with Pennybacker Bridge',
  },
  {
    id: 2,
    image: '/images/hero-2.jpg',
    alt: 'Austin community center aerial view',
  },
  {
    id: 3,
    image: '/images/hero-3.jpg',
    alt: 'Austin skyline at night',
  },
  {
    id: 4,
    image: '/images/hero-4.jpg',
    alt: 'Pennybacker Bridge sunset',
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-5xl">
          <div className="gold-line mx-auto mb-8 animate-scale-in" />
          
          <h1 className="font-display text-hero font-medium mb-6 animate-slide-up">
            Find Your Home in Austin
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-200">
            Luxury real estate with personalized service. 
            Your journey to the perfect home starts here.
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

      {/* Slide Indicators */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-brand-gold w-8' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
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
