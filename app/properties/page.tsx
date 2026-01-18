export default function PropertiesPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-neutral-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block w-12 h-px bg-accent-gold mb-6" />
          <h1 className="font-heading text-5xl md:text-6xl mb-4">Our Properties</h1>
          <p className="text-white/70 text-xl">Discover exceptional homes</p>
        </div>
      </section>

      <section className="py-24 bg-neutral-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🏠</div>
            <h2 className="font-heading text-2xl text-neutral-charcoal mb-4">
              Connect Sanity CMS to View Properties
            </h2>
            <p className="text-neutral-silver mb-8">
              Properties will appear here once you configure your Sanity CMS.
            </p>
            <a 
              href="/contact"
              className="inline-flex bg-accent-gold text-neutral-charcoal px-8 py-4 font-medium hover:bg-accent-gold/90 transition-colors"
            >
              Contact Agent
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
