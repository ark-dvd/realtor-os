import Link from 'next/link'
import Image from 'next/image'
import { Home, TrendingUp, FileText } from 'lucide-react'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: "Your Home's Value",
  description: 'Get a free home valuation from Merrav Berko, Austin real estate expert.',
}

export default function SellersValuationPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/hero-4.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <div className="gold-line mb-6" />
            <h1 className="font-display text-hero mb-6">What&apos;s Your Home Worth?</h1>
            <p className="text-xl text-white/70">
              Get a free, no-obligation market analysis of your property 
              from a local Austin expert.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Form */}
            <div className="bg-white p-8 lg:p-12 border border-neutral-200">
              <div className="text-center mb-10">
                <Home className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                <h2 className="font-display text-2xl text-brand-navy mb-2">
                  Request Your Free Valuation
                </h2>
                <p className="text-neutral-500">
                  I&apos;ll provide comparable sales and an accurate value range.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      Name *
                    </label>
                    <input type="text" required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      Email *
                    </label>
                    <input type="email" required className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Phone
                  </label>
                  <input type="tel" className="input-field" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Property Address *
                  </label>
                  <input 
                    type="text" 
                    required 
                    className="input-field"
                    placeholder="123 Main St, Austin, TX 78701"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      Bedrooms
                    </label>
                    <select className="input-field">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option selected>4</option>
                      <option>5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      Bathrooms
                    </label>
                    <select className="input-field">
                      <option>1</option>
                      <option>1.5</option>
                      <option>2</option>
                      <option selected>2.5</option>
                      <option>3+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      Approx. Sq Ft
                    </label>
                    <input type="number" className="input-field" placeholder="2000" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Timeline to Sell
                  </label>
                  <select className="input-field">
                    <option>ASAP</option>
                    <option>1-3 months</option>
                    <option>3-6 months</option>
                    <option>6+ months</option>
                    <option>Just curious</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Additional Information
                  </label>
                  <textarea 
                    rows={4} 
                    className="input-field resize-none"
                    placeholder="Recent upgrades, special features, etc."
                  />
                </div>

                <button type="submit" className="btn-gold w-full justify-center">
                  Get My Free Valuation
                </button>
              </form>
            </div>

            {/* Info */}
            <div>
              <h3 className="font-display text-title text-brand-navy mb-6">
                Why Get a Professional Valuation?
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="text-brand-gold" size={24} />
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-brand-navy mb-2">
                      Accurate Market Data
                    </h4>
                    <p className="text-neutral-600">
                      Online estimates can be off by tens of thousands. I use real 
                      comparable sales data specific to your neighborhood.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <Home className="text-brand-gold" size={24} />
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-brand-navy mb-2">
                      Local Expertise
                    </h4>
                    <p className="text-neutral-600">
                      I know Austin&apos;s micro-markets. The difference between streets 
                      can be significant, and I factor that in.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="text-brand-gold" size={24} />
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-brand-navy mb-2">
                      No Obligation
                    </h4>
                    <p className="text-neutral-600">
                      This is a free service with no strings attached. Whether you 
                      sell in a month or a year, the information is yours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Other Resources */}
              <div className="mt-12 pt-8 border-t border-neutral-200">
                <h4 className="font-display text-xl text-brand-navy mb-4">
                  Seller Resources
                </h4>
                <div className="space-y-3">
                  <Link 
                    href="/sellers/list" 
                    className="block text-brand-gold hover:underline"
                  >
                    → List Your Home With Me
                  </Link>
                  <Link 
                    href="/sellers/guide" 
                    className="block text-brand-gold hover:underline"
                  >
                    → Seller&apos;s Guide to the Process
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
