// ═══════════════════════════════════════════════════════════════════════════
// REALTOROS - TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

import { PortableTextBlock } from '@portabletext/types'

// ─────────────────────────────────────────────────────────────────────────────
// TENANT / AGENT SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

export interface Branding {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontHeading: string
  fontBody: string
  logoUrl?: string
  logoAlt?: string
  faviconUrl?: string
}

export interface ContactInfo {
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  zip?: string
}

export interface SocialLinks {
  instagram?: string
  facebook?: string
  linkedin?: string
  twitter?: string
  youtube?: string
  tiktok?: string
}

export interface AISettings {
  maxDailyBudget: number
  customSystemPromptAdditions?: string
  enabledFeatures: string[]
}

export interface AgentSettings {
  _id: string
  _type: 'agentSettings'
  domain: string
  agentName: string
  agentTitle?: string
  agentBio?: PortableTextBlock[]
  agentImage?: SanityImage
  brokerageName: string
  brokerageLogo?: SanityImage
  branding: Branding
  contactInfo: ContactInfo
  socialLinks?: SocialLinks
  legalFooter?: PortableTextBlock[]
  aiSettings?: AISettings
  heroVideo?: {
    url: string
    posterImage?: SanityImage
  }
  heroImage?: SanityImage
  heroTagline?: string
  heroSubtagline?: string
  featuredPropertyIds?: string[]
  seoTitle?: string
  seoDescription?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY
// ─────────────────────────────────────────────────────────────────────────────

export type PropertyStatus = 'active' | 'pending' | 'sold' | 'coming_soon' | 'off_market'
export type HeroType = 'video' | 'image'

export interface PropertySpecs {
  bedrooms: number
  bathrooms: number
  squareFeet: number
  lotSize?: number
  lotSizeUnit?: 'sqft' | 'acres'
  yearBuilt?: number
  parking?: number
  stories?: number
  propertyType: string
}

export interface PropertyFinancials {
  hoaFees?: number
  hoaFrequency?: 'monthly' | 'quarterly' | 'annually'
  taxAmount?: number
  taxYear?: number
}

export interface PropertyAddress {
  street: string
  unit?: string
  city: string
  state: string
  zip: string
  neighborhood?: string
  county?: string
}

export interface PropertyDocument {
  _key: string
  title: string
  fileUrl: string
  fileType: string
  isPublic: boolean
}

export interface Property {
  _id: string
  _type: 'property'
  belongsToAgent: {
    _ref: string
  }
  title: string
  slug: {
    current: string
  }
  status: PropertyStatus
  price: number
  pricePerSqFt?: number
  address: PropertyAddress
  specs: PropertySpecs
  financials?: PropertyFinancials
  
  // Media
  heroType: HeroType
  heroVideo?: {
    url: string
    posterImage?: SanityImage
  }
  heroImage?: SanityImage
  galleryImages?: SanityImage[]
  floorPlanImage?: SanityImage
  virtualTourUrl?: string
  
  // Content
  headline?: string
  shortDescription?: string
  fullDescription?: PortableTextBlock[]
  highlights?: string[]
  amenities?: string[]
  
  // Documents
  documentsPublic?: PropertyDocument[]
  
  // Dates
  listDate?: string
  soldDate?: string
  
  // SEO
  seoTitle?: string
  seoDescription?: string
}

export interface PropertyCard {
  _id: string
  title: string
  slug: { current: string }
  status: PropertyStatus
  price: number
  address: PropertyAddress
  specs: PropertySpecs
  heroImage?: SanityImage
  shortDescription?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE DEAL (CLIENT DASHBOARD)
// ─────────────────────────────────────────────────────────────────────────────

export type TransactionStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export const TRANSACTION_STAGES: Record<TransactionStage, { title: string; description: string }> = {
  1: { title: 'Offer Submitted', description: 'Your offer has been submitted to the seller' },
  2: { title: 'Under Contract', description: 'Your offer was accepted! Contract is being finalized' },
  3: { title: 'Option Period', description: 'Time for inspections and due diligence' },
  4: { title: 'Inspections Complete', description: 'All inspections are done, reviewing results' },
  5: { title: 'Appraisal', description: 'Property appraisal in progress' },
  6: { title: 'Loan Processing', description: 'Mortgage documents being processed' },
  7: { title: 'Clear to Close', description: 'All conditions met, preparing for closing' },
  8: { title: 'Closed!', description: 'Congratulations on your new home!' },
}

export interface KeyDate {
  _key: string
  label: string
  date: string
  isCompleted: boolean
  notes?: string
}

export interface DealDocument {
  _key: string
  title: string
  fileUrl: string
  uploadedAt: string
  category: 'contract' | 'inspection' | 'appraisal' | 'loan' | 'closing' | 'other'
}

export interface ActiveDeal {
  _id: string
  _type: 'activeDeal'
  belongsToAgent: {
    _ref: string
  }
  clientEmail: string
  clientName: string
  clientPhone?: string
  
  property: {
    _ref: string
    title?: string
    address?: PropertyAddress
    price?: number
  }
  
  transactionStage: TransactionStage
  transactionType: 'purchase' | 'sale'
  
  offerPrice?: number
  contractPrice?: number
  earnestMoney?: number
  
  keyDates?: KeyDate[]
  dealDocumentsPrivate?: DealDocument[]
  
  notes?: PortableTextBlock[]
  
  createdAt: string
  updatedAt: string
}

// ─────────────────────────────────────────────────────────────────────────────
// SANITY IMAGE
// ─────────────────────────────────────────────────────────────────────────────

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface TenantContextType {
  tenant: AgentSettings | null
  isLoading: boolean
  error: string | null
}

export interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export interface AuthUser {
  id: string
  email: string
  name?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT PROPS
// ─────────────────────────────────────────────────────────────────────────────

export interface CinematicHeroProps {
  videoUrl?: string
  imageUrl?: string
  posterUrl?: string
  tagline?: string
  subtagline?: string
  ctaText?: string
  ctaHref?: string
  showScrollIndicator?: boolean
}

export interface PropertyCardProps {
  property: PropertyCard
  priority?: boolean
}

export interface PizzaTrackerProps {
  currentStage: TransactionStage
  keyDates?: KeyDate[]
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
}

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}
