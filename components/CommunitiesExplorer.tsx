'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, GraduationCap, Clock, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { Community, City } from '@/lib/data-fetchers'

interface CommunitiesExplorerProps {
  communities: Community[]
  cities: City[]
}

// Price ranges for filtering
const PRICE_RANGES = [
  { label: 'All Prices', value: 'all', min: 0, max: Infinity },
  { label: 'Under $500K', value: 'under-500k', min: 0, max: 500000 },
  { label: '$500K - $750K', value: '500k-750k', min: 500000, max: 750000 },
  { label: '$750K - $1M', value: '750k-1m', min: 750000, max: 1000000 },
  { label: '$1M - $1.5M', value: '1m-1.5m', min: 1000000, max: 1500000 },
  { label: '$1.5M+', value: '1.5m-plus', min: 1500000, max: Infinity },
]

// School districts
const SCHOOL_DISTRICTS = [
  'All Districts',
  'Austin ISD',
  'Eanes ISD',
  'Leander ISD',
  'Round Rock ISD',
  'Pflugerville ISD',
  'Lake Travis ISD',
  'Georgetown ISD',
  'Hutto ISD',
]

// Commute ranges
const COMMUTE_RANGES = [
  { label: 'Any Commute', value: 'all' },
  { label: 'Under 15 min', value: 'under-15', maxMins: 15 },
  { label: '15-25 min', value: '15-25', maxMins: 25 },
  { label: '25-35 min', value: '25-35', maxMins: 35 },
  { label: '35+ min', value: '35-plus', maxMins: Infinity },
]

// Helper to parse price string to number
function parsePrice(priceStr: string): number {
  if (!priceStr) return 0
  // Handle ranges like "$500K - $700K" - take the lower value
  const match = priceStr.match(/\$?([\d,.]+)\s*([KkMm])?/)
  if (!match) return 0
  let value = parseFloat(match[1].replace(/,/g, ''))
  if (match[2]?.toUpperCase() === 'K') value *= 1000
  if (match[2]?.toUpperCase() === 'M') value *= 1000000
  return value
}

// Helper to parse commute time to minutes
function parseCommute(commuteStr: string): number {
  if (!commuteStr) return Infinity
  // Handle formats like "20-30 mins" or "15 min" - take the lower value
  const match = commuteStr.match(/(\d+)/)
  return match ? parseInt(match[1]) : Infinity
}

