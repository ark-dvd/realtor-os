export default function PropertyPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <section className="pt-32 pb-20 bg-neutral-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block w-12 h-px bg-accent-gold mb-6" />
          <h1 className="font-heading text-5xl md:text-6xl mb-6">Property Details</h1>
          <p className="text-white/50">Slug: {params.slug}</p>
        </div>
      </section>

      <section className="py-24 bg-neutral-cream">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-white p-12 border border-neutral-pearl">
            <div className="text-6xl mb-6">🏠</div>
            <h2 className="font-heading text-2xl text-neutral-charcoal mb-4">
              Sanity CMS Required
            </h2>
            <p className="text-neutral-silver mb-8">
              Configure Sanity CMS to view property details.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/properties" className="bg-neutral-charcoal text-white px-6 py-3 font-medium hover:bg-neutral-charcoal/90">
                Back to Properties
              </a>
              <a href="/contact" className="border border-neutral-charcoal text-neutral-charcoal px-6 py-3 font-medium hover:bg-neutral-charcoal hover:text-white">
                Contact Agent
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
