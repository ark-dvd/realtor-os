export default function AboutPage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-neutral-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6">
          <span className="inline-block w-12 h-px bg-accent-gold mb-6" />
          <h1 className="font-heading text-5xl md:text-6xl mb-6">About Us</h1>
          <p className="text-white/70 text-xl">Dedicated to helping you find your perfect home</p>
        </div>
      </section>

      <section className="py-24 bg-neutral-cream">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-lg text-neutral-slate leading-relaxed mb-6">
            With over 15 years of experience in the luxury real estate market, 
            we have dedicated our careers to helping clients find their perfect homes 
            and achieve their real estate goals.
          </p>
          <p className="text-lg text-neutral-slate leading-relaxed mb-6">
            Our approach combines deep market knowledge with personalized attention 
            to ensure every transaction is seamless and successful.
          </p>
          <p className="text-lg text-neutral-slate leading-relaxed">
            We believe that buying or selling a home is more than just a transaction—it&apos;s 
            a life-changing decision. That&apos;s why we take the time to understand each 
            client&apos;s unique needs.
          </p>
        </div>
      </section>
    </>
  )
}
