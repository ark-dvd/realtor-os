'use client'

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER COMPONENT
// Dynamic footer with tenant branding and compliance links
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Instagram, Facebook, Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { useTenant } from './TenantProvider'
import { getImageUrl } from '@/lib/sanity/client'

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL ICONS MAP
// ─────────────────────────────────────────────────────────────────────────────

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram size={20} />,
  facebook: <Facebook size={20} />,
  linkedin: <Linkedin size={20} />,
  twitter: <Twitter size={20} />,
  youtube: <Youtube size={20} />,
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER LINKS
// ─────────────────────────────────────────────────────────────────────────────

const FOOTER_LINKS = {
  properties: [
    { href: '/properties', label: 'All Properties' },
    { href: '/properties?status=active', label: 'For Sale' },
    { href: '/properties?status=sold', label: 'Recently Sold' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/dashboard', label: 'Client Portal' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// PORTABLE TEXT COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const portableTextComponents = {
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href: string } }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-accent-gold transition-colors"
      >
        {children}
      </a>
    ),
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function Footer() {
  const { tenant } = useTenant()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-charcoal text-white">
      {/* Main Footer */}
      <div className="container-cinematic py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            {tenant?.brokerageLogo ? (
              <Image
                src={getImageUrl(tenant.brokerageLogo, { width: 200 })}
                alt={tenant.brokerageName || 'Logo'}
                width={180}
                height={54}
                className="h-12 w-auto object-contain brightness-0 invert mb-6"
              />
            ) : (
              <div className="mb-6">
                <h3 className="font-heading text-2xl font-semibold">
                  {tenant?.agentName || 'RealtorOS'}
                </h3>
                {tenant?.brokerageName && (
                  <p className="text-white/60 text-sm mt-1">{tenant.brokerageName}</p>
                )}
              </div>
            )}

            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {tenant?.agentTitle || 'Your trusted real estate professional, dedicated to making your home buying or selling journey seamless and successful.'}
            </p>

            {/* Social Links */}
            {tenant?.socialLinks && (
              <div className="flex gap-4">
                {Object.entries(tenant.socialLinks).map(([platform, url]) => {
                  if (!url || !SOCIAL_ICONS[platform]) return null
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent-gold hover:text-neutral-charcoal transition-all"
                      aria-label={`Follow on ${platform}`}
                    >
                      {SOCIAL_ICONS[platform]}
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Properties Column */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Properties</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.properties.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              {tenant?.contactInfo?.phone && (
                <li>
                  <a
                    href={`tel:${tenant.contactInfo.phone}`}
                    className="flex items-start gap-3 text-white/70 hover:text-white transition-colors text-sm group"
                  >
                    <Phone size={18} className="flex-shrink-0 mt-0.5 group-hover:text-accent-gold" />
                    <span>{tenant.contactInfo.phone}</span>
                  </a>
                </li>
              )}
              {tenant?.contactInfo?.email && (
                <li>
                  <a
                    href={`mailto:${tenant.contactInfo.email}`}
                    className="flex items-start gap-3 text-white/70 hover:text-white transition-colors text-sm group"
                  >
                    <Mail size={18} className="flex-shrink-0 mt-0.5 group-hover:text-accent-gold" />
                    <span>{tenant.contactInfo.email}</span>
                  </a>
                </li>
              )}
              {tenant?.contactInfo?.address && (
                <li className="flex items-start gap-3 text-white/70 text-sm">
                  <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                  <span>
                    {tenant.contactInfo.address}
                    {tenant.contactInfo.city && `, ${tenant.contactInfo.city}`}
                    {tenant.contactInfo.state && `, ${tenant.contactInfo.state}`}
                    {tenant.contactInfo.zip && ` ${tenant.contactInfo.zip}`}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Footer / Compliance Section */}
      <div className="border-t border-white/10">
        <div className="container-cinematic py-8">
          {/* Legal Disclaimer (e.g., TREC) */}
          {tenant?.legalFooter && (
            <div className="text-white/50 text-xs leading-relaxed mb-6 prose prose-invert prose-sm max-w-none">
              <PortableText value={tenant.legalFooter} components={portableTextComponents} />
            </div>
          )}

          {/* Copyright & Links */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-xs">
            <p>
              © {currentYear} {tenant?.agentName || 'RealtorOS'}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span className="text-white/30">|</span>
              <span>
                Powered by{' '}
                <a
                  href="https://realtoros.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-gold transition-colors"
                >
                  RealtorOS
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