export function CommunitiesExplorer({ communities, cities }: CommunitiesExplorerProps) {
  const [search, setSearch] = useState('')
  const [priceRange, setPriceRange] = useState('all')
  const [schoolDistrict, setSchoolDistrict] = useState('All Districts')
  const [commuteFilter, setCommuteFilter] = useState('all')
  const [commuteTo, setCommuteTo] = useState<'downtown' | 'domain'>('downtown')
  const [showFilters, setShowFilters] = useState(false)

  // Filter communities based on all criteria
  const filteredCommunities = useMemo(() => {
    return communities.filter(community => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const cityName = community.city?.name || ''
        const matchesSearch =
          community.name.toLowerCase().includes(searchLower) ||
          cityName.toLowerCase().includes(searchLower) ||
          community.tagline?.toLowerCase().includes(searchLower) ||
          community.description?.toLowerCase().includes(searchLower) ||
          community.schoolDistrict?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Price filter
      if (priceRange !== 'all') {
        const range = PRICE_RANGES.find(r => r.value === priceRange)
        if (range) {
          const price = parsePrice(community.avgPrice)
          if (price < range.min || price >= range.max) return false
        }
      }

      // School district filter
      if (schoolDistrict !== 'All Districts') {
        if (!community.schoolDistrict?.includes(schoolDistrict.replace(' ISD', ''))) {
          return false
        }
      }

      // Commute filter
      if (commuteFilter !== 'all') {
        const range = COMMUTE_RANGES.find(r => r.value === commuteFilter)
        if (range && range.maxMins) {
          const commuteTime = commuteTo === 'downtown'
            ? parseCommute(community.commute?.toDowntown || '')
            : parseCommute(community.commute?.toDomain || '')
          if (commuteTime > range.maxMins) return false
        }
      }

      return true
    })
  }, [communities, search, priceRange, schoolDistrict, commuteFilter, commuteTo])

  // Group filtered communities by city
  const groupedCommunities = useMemo(() => {
    const grouped = new Map<City, Community[]>()

    for (const city of cities) {
      const cityComms = filteredCommunities.filter(c => {
        const commCitySlug = c.city?.slug || c.citySlug
        if (!commCitySlug && city.slug === 'austin') return true
        return commCitySlug === city.slug
      })
      if (cityComms.length > 0) {
        grouped.set(city, cityComms)
      }
    }

    return grouped
  }, [filteredCommunities, cities])

  const hasActiveFilters = priceRange !== 'all' || schoolDistrict !== 'All Districts' || commuteFilter !== 'all'
  const activeFilterCount = [
    priceRange !== 'all',
    schoolDistrict !== 'All Districts',
    commuteFilter !== 'all'
  ].filter(Boolean).length

  const clearFilters = () => {
    setSearch('')
    setPriceRange('all')
    setSchoolDistrict('All Districts')
    setCommuteFilter('all')
  }

  return (
    <>
      {/* Search & Filters Bar */}
      <section className="bg-white border-b sticky top-20 z-40 shadow-sm">
        <div className="container-wide py-4">
          {/* Main Search Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                placeholder="Search communities, cities, or school districts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold text-base"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50"
            >
              <SlidersHorizontal size={20} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-brand-gold text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Desktop Filters */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Price Filter */}
              <div className="relative">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-white cursor-pointer text-sm"
                >
                  {PRICE_RANGES.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
              </div>

              {/* School District Filter */}
              <div className="relative">
                <select
                  value={schoolDistrict}
                  onChange={(e) => setSchoolDistrict(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-white cursor-pointer text-sm"
                >
                  {SCHOOL_DISTRICTS.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
              </div>

              {/* Commute Filter */}
              <div className="relative flex items-center gap-1">
                <select
                  value={commuteFilter}
                  onChange={(e) => setCommuteFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-white cursor-pointer text-sm"
                >
                  {COMMUTE_RANGES.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
                {commuteFilter !== 'all' && (
                  <select
                    value={commuteTo}
                    onChange={(e) => setCommuteTo(e.target.value as 'downtown' | 'domain')}
                    className="appearance-none pl-3 pr-8 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-white cursor-pointer text-sm"
                  >
                    <option value="downtown">to Downtown</option>
                    <option value="domain">to Domain</option>
                  </select>
                )}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={16} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="sm:hidden mt-4 pt-4 border-t space-y-3">
              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 bg-white"
                >
                  {PRICE_RANGES.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* School District Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">School District</label>
                <select
                  value={schoolDistrict}
                  onChange={(e) => setSchoolDistrict(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 bg-white"
                >
                  {SCHOOL_DISTRICTS.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Commute Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Commute Time</label>
                <div className="flex gap-2">
                  <select
                    value={commuteFilter}
                    onChange={(e) => setCommuteFilter(e.target.value)}
                    className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 bg-white"
                  >
                    {COMMUTE_RANGES.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                  {commuteFilter !== 'all' && (
                    <select
                      value={commuteTo}
                      onChange={(e) => setCommuteTo(e.target.value as 'downtown' | 'domain')}
                      className="px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 bg-white"
                    >
                      <option value="downtown">Downtown</option>
                      <option value="domain">Domain</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  <X size={16} />
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="mt-3 flex items-center justify-between text-sm">
            <p className="text-neutral-600">
              <span className="font-medium text-brand-navy">{filteredCommunities.length}</span>
              {filteredCommunities.length === 1 ? ' community' : ' communities'} found
              {(search || hasActiveFilters) && (
                <span className="text-neutral-400"> (of {communities.length} total)</span>
              )}
            </p>

            {/* City Jump Links */}
            {groupedCommunities.size > 0 && (
              <nav className="hidden md:flex overflow-x-auto gap-2">
                {Array.from(groupedCommunities.keys()).map((city) => (
                  <a
                    key={city.slug}
                    href={`#${city.slug}`}
                    className="flex-shrink-0 px-3 py-1 rounded-full bg-brand-cream hover:bg-brand-gold hover:text-white transition-colors text-xs font-medium text-brand-navy"
                  >
                    {city.name} ({groupedCommunities.get(city)?.length})
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
      </section>

      {/* Communities by City */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide space-y-16">
          {filteredCommunities.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-neutral-400" size={28} />
              </div>
              <h3 className="font-display text-2xl text-brand-navy mb-2">No communities found</h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Try adjusting your search or filters to find communities that match your criteria.
              </p>
              <button
                onClick={clearFilters}
                className="btn-secondary"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            Array.from(groupedCommunities.entries()).map(([city, cityCommunities]) => (
              <div key={city.slug} id={city.slug} className="scroll-mt-48">
                {/* City Header */}
                <div className="mb-8">
                  <h2 className="font-display text-3xl text-brand-navy mb-2">
                    {city.name}
                    <span className="text-lg text-neutral-400 font-sans ml-3">
                      {cityCommunities.length} {cityCommunities.length === 1 ? 'community' : 'communities'}
                    </span>
                  </h2>
                  {city.description && (
                    <p className="text-neutral-600 max-w-2xl">{city.description}</p>
                  )}
                </div>

                {/* Communities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cityCommunities.map((community, index) => (
                    <Link
                      key={community._id || community.slug}
                      href={`/communities/${community.slug}`}
                      className="group bg-white overflow-hidden card-hover"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={community.image || 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&q=80'}
                          alt={community.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="font-display text-2xl text-white group-hover:text-brand-gold transition-colors">
                            {community.name}
                          </h3>
                          <p className="text-white/80 text-sm mt-1 line-clamp-1">
                            {community.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                          {community.vibe}
                        </p>

                        {/* Quick Stats */}
                        <div className="space-y-2 mb-4">
                          {community.commute?.toDowntown && (
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                              <Clock size={14} className="text-brand-gold" />
                              <span>{community.commute.toDowntown} to Downtown</span>
                            </div>
                          )}
                          {community.schoolDistrict && (
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                              <GraduationCap size={14} className="text-brand-gold" />
                              <span>{community.schoolDistrict}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                          <span className="text-sm text-neutral-500">Avg. Home Price</span>
                          <span className="font-display text-lg text-brand-gold">
                            {community.avgPrice}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}
