// ═══════════════════════════════════════════════════════════════════════════
// ABOUT PAGE
// Agent biography and credentials
// ═══════════════════════════════════════════════════════════════════════════

import Link from 'next/link'
import { Award, Users, Home, Star, Phone, Mail, MapPin } from 'lucide-react'
import { DEMO_TENANT } from '@/lib/sanity/client'
import type { Metadata } from 'next'

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about your trusted real estate professional',
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────

const STATS = [
  { icon: Home, value: '150+', label: 'Homes Sold' },
  { icon: Users, value: '200+', label: 'Happy Clients' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: Star, value: '5.0', label: 'Star Rating' },
]

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const tenant = DEMO_TENANT

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-neutral-charcoal text-white">
        <div className="container-cinematic">
          <div className="max-w-3xl">
            <span className="inline-block w-12 h-px bg-accent-gold mb-6" />
            <h1 className="font-heading text-display-lg mb-6">
              About {tenant?.agentName || 'Your Agent'}
            </h1>
            <p className="text-white/70 text-xl">
              {tenant?.agentTitle || 'Dedicated to helping you find your perfect home'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-dramatic bg-neutral-cream">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Image Column */}
            <div className="relative lg:sticky lg:top-32">
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-charcoal/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">👩‍💼</span>
                </div>
              </div>
              {/* Decorative Frame */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-accent-gold pointer-events-none -z-10" />
            </div>

            {/* Content Column */}
            <div>
              {/* Bio */}
              <div className="mb-12">
                <p className="text-neutral-slate leading-relaxed mb-6 text-lg drop-cap">
                  With over 15 years of experience in the luxury real estate market, 
                  I have dedicated my career to helping clients find their perfect homes 
                  and achieve their real estate goals. My approach combines deep market 
                  knowledge with personalized attention to ensure every transaction is 
                  seamless and successful.
                </p>
                <p className="text-neutral-slate leading-relaxed mb-6 text-lg">
                  I believe that buying or selling a home is more than just a transaction—it&apos;s 
                  a life-changing decision. That&apos;s why I take the time to understand each 
                  client&apos;s unique needs, preferences, and timeline, providing tailored 
                  guidance every step of the way.
                </p>
                <p className="text-neutral-slate leading-relaxed text-lg">
                  My commitment to excellence has earned me recognition as a top producer 
                  in my market, but what I value most are the lasting relationships I build 
                  with my clients. Many of them become friends for life, and their referrals 
                  are the greatest compliment I can receive.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mb-12 py-8 border-y border-neutral-pearl">
                {STATS.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <stat.icon className="w-8 h-8 text-accent-gold mx-auto mb-3" />
                    <p className="font-heading text-3xl font-semibold text-neutral-charcoal">
                      {stat.value}
                    </p>
                    <p className="text-sm text-neutral-silver uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="bg-white p-8 border border-neutral-pearl">
                <h3 className="font-heading text-2xl text-neutral-charcoal mb-6">
                  Get in Touch
                </h3>
                <div className="space-y-4">
                  <a
                    href={`tel:${tenant?.contactInfo?.phone}`}
                    className="flex items-center gap-4 text-neutral-slate hover:text-accent-gold transition-colors"
                  >
                    <Phone size={20} className="text-accent-gold" />
                    <span>{tenant?.contactInfo?.phone || '(512) 555-0123'}</span>
                  </a>
                  <a
                    href={`mailto:${tenant?.contactInfo?.email}`}
                    className="flex items-center gap-4 text-neutral-slate hover:text-accent-gold transition-colors"
                  >
                    <Mail size={20} className="text-accent-gold" />
                    <span>{tenant?.contactInfo?.email || 'agent@realtoros.com'}</span>
                  </a>
                  <div className="flex items-start gap-4 text-neutral-slate">
                    <MapPin size={20} className="text-accent-gold flex-shrink-0 mt-0.5" />
                    <span>Austin, TX</span>
                  </div>
                </div>
                
                <Link href="/contact" className="btn-accent mt-8 w-full justify-center">
                  Schedule a Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-dramatic bg-white">
        <div className="container-cinematic text-center">
          <span className="inline-block w-12 h-px bg-accent-gold mb-8" />
          <h2 className="font-heading text-display-md text-neutral-charcoal mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-neutral-silver max-w-xl mx-auto mb-8 text-lg">
            Whether you&apos;re buying your first home or selling a luxury property, 
            I&apos;m here to make the process smooth and successful.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/properties" className="btn-primary">
              <span>View Properties</span>
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Me
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
