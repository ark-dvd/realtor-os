export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-neutral-charcoal">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85)',
            opacity: 0.4 
          }}
        />
        <div className="relative z-10 text-center text-white px-6">
          <span className="inline-block w-12 h-px bg-accent-gold mb-8" />
          <h1 className="font-heading text-5xl md:text-7xl font-semibold mb-6">
            Find Your Perfect Home
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto">
            Exceptional properties, personalized service
          </p>
          <a 
            href="/properties" 
            className="inline-flex items-center gap-2 bg-accent-gold text-neutral-charcoal px-8 py-4 font-medium hover:bg-accent-gold/90 transition-colors"
          >
            View Properties
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-neutral-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block w-12 h-px bg-accent-gold mb-8" />
            <h2 className="font-heading text-4xl md:text-5xl text-neutral-charcoal mb-6">
              Your Trusted Real Estate Partner
            </h2>
            <p className="text-lg text-neutral-silver leading-relaxed">
              With years of experience in luxury real estate, we are dedicated to helping you 
              find the perfect property. Our personalized approach ensures that every client 
              receives the attention and expertise they deserve.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-neutral-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block w-12 h-px bg-accent-gold mb-8" />
          <h2 className="font-heading text-4xl md:text-5xl mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8 text-lg">
            Whether you&apos;re buying, selling, or just exploring, we&apos;re here to guide you every step of the way.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/contact" 
              className="bg-accent-gold text-neutral-charcoal px-8 py-4 font-medium hover:bg-accent-gold/90 transition-colors"
            >
              Schedule a Consultation
            </a>
            <a 
              href="/properties" 
              className="border border-white/30 text-white px-8 py-4 font-medium hover:bg-white hover:text-neutral-charcoal transition-colors"
            >
              Browse Properties
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
