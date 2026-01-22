import Link from 'next/link'
import { Phone, ArrowRight } from 'lucide-react'
import { SiteSettings } from '@/lib/data-fetchers'

interface CTASectionProps {
  settings?: SiteSettings
}

export function CTASection({ settings }: CTASectionProps) {
  const phone = settings?.phone || '(512) 599-9995'
  const agentName = settings?.agentName || 'Merrav Berko'

  return (
    <section className="bg-brand-navy text-white">
      <div className="container-wide section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <div className="gold-line mx-auto mb-8" />
          
          <h2 className="font-display text-display mb-6">
            Ready to Find Your Perfect Home?
          </h2>
          
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Whether you&apos;re buying, selling, or just exploring your options, 
            {agentName} is here to guide you every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-gold">
              Schedule a Consultation
              <ArrowRight size={18} />
            </Link>
            <a 
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-medium tracking-wide transition-all duration-300 ease-out hover:bg-white/20"
            >
              <Phone size={18} />
              Call {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
