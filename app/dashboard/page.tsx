export default function DashboardPage() {
  return (
    <>
      <section className="pt-32 pb-12 bg-neutral-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6">
          <span className="inline-block w-12 h-px bg-accent-gold mb-6" />
          <h1 className="font-heading text-5xl md:text-6xl mb-4">My Home Journey</h1>
          <p className="text-white/70 text-lg">Track your progress</p>
        </div>
      </section>

      <section className="py-24 bg-neutral-cream">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-white p-12 border border-neutral-pearl">
            <div className="text-6xl mb-6">🔐</div>
            <h2 className="font-heading text-2xl text-neutral-charcoal mb-4">
              Client Login Required
            </h2>
            <p className="text-neutral-silver mb-8">
              Authentication will be available once configured.
            </p>
            <a href="/contact" className="inline-flex bg-accent-gold text-neutral-charcoal px-8 py-4 font-medium hover:bg-accent-gold/90">
              Contact Agent
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
