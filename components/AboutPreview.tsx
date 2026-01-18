import Image from 'next/image'
import Link from 'next/link'

export function AboutPreview() {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/merav-berko.jpg"
                alt="Merrav Berko - Austin Real Estate Agent"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-brand-gold -z-10 hidden lg:block" />
          </div>

          {/* Content */}
          <div>
            <div className="gold-line mb-8" />
            <h2 className="font-display text-display text-brand-navy mb-6">
              Meet Merrav Berko
            </h2>
            <p className="text-neutral-600 text-lg leading-relaxed mb-6">
              Merrav Berko holds a Bachelor of Arts in Management from Israel&apos;s Open University 
              and brings over 12 years of experience living in Austin to her work in real estate. 
              Her deep understanding of the city—its neighborhoods, culture, and evolving market—allows 
              her to guide clients with clarity and confidence.
            </p>
            <p className="text-neutral-600 text-lg leading-relaxed mb-8">
              With a refined eye for design, a strong foundation in investment strategy, and 
              meticulous attention to detail, Merrav is committed to exceeding her clients&apos; 
              expectations at every step.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-8 border-y border-neutral-200 mb-8">
              <div className="text-center">
                <p className="font-display text-4xl text-brand-gold">12+</p>
                <p className="text-sm text-neutral-500 uppercase tracking-wider mt-1">Years in Austin</p>
              </div>
              <div className="text-center">
                <p className="font-display text-4xl text-brand-gold">B.A.</p>
                <p className="text-sm text-neutral-500 uppercase tracking-wider mt-1">Management</p>
              </div>
              <div className="text-center">
                <p className="font-display text-4xl text-brand-gold">5★</p>
                <p className="text-sm text-neutral-500 uppercase tracking-wider mt-1">Service</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="btn-primary">
                Learn More
              </Link>
              <Link href="/contact" className="btn-secondary">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
