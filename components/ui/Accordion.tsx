'use client'

// ═══════════════════════════════════════════════════════════════════════════
// ACCORDION COMPONENT
// Expandable sections for property details
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface AccordionItemData {
  id: string
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
}

interface AccordionProps {
  items: AccordionItemData[]
  allowMultiple?: boolean
  defaultOpen?: string[]
  className?: string
}

interface AccordionItemProps {
  item: AccordionItemData
  isOpen: boolean
  onToggle: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCORDION ITEM
// ─────────────────────────────────────────────────────────────────────────────

function AccordionItem({ item, isOpen, onToggle }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [item.content])

  return (
    <div
      className="accordion-item"
      data-state={isOpen ? 'open' : 'closed'}
    >
      {/* Trigger */}
      <button
        onClick={onToggle}
        className="accordion-trigger group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {item.icon && (
            <span className="text-accent-gold">{item.icon}</span>
          )}
          <span className="font-heading text-lg">{item.title}</span>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-neutral-silver group-hover:text-accent-gold transition-colors"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
            className="overflow-hidden"
          >
            <div ref={contentRef} className="accordion-content-inner">
              {item.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCORDION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen))

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        if (!allowMultiple) {
          newSet.clear()
        }
        newSet.add(id)
      }
      
      return newSet
    })
  }

  return (
    <div className={cn('divide-y divide-neutral-pearl', className)}>
      {items.map(item => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openItems.has(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY DETAILS ACCORDION
// Pre-configured accordion for property pages
// ─────────────────────────────────────────────────────────────────────────────

interface PropertyDetailsAccordionProps {
  financials?: {
    hoaFees?: number
    hoaFrequency?: string
    taxAmount?: number
    taxYear?: number
  }
  specs?: {
    yearBuilt?: number
    lotSize?: number
    lotSizeUnit?: string
    parking?: number
    stories?: number
  }
  amenities?: string[]
  className?: string
}

export function PropertyDetailsAccordion({
  financials,
  specs,
  amenities,
  className,
}: PropertyDetailsAccordionProps) {
  const items: AccordionItemData[] = []

  // Financial Details
  if (financials && (financials.hoaFees || financials.taxAmount)) {
    items.push({
      id: 'financials',
      title: 'Financial Details',
      content: (
        <div className="grid grid-cols-2 gap-4">
          {financials.hoaFees && (
            <div>
              <p className="text-sm text-neutral-silver">HOA Fees</p>
              <p className="font-semibold">
                ${financials.hoaFees.toLocaleString()}
                {financials.hoaFrequency && `/${financials.hoaFrequency}`}
              </p>
            </div>
          )}
          {financials.taxAmount && (
            <div>
              <p className="text-sm text-neutral-silver">
                Property Tax {financials.taxYear && `(${financials.taxYear})`}
              </p>
              <p className="font-semibold">
                ${financials.taxAmount.toLocaleString()}/year
              </p>
            </div>
          )}
        </div>
      ),
    })
  }

  // Property Details
  if (specs && (specs.yearBuilt || specs.lotSize || specs.parking)) {
    items.push({
      id: 'specs',
      title: 'Property Details',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {specs.yearBuilt && (
            <div>
              <p className="text-sm text-neutral-silver">Year Built</p>
              <p className="font-semibold">{specs.yearBuilt}</p>
            </div>
          )}
          {specs.lotSize && (
            <div>
              <p className="text-sm text-neutral-silver">Lot Size</p>
              <p className="font-semibold">
                {specs.lotSize.toLocaleString()} {specs.lotSizeUnit || 'sqft'}
              </p>
            </div>
          )}
          {specs.parking && (
            <div>
              <p className="text-sm text-neutral-silver">Parking</p>
              <p className="font-semibold">{specs.parking} spaces</p>
            </div>
          )}
          {specs.stories && (
            <div>
              <p className="text-sm text-neutral-silver">Stories</p>
              <p className="font-semibold">{specs.stories}</p>
            </div>
          )}
        </div>
      ),
    })
  }

  // Amenities
  if (amenities && amenities.length > 0) {
    items.push({
      id: 'amenities',
      title: 'Features & Amenities',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-neutral-slate"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-gold flex-shrink-0" />
              {amenity}
            </div>
          ))}
        </div>
      ),
    })
  }

  if (items.length === 0) return null

  return <Accordion items={items} allowMultiple className={className} />
}

export default Accordion
