// ═══════════════════════════════════════════════════════════════════════════
// CONTACT PAGE
// Contact form and agent information
// ═══════════════════════════════════════════════════════════════════════════

import { headers } from 'next/headers'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Linkedin } from 'lucide-react'

import { sanityClient, getImageUrl } from '@/lib/sanity/client'
import { AGENT_SETTINGS_BY_DOMAIN } from '@/lib/sanity/queries'
import { ContactForm } from '@/components/ui/ContactForm'
import type { AgentSettings } from '@/lib/types'
import type { Metadata } from 'next'

// ─────────────────────────────────────────────────────────────────────────────
// DATA FETCHING
// ─────────────────────────────────────────────────────────────────────────────

async function getTenant() {
  const headersList = headers()
  const domain = headersList.get('x-tenant-domain') || 
                 process.env.DEFAULT_TENANT_DOMAIN ||
                 'demo.realtoros.com'

  const tenant = await sanityClient.fetch<AgentSettings>(
    AGENT_SETTINGS_BY_DOMAIN,
    { currentDomain: domain },
    { next: { revalidate: 60 } }
  )

  return tenant
}

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch to schedule a consultation or ask questions about properties',
}

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL ICONS
// ─────────────────────────────────────────────────────────────────────────────

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default async function ContactPage() {
  const tenant = await getTenant()

  const agentImage = tenant?.agentImage
    ? getImageUrl(tenant.agentImage, { width: 400, height: 400, fit: 'crop' })
    : '/images/placeholder-agent.jpg'

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
                <Image
                  src={agentImage}
                  alt={tenant?.agentName || 'Agent'}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
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
                {tenant?.contactInfo?.phone && (
                  <a
                    href={`tel:${tenant.contactInfo.phone}`}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-gold transition-colors">
                      <Phone size={20} className="text-accent-gold group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-silver uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-lg text-neutral-charcoal group-hover:text-accent-gold transition-colors">
                        {tenant.contactInfo.phone}
                      </p>
                    </div>
                  </a>
                )}

                {tenant?.contactInfo?.email && (
                  <a
                    href={`mailto:${tenant.contactInfo.email}`}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-gold transition-colors">
                      <Mail size={20} className="text-accent-gold group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-silver uppercase tracking-wider mb-1">Email</p>
                      <p className="text-lg text-neutral-charcoal group-hover:text-accent-gold transition-colors">
                        {tenant.contactInfo.email}
                      </p>
                    </div>
                  </a>
                )}

                {tenant?.contactInfo?.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-accent-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-silver uppercase tracking-wider mb-1">Office</p>
                      <p className="text-lg text-neutral-charcoal">
                        {tenant.contactInfo.address}
                        {tenant.contactInfo.city && <br />}
                        {tenant.contactInfo.city && `${tenant.contactInfo.city}, `}
                        {tenant.contactInfo.state} {tenant.contactInfo.zip}
                      </p>
                    </div>
                  </div>
                )}

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

              {/* Social Links */}
              {tenant?.socialLinks && (
                <div>
                  <p className="text-sm text-neutral-silver uppercase tracking-wider mb-4">
                    Follow Me
                  </p>
                  <div className="flex gap-3">
                    {Object.entries(tenant.socialLinks).map(([platform, url]) => {
                      const Icon = SOCIAL_ICONS[platform]
                      if (!url || !Icon) return null
                      
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-neutral-charcoal text-white flex items-center justify-center hover:bg-accent-gold transition-colors"
                          aria-label={`Follow on ${platform}`}
                        >
                          <Icon size={20} />
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
