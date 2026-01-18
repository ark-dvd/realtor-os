import Link from 'next/link'

export function CTASection() {
  return (
    <section className="relative py-24 md:py-32 bg-brand-navy overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container-wide relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="gold-line mx-auto mb-8" />
          
          <h2 className="font-display text-display mb-6">
            Ready to Make Your Move?
          </h2>
          
          <p className="text-xl text-white/70 mb-10 leading-relaxed">
            Whether you&apos;re buying your first home, upgrading to your dream property, 
            or looking to sell, I&apos;m here to guide you every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-gold">
              Schedule a Consultation
            </Link>
            <Link 
              href="/properties" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-navy font-medium tracking-wide transition-all duration-300 ease-out hover:bg-brand-cream"
            >
              Browse Properties
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-8">
            <a 
              href="tel:+15125999995" 
              className="flex items-center gap-2 text-white/70 hover:text-brand-gold transition-colors"
            >
              <span className="text-brand-gold">📞</span>
              (512) 599-9995
            </a>
            <a 
              href="mailto:merav@meravberko.com" 
              className="flex items-center gap-2 text-white/70 hover:text-brand-gold transition-colors"
            >
              <span className="text-brand-gold">✉️</span>
              merav@meravberko.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
