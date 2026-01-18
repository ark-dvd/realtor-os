// ═══════════════════════════════════════════════════════════════════════════
// CONTACT PAGE
// Contact form and agent information
// ═══════════════════════════════════════════════════════════════════════════

import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { ContactForm } from '@/components/ui/ContactForm'
import { DEMO_TENANT } from '@/lib/sanity/client'
import type { Metadata } from 'next'

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch to schedule a consultation or ask questions about properties',
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const tenant = DEMO_TENANT

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-neutral-charcoal text-white">
        <div className="container-cinematic">
          <div className="max-w-3xl">
            <span className="inline-block w-12 h-px bg-accent-gold mb-6" />
            <h1 className="font-heading text-display-lg mb-6">
              Let&apos;s Connect
            </h1>
            <p className="text-white/70 text-xl">
              Ready to find your dream home or have questions about the market? 
              I&apos;m here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-dramatic bg-neutral-cream">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <div className="bg-white p-8 lg:p-12 border border-neutral-pearl order-2 lg:order-1">
              <h2 className="font-heading text-2xl text-neutral-charcoal mb-2">
                Send a Message
              </h2>
              <p className="text-neutral-silver mb-8">
                Fill out the form below and I&apos;ll get back to you within 24 hours.
              </p>
              
              <ContactForm agentEmail={tenant?.contactInfo?.email} />
            </div>

            {/* Contact Info */}
            <div className="order-1 lg:order-2">
              {/* Agent Card */}
              <div className="flex items-center gap-6 mb-10">
                <div className="w-24 h-24 rounded-full bg-neutral-charcoal/10 flex items-center justify-center">
                  <span className="text-4xl">👩‍💼</span>
                </div>
                <div>
                  <h3 className="font-heading text-2xl text-neutral-charcoal">
                    {tenant?.agentName || 'Your Agent'}
                  </h3>
                  <p className="text-neutral-silver">
                    {tenant?.agentTitle || 'Real Estate Professional'}
                  </p>
                  <p className="text-sm text-neutral-silver mt-1">
                    {tenant?.brokerageName}
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-6 mb-10">
                <a
                  href={`tel:${tenant?.contactInfo?.phone}`}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-gold transition-colors">
                    <Phone size={20} className="text-accent-gold group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-silver uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-lg text-neutral-charcoal group-hover:text-accent-gold transition-colors">
                      {tenant?.contactInfo?.phone || '(512) 555-0123'}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${tenant?.contactInfo?.email}`}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-gold transition-colors">
                    <Mail size={20} className="text-accent-gold group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-silver uppercase tracking-wider mb-1">Email</p>
                    <p className="text-lg text-neutral-charcoal group-hover:text-accent-gold transition-colors">
                      {tenant?.contactInfo?.email || 'agent@realtoros.com'}
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-accent-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-silver uppercase tracking-wider mb-1">Office</p>
                    <p className="text-lg text-neutral-charcoal">
                      Austin, TX 78701
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-accent-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-silver uppercase tracking-wider mb-1">Hours</p>
                    <p className="text-lg text-neutral-charcoal">
                      Monday - Friday: 9am - 6pm<br />
                      Saturday: 10am - 4pm<br />
                      Sunday: By appointment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
