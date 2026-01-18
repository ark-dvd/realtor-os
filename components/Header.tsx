'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'

const navigation = {
  buyers: [
    { name: 'Find Your Dream Home', href: '/buyers/search' },
    { name: 'Mortgage Calculator', href: '/buyers/calculator' },
    { name: 'Buyers Guide', href: '/buyers/guide' },
  ],
  sellers: [
    { name: "Your Home's Value", href: '/sellers/valuation' },
    { name: 'List Your Home', href: '/sellers/list' },
    { name: 'Sellers Guide', href: '/sellers/guide' },
  ],
  community: [
    { name: 'Neighborhoods', href: '/neighborhoods' },
    { name: 'Local Market Trends', href: '/community/market-trends' },
    { name: 'School Finder', href: '/community/schools' },
  ],
  about: [
    { name: 'About Merav', href: '/about' },
    { name: 'Testimonials', href: '/about/testimonials' },
    { name: 'Contact', href: '/contact' },
  ],
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container-wide">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <span className={`font-display text-2xl lg:text-3xl font-medium tracking-tight transition-colors duration-300 ${
              isScrolled ? 'text-brand-navy' : 'text-white'
            }`}>
              Merav Berko
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Buyers Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('buyers')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className={`nav-link flex items-center gap-1 ${
                isScrolled ? 'text-brand-navy' : 'text-white'
              }`}>
                Buyers <ChevronDown size={14} />
              </button>
              {openDropdown === 'buyers' && (
                <div className="absolute top-full left-0 pt-2 animate-fade-in">
                  <div className="bg-white shadow-xl border border-neutral-100 py-2 min-w-[200px]">
                    {navigation.buyers.map((item) => (
                      <Link 
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-brand-navy hover:bg-brand-cream hover:text-brand-gold transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sellers Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('sellers')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className={`nav-link flex items-center gap-1 ${
                isScrolled ? 'text-brand-navy' : 'text-white'
              }`}>
                Sellers <ChevronDown size={14} />
              </button>
              {openDropdown === 'sellers' && (
                <div className="absolute top-full left-0 pt-2 animate-fade-in">
                  <div className="bg-white shadow-xl border border-neutral-100 py-2 min-w-[200px]">
                    {navigation.sellers.map((item) => (
                      <Link 
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-brand-navy hover:bg-brand-cream hover:text-brand-gold transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Properties */}
            <Link 
              href="/properties" 
              className={`nav-link ${isScrolled ? 'text-brand-navy' : 'text-white'}`}
            >
              Properties
            </Link>

            {/* Community Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('community')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className={`nav-link flex items-center gap-1 ${
                isScrolled ? 'text-brand-navy' : 'text-white'
              }`}>
                Community <ChevronDown size={14} />
              </button>
              {openDropdown === 'community' && (
                <div className="absolute top-full left-0 pt-2 animate-fade-in">
                  <div className="bg-white shadow-xl border border-neutral-100 py-2 min-w-[200px]">
                    {navigation.community.map((item) => (
                      <Link 
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-brand-navy hover:bg-brand-cream hover:text-brand-gold transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* About Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('about')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className={`nav-link flex items-center gap-1 ${
                isScrolled ? 'text-brand-navy' : 'text-white'
              }`}>
                About <ChevronDown size={14} />
              </button>
              {openDropdown === 'about' && (
                <div className="absolute top-full left-0 pt-2 animate-fade-in">
                  <div className="bg-white shadow-xl border border-neutral-100 py-2 min-w-[200px]">
                    {navigation.about.map((item) => (
                      <Link 
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-brand-navy hover:bg-brand-cream hover:text-brand-gold transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <Link 
              href="/contact" 
              className="btn-gold text-sm py-3 px-6"
            >
              <Phone size={16} />
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 ${isScrolled ? 'text-brand-navy' : 'text-white'}`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-neutral-100 animate-slide-down">
            <div className="py-4 px-6 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Buyers</p>
                {navigation.buyers.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-brand-navy hover:text-brand-gold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Sellers</p>
                {navigation.sellers.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-brand-navy hover:text-brand-gold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Link 
                href="/properties"
                className="block py-2 text-brand-navy hover:text-brand-gold font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Properties
              </Link>
              <Link 
                href="/neighborhoods"
                className="block py-2 text-brand-navy hover:text-brand-gold font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Neighborhoods
              </Link>
              <Link 
                href="/about"
                className="block py-2 text-brand-navy hover:text-brand-gold font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact"
                className="btn-gold w-full justify-center mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Merav
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
