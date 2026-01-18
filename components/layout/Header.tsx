'use client'

// ═══════════════════════════════════════════════════════════════════════════
// HEADER COMPONENT
// Dynamic header with tenant branding and navigation
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { useTenant } from './TenantProvider'
import { cn } from '@/lib/utils'
import { getImageUrl } from '@/lib/sanity/client'

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION LINKS
// ─────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

// ─────────────────────────────────────────────────────────────────────────────
// HEADER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function Header() {
  const { tenant } = useTenant()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-elegant py-3'
            : 'bg-transparent py-6'
        )}
      >
        <div className="container-cinematic">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3"
              >
                {tenant?.brokerageLogo ? (
                  <Image
                    src={getImageUrl(tenant.brokerageLogo, { width: 200 })}
                    alt={tenant.brokerageName || 'Logo'}
                    width={160}
                    height={48}
                    className="h-10 w-auto object-contain"
                    priority
                  />
                ) : (
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        'font-heading text-xl font-semibold tracking-tight transition-colors',
                        isScrolled ? 'text-neutral-charcoal' : 'text-white'
                      )}
                    >
                      {tenant?.agentName || 'RealtorOS'}
                    </span>
                    {tenant?.brokerageName && (
                      <span
                        className={cn(
                          'text-xs tracking-widest uppercase transition-colors',
                          isScrolled ? 'text-neutral-silver' : 'text-white/70'
                        )}
                      >
                        {tenant.brokerageName}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden lg:flex items-center gap-8"
            >
              {NAV_LINKS.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'relative font-body text-sm tracking-wide uppercase transition-colors line-animate',
                      isScrolled
                        ? 'text-neutral-charcoal hover:text-accent-gold'
                        : 'text-white/90 hover:text-white'
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </motion.ul>

            {/* Desktop CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:flex items-center gap-6"
            >
              {tenant?.contactInfo?.phone && (
                <a
                  href={`tel:${tenant.contactInfo.phone}`}
                  className={cn(
                    'flex items-center gap-2 text-sm transition-colors',
                    isScrolled
                      ? 'text-neutral-slate hover:text-accent-gold'
                      : 'text-white/80 hover:text-white'
                  )}
                >
                  <Phone size={16} />
                  <span className="hidden xl:inline">{tenant.contactInfo.phone}</span>
                </a>
              )}
              
              <Link
                href="/contact"
                className={cn(
                  'btn-primary text-xs',
                  !isScrolled && 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white hover:text-neutral-charcoal'
                )}
              >
                <span>Schedule a Call</span>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'lg:hidden relative z-10 p-2 transition-colors',
                isScrolled || isMobileMenuOpen
                  ? 'text-neutral-charcoal'
                  : 'text-white'
              )}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-dramatic"
            >
              <div className="flex flex-col h-full pt-24 pb-8 px-8">
                {/* Navigation */}
                <nav className="flex-1">
                  <ul className="space-y-1">
                    {NAV_LINKS.map((link, index) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-4 font-heading text-2xl text-neutral-charcoal hover:text-accent-gold transition-colors border-b border-neutral-pearl"
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Contact Info */}
                <div className="space-y-4 pt-8 border-t border-neutral-pearl">
                  {tenant?.contactInfo?.phone && (
                    <a
                      href={`tel:${tenant.contactInfo.phone}`}
                      className="flex items-center gap-3 text-neutral-slate hover:text-accent-gold transition-colors"
                    >
                      <Phone size={18} />
                      <span>{tenant.contactInfo.phone}</span>
                    </a>
                  )}
                  {tenant?.contactInfo?.email && (
                    <a
                      href={`mailto:${tenant.contactInfo.email}`}
                      className="flex items-center gap-3 text-neutral-slate hover:text-accent-gold transition-colors"
                    >
                      <Mail size={18} />
                      <span>{tenant.contactInfo.email}</span>
                    </a>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-accent mt-6 w-full justify-center"
                >
                  Schedule a Call
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
