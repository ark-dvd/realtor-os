import Image from 'next/image'
import Link from 'next/link'

const services = [
  {
    title: 'Find Your Dream Home',
    description: 'Tell me your vision and I\'ll find properties that match your lifestyle, budget, and aspirations.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    href: '/buyers/search',
  },
  {
    title: "Your Home's Value",
    description: 'Get a professional market analysis with comparable sales data and an accurate value range for your property.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    href: '/sellers/valuation',
  },
  {
    title: 'List Your Home',
    description: 'Ready to sell? Let\'s create a customized marketing strategy to showcase your home to qualified buyers.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    href: '/sellers/list',
  },
]

export function ServicesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-display text-display text-brand-navy mb-4">
            The Merav Berko Experience
          </h2>
          <p className="text-neutral-600 text-lg leading-relaxed">
            Whether you&apos;re buying, selling, or investing, I provide personalized service 
            with deep local expertise to help you achieve your real estate goals.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              key={service.title}
              href={service.href}
              className="group card-hover bg-brand-cream overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-brand-navy/20 group-hover:bg-brand-navy/10 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="font-display text-2xl text-brand-navy mb-3 group-hover:text-brand-gold transition-colors">
                  {service.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-2 text-brand-gold font-medium text-sm uppercase tracking-wider">
                  Learn More
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
