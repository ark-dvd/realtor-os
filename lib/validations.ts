import { z } from 'zod'

// ════════════════════════════════════════════════════════════════════════════════
// NEIGHBORHOOD SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const SchoolSchema = z.object({
  _key: z.string().optional(),
  name: z.string().min(1, 'School name is required'),
  type: z.enum(['Elementary', 'Middle', 'High School']),
  rating: z.number().min(1).max(10),
  note: z.string().optional(),
})

export const HighlightSchema = z.object({
  _key: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
})

export const NeighborhoodInputSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  tagline: z.string().min(1).max(200),
  vibe: z.string().min(1).max(500),
  description: z.string().min(1).max(2000),
  population: z.string().max(50).optional(),
  commute: z.object({
    toDowntown: z.string().max(50).optional(),
    toDomain: z.string().max(50).optional(),
  }).optional(),
  schoolDistrict: z.string().max(100).optional(),
  schools: z.array(SchoolSchema).max(20).optional(),
  whyPeopleLove: z.array(z.string().max(500)).max(10).optional(),
  highlights: z.array(HighlightSchema).max(20).optional(),
  avgPrice: z.string().min(1).max(50),
  imageAssetId: z.string().optional(),
  order: z.number().min(0).max(1000).optional(),
  isActive: z.boolean().optional(),
})

export type NeighborhoodInput = z.infer<typeof NeighborhoodInputSchema>

// ════════════════════════════════════════════════════════════════════════════════
// PROPERTY SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const PropertyInputSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  status: z.enum(['for-sale', 'pending', 'sold', 'off-market']).default('for-sale'),
  price: z.number().min(0).max(100000000),
  address: z.object({
    street: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(50).optional(),
    zip: z.string().max(20).optional(),
  }).optional(),
  beds: z.number().min(0).max(50).optional(),
  baths: z.number().min(0).max(50).optional(),
  sqft: z.number().min(0).max(100000).optional(),
  lotSize: z.number().min(0).max(1000).optional(),
  yearBuilt: z.number().min(1800).max(2100).optional(),
  garage: z.number().min(0).max(20).optional(),
  mlsNumber: z.string().max(50).optional(),
  shortDescription: z.string().max(1000).optional(),
  features: z.array(z.string().max(100)).max(50).optional(),
  heroImageAssetId: z.string().optional(),
  neighborhoodId: z.string().optional(),
})

export type PropertyInput = z.infer<typeof PropertyInputSchema>

// ════════════════════════════════════════════════════════════════════════════════
// DEAL SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const DealInputSchema = z.object({
  _id: z.string().optional(),
  clientName: z.string().min(1, 'Client name is required').max(200),
  clientEmail: z.string().email('Valid email required').max(200),
  clientPhone: z.string().max(30).optional(),
  dealType: z.enum(['buying', 'selling']).default('buying'),
  propertyAddress: z.string().max(300).optional(),
  price: z.number().min(0).max(100000000).optional(),
  transactionStage: z.number().min(1).max(8).default(1),
  keyDates: z.object({
    contractDate: z.string().optional(),
    optionPeriodEnds: z.string().optional(),
    inspectionDate: z.string().optional(),
    appraisalDate: z.string().optional(),
    closingDate: z.string().optional(),
  }).optional(),
  notes: z.string().max(2000).optional(),
  isActive: z.boolean().default(true),
  propertyId: z.string().optional(),
})

export type DealInput = z.infer<typeof DealInputSchema>

// ════════════════════════════════════════════════════════════════════════════════
// SITE SETTINGS SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const SiteSettingsInputSchema = z.object({
  _id: z.string().optional(),
  siteTitle: z.string().max(200).optional(),
  heroHeadline: z.string().max(200).optional(),
  heroSubheadline: z.string().max(500).optional(),
  heroMediaType: z.enum(['images', 'video']).optional(),
  agentName: z.string().max(200).optional(),
  agentTitle: z.string().max(200).optional(),
  agentPhotoAssetId: z.string().optional(),
  aboutHeadline: z.string().max(200).optional(),
  aboutText: z.string().max(5000).optional(),
  aboutStats: z.array(z.object({
    _key: z.string().optional(),
    value: z.string().max(50),
    label: z.string().max(100),
  })).max(10).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().max(200).optional().or(z.literal('')),
  address: z.string().max(300).optional(),
  instagram: z.string().url().max(500).optional().or(z.literal('')),
  facebook: z.string().url().max(500).optional().or(z.literal('')),
  linkedin: z.string().url().max(500).optional().or(z.literal('')),
})

export type SiteSettingsInput = z.infer<typeof SiteSettingsInputSchema>

// ════════════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ════════════════════════════════════════════════════════════════════════════════

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`) }
}

export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = validate(schema, data)
  if (!result.success) throw new Error(`Validation failed: ${result.errors.join(', ')}`)
  return result.data
}
