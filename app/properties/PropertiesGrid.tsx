'use client'

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTIES GRID
// Client component with filtering and sorting
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { PropertyCard, PropertyCardSkeleton } from '@/components/property/PropertyCard'
import type { PropertyCard as PropertyCardType, PropertyStatus } from '@/lib/types'
import { cn, formatPrice } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface PropertiesGridProps {
  initialProperties: PropertyCardType[]
}

interface Filters {
  search: string
  status: PropertyStatus | 'all'
  minPrice: number
  maxPrice: number
  minBeds: number
  minBaths: number
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'beds'
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Properties' },
  { value: 'active', label: 'For Sale' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
  { value: 'coming_soon', label: 'Coming Soon' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'beds', label: 'Bedrooms' },
]

const PRICE_RANGES = [
  { min: 0, max: 500000, label: 'Under $500K' },
  { min: 500000, max: 1000000, label: '$500K - $1M' },
  { min: 1000000, max: 2000000, label: '$1M - $2M' },
  { min: 2000000, max: 5000000, label: '$2M - $5M' },
  { min: 5000000, max: Infinity, label: '$5M+' },
]

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function PropertiesGrid({ initialProperties }: PropertiesGridProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    minPrice: 0,
    maxPrice: Infinity,
    minBeds: 0,
    minBaths: 0,
    sortBy: 'newest',
  })

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = [...initialProperties]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(searchLower) ||
          p.address.city.toLowerCase().includes(searchLower) ||
          p.address.neighborhood?.toLowerCase().includes(searchLower)
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(p => p.status === filters.status)
    }

    // Price filter
    result = result.filter(
      p => p.price >= filters.minPrice && p.price <= filters.maxPrice
    )

    // Beds filter
    if (filters.minBeds > 0) {
      result = result.filter(p => p.specs.bedrooms >= filters.minBeds)
    }

    // Baths filter
    if (filters.minBaths > 0) {
      result = result.filter(p => p.specs.bathrooms >= filters.minBaths)
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'beds':
        result.sort((a, b) => b.specs.bedrooms - a.specs.bedrooms)
        break
      case 'newest':
      default:
        // Assume already sorted by newest
        break
    }

    return result
  }, [initialProperties, filters])

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.status !== 'all') count++
    if (filters.minPrice > 0 || filters.maxPrice < Infinity) count++
    if (filters.minBeds > 0) count++
    if (filters.minBaths > 0) count++
    return count
  }, [filters])

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      minPrice: 0,
      maxPrice: Infinity,
      minBeds: 0,
      minBaths: 0,
      sortBy: 'newest',
    })
  }

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-silver" size={20} />
          <input
            type="text"
            placeholder="Search by city, neighborhood, or address..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-pearl rounded-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value as Filters['sortBy'] }))}
            className="appearance-none w-full md:w-48 px-4 py-3 pr-10 bg-white border border-neutral-pearl rounded-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold cursor-pointer"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-silver pointer-events-none" size={20} />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-6 py-3 border rounded-sm transition-colors',
            showFilters || activeFilterCount > 0
              ? 'bg-neutral-charcoal text-white border-neutral-charcoal'
              : 'bg-white text-neutral-charcoal border-neutral-pearl hover:border-neutral-charcoal'
          )}
        >
          <SlidersHorizontal size={20} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-accent-gold text-neutral-charcoal text-xs flex items-center justify-center font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-white p-6 border border-neutral-pearl rounded-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-neutral-slate mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={e => setFilters(f => ({ ...f, status: e.target.value as Filters['status'] }))}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-pearl rounded-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold"
                  >
                    {STATUS_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-neutral-slate mb-2">
                    Price Range
                  </label>
                  <select
                    value={`${filters.minPrice}-${filters.maxPrice}`}
                    onChange={e => {
                      const [min, max] = e.target.value.split('-').map(Number)
                      setFilters(f => ({ ...f, minPrice: min, maxPrice: max || Infinity }))
                    }}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-pearl rounded-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold"
                  >
                    <option value="0-Infinity">Any Price</option>
                    {PRICE_RANGES.map(range => (
                      <option key={range.label} value={`${range.min}-${range.max}`}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-neutral-slate mb-2">
                    Bedrooms
                  </label>
                  <select
                    value={filters.minBeds}
                    onChange={e => setFilters(f => ({ ...f, minBeds: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-pearl rounded-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold"
                  >
                    <option value={0}>Any</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>
                        {num}+ beds
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-neutral-slate mb-2">
                    Bathrooms
                  </label>
                  <select
                    value={filters.minBaths}
                    onChange={e => setFilters(f => ({ ...f, minBaths: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-pearl rounded-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold"
                  >
                    <option value={0}>Any</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>
                        {num}+ baths
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reset Button */}
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="mt-4 flex items-center gap-2 text-sm text-neutral-silver hover:text-accent-gold transition-colors"
                >
                  <X size={16} />
                  Reset all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-neutral-silver">
          Showing <span className="font-semibold text-neutral-charcoal">{filteredProperties.length}</span> properties
        </p>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProperties.map((property, index) => (
            <PropertyCard
              key={property._id}
              property={property}
              priority={index < 6}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-neutral-silver text-lg mb-4">
            No properties match your criteria
          </p>
          <button
            onClick={resetFilters}
            className="btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default PropertiesGrid
