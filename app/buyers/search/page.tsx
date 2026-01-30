import Link from 'next/link'
import Image from 'next/image'
import { Search, Home, Calculator, BookOpen } from 'lucide-react'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'Find Your Dream Home',
  description: 'Search for your perfect home in Austin, Texas with Merrav Berko.',
}

export default function BuyersSearchPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/hero-1.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <div className="gold-line mb-6" />
            <h1 className="font-display text-hero mb-6">Find Your Dream Home</h1>
            <p className="text-xl text-white/70">
              Tell me what you&apos;re looking for and I&apos;ll help you find 
              the perfect property in Austin.
            </p>
          </div>
        </div>
      </section>

      {/* Search Form */}
      <section className="section-padding bg-brand-cream">
        <div className="container-narrow">
          <div className="bg-white p-6 sm:p-8 lg:p-12 border border-neutral-200">
            <div className="text-center mb-8 sm:mb-10">
              <Search className="w-12 h-12 text-brand-gold mx-auto mb-4" />
              <h2 className="font-display text-2xl text-brand-navy mb-2">
                What Are You Looking For?
              </h2>
              <p className="text-neutral-500">
                Fill out the form below and I&apos;ll send you matching properties.
              </p>
            </div>

            <form
              name="buyer-search"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              action="/contact?success=search"
              className="space-y-5"
            >
              <input type="hidden" name="form-name" value="buyer-search" />
              <p className="hidden">
                <label>Don&apos;t fill this out: <input name="bot-field" /></label>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Name *
                  </label>
                  <input type="text" name="name" required autoComplete="name" className="input-field h-12 text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Email *
                  </label>
                  <input type="email" name="email" required autoComplete="email" inputMode="email" className="input-field h-12 text-base" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Phone
                  </label>
                  <input type="tel" name="phone" autoComplete="tel" inputMode="tel" className="input-field h-12 text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Timeline
                  </label>
                  <select name="timeline" className="input-field h-12 text-base">
                    <option value="asap">ASAP</option>
                    <option value="1-3">1-3 months</option>
                    <option value="3-6">3-6 months</option>
                    <option value="6+">6+ months</option>
                    <option value="exploring">Just exploring</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Min Price
                  </label>
                  <select name="minPrice" className="input-field h-12 text-base">
                    <option value="">No Min</option>
                    <option value="300000">$300K</option>
                    <option value="500000">$500K</option>
                    <option value="750000">$750K</option>
                    <option value="1000000">$1M</option>
                    <option value="1500000">$1.5M</option>
                    <option value="2000000">$2M</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Max Price
                  </label>
                  <select name="maxPrice" className="input-field h-12 text-base">
                    <option value="">No Max</option>
                    <option value="500000">$500K</option>
                    <option value="750000">$750K</option>
                    <option value="1000000">$1M</option>
                    <option value="1500000">$1.5M</option>
                    <option value="2000000">$2M</option>
                    <option value="3000000">$3M+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Beds
                  </label>
                  <select name="beds" className="input-field h-12 text-base">
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-navy mb-2">
                  Preferred Neighborhoods
                </label>
                <input
                  type="text"
                  name="neighborhoods"
                  className="input-field h-12 text-base"
                  placeholder="e.g., Westlake, Downtown, Tarrytown"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-navy mb-2">
                  Additional Details
                </label>
                <textarea
                  name="comments"
                  rows={4}
                  className="input-field resize-none text-base"
                  placeholder="Tell me more about what you're looking for..."
                />
              </div>

              <button type="submit" className="btn-gold w-full justify-center h-14 text-base">
                Submit Request
              </button>
            </form>
          </div>

          {/* Other Resources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <Link
              href="/buyers/calculator"
              className="flex items-center gap-4 bg-white p-5 sm:p-6 border border-neutral-200 hover:border-brand-gold active:bg-neutral-50 transition-colors"
            >
              <Calculator className="w-10 h-10 text-brand-gold flex-shrink-0" />
              <div>
                <h3 className="font-display text-lg text-brand-navy">Mortgage Calculator</h3>
                <p className="text-sm text-neutral-500">Estimate your monthly payments</p>
              </div>
            </Link>
            <Link
              href="/buyers/guide"
              className="flex items-center gap-4 bg-white p-5 sm:p-6 border border-neutral-200 hover:border-brand-gold active:bg-neutral-50 transition-colors"
            >
              <BookOpen className="w-10 h-10 text-brand-gold flex-shrink-0" />
              <div>
                <h3 className="font-display text-lg text-brand-navy">Buyers Guide</h3>
                <p className="text-sm text-neutral-500">Learn about the buying process</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
