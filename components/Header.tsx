'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { SiteSettings } from '@/lib/data-fetchers'

interface HeaderProps {
  settings?: SiteSettings
}

const navigation = [
  { name: 'Properties', href: '/properties' },
  {
    name: 'Buyers',
    href: '/buyers/search',
    submenu: [
      { name: 'Property Search', href: '/buyers/search' },
      { name: 'Communities', href: '/communities' },
    ]
  },
  {
    name: 'Sellers',
    href: '/sellers/valuation',
    submenu: [
      { name: 'Home Valuation', href: '/sellers/valuation' },
    ]
  },
  {
    name: 'Communities',
    href: '/communities',
    submenu: [
      { name: 'All Communities', href: '/communities' },
      { name: 'Austin', href: '/communities#austin' },
      { name: 'Bee Cave', href: '/communities#bee-cave' },
      { name: 'Cedar Park', href: '/communities#cedar-park' },
      { name: 'Georgetown', href: '/communities#georgetown' },
      { name: 'Lakeway', href: '/communities#lakeway' },
      { name: 'Leander', href: '/communities#leander' },
      { name: 'Pflugerville', href: '/communities#pflugerville' },
      { name: 'Round Rock', href: '/communities#round-rock' },
    ]
  },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export function Header({ settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const agentName = settings?.agentName || 'Merrav Berko'
  const phone = settings?.phone || '(512) 599-9995'
  const logo = settings?.logo

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-brand-navy/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-display text-2xl md:text-3xl text-white hover:text-brand-gold transition-colors"
          >
            {logo ? (
              <Image 
                src={logo} 
                alt={agentName} 
                width={180} 
                height={50} 
                className="h-10 w-auto"
              />
            ) : (
              agentName
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link 
                  href={item.href}
                  className="flex items-center gap-1 text-white/90 hover:text-brand-gold transition-colors text-sm uppercase tracking-wider font-medium"
                >
                  {item.name}
                  {item.submenu && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />}
                </Link>
                
                {/* Dropdown */}
                {item.submenu && (
                  <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-white rounded-lg shadow-xl py-2 min-w-[200px]">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-brand-navy hover:bg-brand-cream hover:text-brand-gold transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Phone - Desktop */}
            <a 
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="hidden md:flex items-center gap-2 text-white/80 hover:text-brand-gold transition-colors"
            >
              <Phone size={16} />
              <span className="text-sm">{phone}</span>
            </a>

            {/* CTA Button - Desktop */}
            <Link 
              href="/contact" 
              className="hidden lg:inline-flex btn-gold-sm"
            >
              Get In Touch
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 -mr-2 text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-6 border-t border-white/10">
            <nav className="pt-4 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-white/90 hover:text-brand-gold active:bg-white/10 transition-colors py-3 px-2 -mx-2 rounded text-lg"
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-4 space-y-1 mt-1 mb-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-white/60 hover:text-brand-gold active:bg-white/10 transition-colors py-2 px-2 -mx-2 rounded"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t border-white/10">
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-3 text-white/80 py-3 px-2 -mx-2 rounded active:bg-white/10"
              >
                <Phone size={20} />
                <span className="text-lg">{phone}</span>
              </a>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-gold w-full justify-center mt-4 h-14 text-base"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
