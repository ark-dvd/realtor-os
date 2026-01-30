import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, Youtube, FileText } from 'lucide-react'
import { SiteSettings } from '@/lib/data-fetchers'

interface FooterProps {
  settings?: SiteSettings
}

export function Footer({ settings }: FooterProps) {
  const agentName = settings?.agentName || 'Merrav Berko'
  const phone = settings?.phone || '(512) 599-9995'
  const email = settings?.email || 'merrav@merrav.com'
  const address = settings?.address || 'Austin, Texas'
  const legalLinks = settings?.legalLinks?.length ? settings.legalLinks : [
    { _key: 'trec', title: 'TREC Consumer Protection', url: 'https://www.trec.texas.gov/forms/consumer-protection-notice' },
  ]
  const iabsDocumentUrl = settings?.iabsDocumentUrl

  return (
    <footer className="bg-brand-navy text-white">
      {/* Main Footer */}
      <div className="container-wide section-padding-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-display text-3xl font-medium">
              {agentName}
            </Link>
            <p className="mt-4 text-white/70 leading-relaxed">
              Your trusted partner for luxury real estate in Austin. 
              Personalized service, local expertise, exceptional results.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {settings?.instagram && (
                <a 
                  href={settings.instagram}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
              {settings?.facebook && (
                <a 
                  href={settings.facebook}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
              )}
              {settings?.linkedin && (
                <a 
                  href={settings.linkedin}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {settings?.youtube && (
                <a 
                  href={settings.youtube}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={18} />
                </a>
              )}
              {/* Show default icons if no social links set */}
              {!settings?.instagram && !settings?.facebook && !settings?.linkedin && (
                <>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/properties" className="text-white/70 hover:text-brand-gold transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/buyers/search" className="text-white/70 hover:text-brand-gold transition-colors">
                  Find Your Dream Home
                </Link>
              </li>
              <li>
                <Link href="/sellers/valuation" className="text-white/70 hover:text-brand-gold transition-colors">
                  Get Your Home&apos;s Value
                </Link>
              </li>
              <li>
                <Link href="/neighborhoods" className="text-white/70 hover:text-brand-gold transition-colors">
                  Explore Neighborhoods
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-brand-gold transition-colors">
                  About {agentName.split(' ')[0]}
                </Link>
              </li>
            </ul>
          </div>

          {/* Neighborhoods */}
          <div>
            <h4 className="font-display text-xl mb-6">Austin Areas</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/neighborhoods/downtown-austin" className="text-white/70 hover:text-brand-gold transition-colors">
                  Downtown Austin
                </Link>
              </li>
              <li>
                <Link href="/neighborhoods/westlake" className="text-white/70 hover:text-brand-gold transition-colors">
                  Westlake
                </Link>
              </li>
              <li>
                <Link href="/neighborhoods/tarrytown" className="text-white/70 hover:text-brand-gold transition-colors">
                  Tarrytown
                </Link>
              </li>
              <li>
                <Link href="/neighborhoods/zilker" className="text-white/70 hover:text-brand-gold transition-colors">
                  Zilker
                </Link>
              </li>
              <li>
                <Link href="/neighborhoods/travis-heights" className="text-white/70 hover:text-brand-gold transition-colors">
                  Travis Heights
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xl mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-3 text-white/70 hover:text-brand-gold transition-colors"
                >
                  <Phone size={18} className="text-brand-gold" />
                  {phone}
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-white/70 hover:text-brand-gold transition-colors"
                >
                  <Mail size={18} className="text-brand-gold" />
                  {email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/70">
                  <MapPin size={18} className="text-brand-gold flex-shrink-0 mt-1" />
                  <span>{address}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-wide py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} {agentName} Real Estate. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {legalLinks.map((link) => (
              link.url ? (
                <a
                  key={link._key || link.title}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white transition-colors"
                >
                  {link.title}
                </a>
              ) : (
                <span key={link._key || link.title} className="text-white/50">
                  {link.title}
                </span>
              )
            ))}
            {iabsDocumentUrl && (
              <a
                href={iabsDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors flex items-center gap-1"
              >
                <FileText size={14} />
                IABS (PDF)
              </a>
            )}
            <span className="text-white/30">|</span>
            <a 
              href="https://daflash.co.il" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
              Website by
              <Image 
                src="/images/daflash-logo.png" 
                alt="daflash" 
                width={60} 
                height={20}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
