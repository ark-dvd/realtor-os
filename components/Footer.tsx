import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      {/* Main Footer */}
      <div className="container-wide section-padding-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-display text-3xl font-medium">
              Merrav Berko
            </Link>
            <p className="mt-4 text-white/70 leading-relaxed">
              Your trusted partner for luxury real estate in Austin. 
              Personalized service, local expertise, exceptional results.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"
              >
                <Linkedin size={18} />
              </a>
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
                  About Merrav
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
                  href="tel:+15125999995" 
                  className="flex items-center gap-3 text-white/70 hover:text-brand-gold transition-colors"
                >
                  <Phone size={18} className="text-brand-gold" />
                  (512) 599-9995
                </a>
              </li>
              <li>
                <a 
                  href="mailto:merrav@merravberko.com" 
                  className="flex items-center gap-3 text-white/70 hover:text-brand-gold transition-colors"
                >
                  <Mail size={18} className="text-brand-gold" />
                  merrav@merravberko.com
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/70">
                  <MapPin size={18} className="text-brand-gold flex-shrink-0 mt-1" />
                  <span>
                    Austin, Texas
                  </span>
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
            © {new Date().getFullYear()} Merrav Berko Real Estate. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-white/50 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/50 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a 
              href="https://www.trec.texas.gov/forms/consumer-protection-notice" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors"
            >
              TREC Consumer Protection
            </a>
            <Link href="/admin" className="text-white/30 hover:text-white/50 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
